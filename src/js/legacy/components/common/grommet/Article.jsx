import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import Box from './Box';
import KeyboardAccelerators from '../../utils/KeyboardAccelerators';
import { isFormElement, filterByFocusable } from '../../utils/DOM';
import Props from '../../utils/Props';
import Scroll from '../../utils/Scroll';
import Responsive from '../../utils/Responsive';
import Button from './Button';

import CSSClassnames from '../../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.ARTICLE;
const DEFAULT_PLAY_INTERVAL = 10000; // 10s

export default class Article extends Component {

  constructor(props, context) {
    super(props, context);

    this.onScroll = this.onScroll.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onTogglePlay = this.onTogglePlay.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.checkControls = this.checkControls.bind(this);
    this.checkPreviousNextControls =
      this.checkPreviousNextControls.bind(this);
    this.onResponsive = this.onResponsive.bind(this);
    this.updateHiddenElements = this.updateHiddenElements.bind(this);
    this.updateProgress = this.updateProgress.bind(this);

    // Necessary to detect for Firefox or Edge to implement accessibility
    // tabbing
    const accessibilityTabbingCompatible =
      typeof navigator !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1 &&
      navigator.userAgent.indexOf('Edge') === -1;

    this.state = {
      selectedIndex: props.selected || 0,
      playing: false,
      accessibilityTabbingCompatible: accessibilityTabbingCompatible
    };
  }

  componentDidMount () {
    this.propsSetup(this.props);
    if (this.state.selectedIndex) {
      this.onSelect(this.state.selectedIndex);
    }
  }

  componentWillReceiveProps (nextProps) {
    if (! nextProps.scrollStep && this.props.scrollStep) {
      KeyboardAccelerators.stopListeningToKeyboard(this, this.keys);
      document.removeEventListener('wheel', this.onWheel);
      window.removeEventListener('resize', this.onResize);
    }
    if (! nextProps.onProgress && this.props.onProgress) {
      if (this.responsive) {
        this.responsive.stop();
      }
      if (this.props.onProgress) {
        window.removeEventListener('scroll', this.updateProgress);
      }
    }

    this.propsSetup(nextProps);

    // allow updates to selected props to trigger new chapter select
    if ((typeof nextProps.selected !== 'undefined') &&
      (nextProps.selected !== null) &&
      (nextProps.selected !== this.state.selectedIndex)) {
      this.onSelect(nextProps.selected);
    }
  }

  componentWillUnmount () {
    if (this.props.scrollStep) {
      KeyboardAccelerators.stopListeningToKeyboard(this, this.keys);
      document.removeEventListener('wheel', this.onWheel);
      window.removeEventListener('resize', this.onResize);
    }
    if (this.responsive) {
      this.responsive.stop();
    }
    if (this.props.onProgress) {
      window.removeEventListener('scroll', this.updateProgress);
    }
  }

  propsSetup (props) {
    const { direction, full, onProgress, scrollStep } = props;
    if (scrollStep) {
      if (full) {
        console.warn('Article cannot use `scrollStep` with `full`.');
      }

      this.keys = {up: this.onPrevious, down: this.onNext};
      if ('row' === direction) {
        this.keys = {
          left: this.onPrevious,
          right: this.onNext
        };

        if (this.state.accessibilityTabbingCompatible) {
          this.updateHiddenElements();
        }
      }
      //keys.space = this.onTogglePlay;
      KeyboardAccelerators.startListeningToKeyboard(this, this.keys);

      document.addEventListener('wheel', this.onWheel);
      window.addEventListener('resize', this.onResize);

      this.checkControls();

      if ('row' === direction) {
        this.responsive = Responsive.start(this.onResponsive);
      }
    }

    if (onProgress) {
      window.addEventListener('scroll', this.updateProgress);

      if (direction === 'row') {
        this.responsive = Responsive.start(this.onResponsive);
      }
    }
  }

  childDOMNode (index) {
    const componentElement = findDOMNode(this.componentRef);
    return componentElement.children[index];
  }

  checkPreviousNextControls (currentScroll, nextProp, prevProp) {
    const { selectedIndex } = this.state;
    if (currentScroll > 0) {
      const nextStepNode = this.childDOMNode(selectedIndex + 1);
      const previousStepNode = this.childDOMNode(selectedIndex - 1);

      if (nextStepNode) {
        const nextStepPosition = (
          nextStepNode.getBoundingClientRect()[nextProp]
        ) * (selectedIndex + 1);

        if (currentScroll > nextStepPosition) {
          this.setState({selectedIndex: selectedIndex + 1});
        }
      }

      if (previousStepNode) {
        const previousStepPosition = (
          previousStepNode.getBoundingClientRect()[prevProp]
        ) * selectedIndex;

        if (currentScroll < previousStepPosition) {
          this.setState({selectedIndex: selectedIndex - 1});
        }
      }
    }
  }

  checkControls () {
    const { direction } = this.props;
    if (direction === 'row') {
      const currentScroll = this.componentRef.boxContainerRef.scrollLeft;
      this.checkPreviousNextControls(currentScroll, 'left', 'right');
    } else {
      const currentScroll = this.componentRef.boxContainerRef.scrollTop;
      this.checkPreviousNextControls(currentScroll, 'top', 'bottom');
    }
  }

  visibleIndexes () {
    const { children, direction } = this.props;
    let result = [];
    const childCount = React.Children.count(children);
    const limit = ('row' === direction) ? window.innerWidth :
      window.innerHeight;
    for (let index = 0; index < childCount; index += 1) {
      const childElement = this.childDOMNode(index);
      const rect = childElement.getBoundingClientRect();
      // ignore small drifts of 10 pixels on either end
      if ('row' === direction) {
        if (rect.right > 10 && rect.left < (limit - 10)) {
          result.push(index);
        } else if (result.length > 0) {
          break;
        }
      } else {
        if (rect.bottom > 10 && rect.top < (limit - 10)) {
          result.push(index);
        } else if (result.length > 0) {
          break;
        }
      }
    }
    return result;
  }

  shortTimer (name, duration) {
    if (! this[name]) {
      this[name] = true;
    }
    const timerName = `${this[name]}Timer`;
    clearTimeout(this[timerName]);
    this[timerName] = setTimeout(() => {
      this[name] = false;
    }, duration);
  }

  onWheel (event) {
    const { direction } = this.props;
    if ('row' === direction) {
      if (this.scrollingHorizontally) {
        // no-op
      } else if (! this.scrollingVertically) {
        if (Math.abs(event.deltaY * 2) > Math.abs(event.deltaX)) {
          // user is scrolling vertically
          this.shortTimer('_scrollingVertically', 1000);
        }
      }
    } else {
      // Give the user lots of control.
      const delta = event.deltaY;
      if (Math.abs(delta) > 100) {
        // The user is expressing a resolute interest in controlling the
        // scrolling behavior. Stop doing any of our scroll step aligning
        // until he stops expressing such interest.
        clearInterval(this.wheelTimer);
        clearInterval(this.wheelLongTimer);
        this.wheelLongTimer = setTimeout(() => {
          this.wheelLongTimer = undefined;
        }, 2000);
      } else if (! this.wheelLongTimer) {
        if (delta > 10) {
          clearInterval(this.wheelTimer);
          this.wheelTimer = setTimeout(this.onNext, 200);
        } else if (delta < -10) {
          clearInterval(this.wheelTimer);
          this.wheelTimer = setTimeout(this.onPrevious, 200);
        } else {
          clearInterval(this.controlTimer);
          this.controlTimer = setTimeout(this.checkControls, 200);
        }
      }
    }
  }

  onScroll (event) {
    const { direction } = this.props;
    if ('row' === direction) {
      const { selectedIndex } = this.state;
      const componentElement = findDOMNode(this.componentRef);
      const childElement = this.childDOMNode(selectedIndex);
      let rect = childElement.getBoundingClientRect();
      if (event.target === componentElement) {
        // scrolling Article
        if (this.scrollingVertically) {
          // prevent Article horizontal scrolling while scrolling vertically
          componentElement.scrollLeft += rect.left;
        } else {
          const scrollingRight =
            this.priorScrollLeft < componentElement.scrollLeft;
          // once we stop scrolling, align with child boundaries
          clearTimeout(this.scrollTimer);
          this.scrollTimer = setTimeout(() => {
            if (! this.resizing) {
              const indexes = this.visibleIndexes();
              if (indexes.length > 1 && scrollingRight) {
                this.onSelect(indexes[1]);
              } else {
                this.onSelect(indexes[0]);
              }
            }
          }, 100);
          this.priorScrollLeft = componentElement.scrollLeft;
        }
      } else if (event.target.parentNode === componentElement) {
        // scrolling child
        // Has it scrolled near the bottom?
        if (this.state.accessibilityTabbingCompatible) {
          // only use lastGrandChild logic if we're not using Firefox or IE.
          // causes flashing in Firefox, but required for Safari scrolling.
          const grandchildren = event.target.children;
          const lastGrandChild = grandchildren[grandchildren.length - 1];
          rect = lastGrandChild.getBoundingClientRect();
        }
        if (rect.bottom <= (window.innerHeight + 24)) {
          // at the bottom
          this.setState({ atBottom: true });
        } else {
          // not at the bottom
          this.setState({ atBottom: false });
        }
      }
    }
  }

  onTouchStart (event) {
    const touched = event.changedTouches[0];
    this.touchStartX = touched.clientX;
    this.touchStartY = touched.clientY;
  }

  onTouchMove (event) {
    const touched = event.changedTouches[0];
    const deltaX = touched.clientX - this.touchStartX;
    const deltaY = touched.clientY - this.touchStartY;
    // Only step if the user isn't scrolling vertically, bias vertically
    if (Math.abs(deltaY) < Math.abs(deltaX * 2)) {
      if (deltaX < 0) {
        this.onNext();
      } else {
        this.onPrevious();
      }
    }
  }

  onResize () {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.onSelect(this.state.selectedIndex);
      this.shortTimer('_resizing', 1000);
    }, 50);
  }

  onNext (event, wrap) {
    // only process if the focus is NOT in a form element
    if (! isFormElement(document.activeElement)) {
      const { children } = this.props;
      const { selectedIndex } = this.state;
      const childCount = React.Children.count(children);
      if (event) {
        this.stop();
        event.preventDefault();
      }
      const targetIndex = this.visibleIndexes()[0] + 1;
      if (targetIndex !== selectedIndex) {
        if (targetIndex < childCount) {
          this.onSelect(Math.min(childCount - 1, targetIndex));
        } else if (wrap) {
          this.onSelect(1);
        }
      }
    }
  }

  onPrevious (event) {
    // only process if the focus is NOT in a form element
    if (! isFormElement(document.activeElement)) {
      const { selectedIndex } = this.state;
      if (event) {
        this.stop();
        event.preventDefault();
      }
      const targetIndex = this.visibleIndexes()[0] - 1;
      if (targetIndex !== selectedIndex) {
        this.onSelect(Math.max(0, targetIndex));
      }
    }
  }

  start () {
    this.playTimer = setInterval(() => {
      this.onNext(null, true);
    }, DEFAULT_PLAY_INTERVAL);
    this.setState({playing: true});
  }

  stop () {
    clearInterval(this.playTimer);
    this.setState({playing: false});
  }

  onTogglePlay (event) {
    event.preventDefault();
    if (this.state.playing) {
      this.stop();
    } else {
      this.start();
    }
  }

  onSelect (selectedIndex) {
    const { direction, onSelect } = this.props;
    const componentElement = findDOMNode(this.componentRef);
    const childElement = this.childDOMNode(selectedIndex);
    const windowHeight = window.innerHeight + 24;

    if (childElement) {
      if (selectedIndex !== this.state.selectedIndex) {
        const parentElement = childElement.parentNode;
        const atBottom =
          (Math.round(parentElement.scrollTop) >=
            parentElement.scrollHeight - parentElement.clientHeight);

        // scroll child to top
        childElement.scrollTop = 0;
        // ensures controls are displayed when selecting a new index and
        // scrollbar is at bottom of article
        this.setState({
          selectedIndex: selectedIndex,
          atBottom: atBottom
        }, () => {
          if (onSelect) {
            onSelect(selectedIndex);
          }

          // Necessary to detect for Firefox or Edge to implement accessibility
          // tabbing
          if (direction === 'row' &&
            this.state.accessibilityTabbingCompatible) {
            this.anchorStepRef.focus();
            this.updateHiddenElements();
          }
        });
      } else if (childElement.scrollHeight <= windowHeight) {
        // on initial chapter load, ensure arrows are rendered
        // when there are no scrollbars
        this.setState({ atBottom: true });
      }

      const rect = childElement.getBoundingClientRect();
      if ('row' === direction) {
        if (rect.left !== 0) {
          this.scrollingHorizontally = true;
          Scroll.scrollBy(componentElement, 'scrollLeft', rect.left, () => {
            this.scrollingHorizontally = false;
          });
        }
      } else {
        if (rect.top !== 0) {
          this.scrollingVertically = true;
          Scroll.scrollBy(componentElement, 'scrollTop', rect.top, () => {
            this.scrollingVertically = false;
          });
        }
      }
    }
  }

  onResponsive (small) {
    this.setState({ narrow: small });
  }

  toggleDisableChapter (chapter, disabled) {
    const elements = filterByFocusable(chapter.getElementsByTagName('*'));

    if (elements) {
      elements.forEach((element) => {
        if (disabled) {
          element.setAttribute('disabled', 'disabled');
        } else {
          element.removeAttribute('disabled');
        }

        element.setAttribute('tabindex', disabled ? '-1' : '0');
      });
    }
  }

  updateHiddenElements () {
    const component = findDOMNode(this.componentRef);
    const children = component.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.getAttribute('aria-hidden')) {
        this.toggleDisableChapter(child, true);
      } else {
        this.toggleDisableChapter(child, false);
      }
    }
  }

  updateProgress(event) {
    const { direction, responsive } = this.props;
    const { narrow } = this.state;
    const article = findDOMNode(this.componentRef);
    const articleRect = article.getBoundingClientRect();

    let offset = (direction === 'column')
      ? Math.abs(articleRect.top)
      : Math.abs(articleRect.left);
    let totalDistance = (direction === 'column')
      ? window.innerHeight
      : this.getChildrenWidth(
          this.componentRef.boxContainerRef.childNodes
        );
    let objectDistance = (direction === 'column')
      ? articleRect.height
      : articleRect.width;

    // Covers row responding to column layout.
    if (direction === 'row' && narrow && responsive !== false) {
      offset = Math.abs(articleRect.top);
      totalDistance = window.innerHeight;
      objectDistance = articleRect.height;
    }

    const progress = Math.abs(offset / (objectDistance - totalDistance));
    const scrollPercentRounded = Math.round(progress * 100);
    this.props.onProgress(scrollPercentRounded);
  }

  renderControls () {
    const { direction } = this.props;
    const { atBottom, narrow, selectedIndex } = this.state;
    const CONTROL_CLASS_PREFIX =
      `${CLASS_ROOT}__control ${CLASS_ROOT}__control`;
    const childCount = React.Children.count(this.props.children);
    let controls = [];

    const a11yTitle = this.props.a11yTitle || {};
    if ('row' === direction) {
      if (! narrow || atBottom) {
        if (selectedIndex > 0) {
          controls.push(
            <Button key='previous'
              plain={true} a11yTitle={a11yTitle.previous}
              className={`${CONTROL_CLASS_PREFIX}-left`}
              onClick={this.onPrevious} icon={<PreviousIcon
                a11yTitle='article-previous-title' size='large' />
              } />
          );
        }
        if (selectedIndex < (childCount - 1)) {
          controls.push(
            <Button key='next'
              plain={true} a11yTitle={a11yTitle.next}
              className={`${CONTROL_CLASS_PREFIX}-right`}
              onClick={this.onNext} icon={<NextIcon
                size='large' a11yTitle='article-next-title' />
              } />
          );
        }
      }
    } else {
      if (selectedIndex > 0) {
        controls.push(
          <Button key='previous'
            plain={true} a11yTitle={a11yTitle.previous}
            className={`${CONTROL_CLASS_PREFIX}-up`}
            onClick={this.onPrevious}><UpIcon /></Button>
        );
      }
      if (selectedIndex < (childCount - 1)) {
        controls.push(
          <Button key='next' plain={true} a11yTitle={a11yTitle.next}
            className={`${CONTROL_CLASS_PREFIX}-down`} onClick={this.onNext}>
            <DownIcon a11yTitle='article-down'/ >
          </Button>
        );
      }
    }

    return controls;
  }

  render () {
    const { className, primary, scrollStep } = this.props;
    const { selectedIndex } = this.state;
    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--scroll-step`]: scrollStep
      },
      className
    );

    const boxProps = Props.pick(this.props, Object.keys(Box.propTypes));
    const restProps = Props.omit(this.props, Object.keys(Article.propTypes));

    let controls;
    if (this.props.controls) {
      controls = this.renderControls();
    }

    let anchorStepNode;
    if (this.state.accessibilityTabbingCompatible) {
      anchorStepNode = (
        <a tabIndex='-1' aria-hidden='true'
          ref={ref => this.anchorStepRef = ref} />
      );
    }

    let children = this.props.children;
    if (scrollStep || controls) {
      children = Children.map(this.props.children, (element, index) => {
        if (element) {

          if (controls) {
            let ariaHidden;
            if (selectedIndex !== index &&
              this.state.accessibilityTabbingCompatible) {
              ariaHidden = 'true';
            }

            element = (
              <div aria-hidden={ariaHidden}>
                {element}
              </div>
            );
          }

          return element;
        }

        return undefined;
      }, this);
    }

    delete boxProps.a11yTitle;

    return (
      <Box {...restProps} {...boxProps} ref={ref => this.componentRef = ref}
        tag='article' className={classes} primary={primary}
        onScroll={this.onScroll} onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}>
        {children}
        {controls}
        {anchorStepNode}
      </Box>
    );
  }
}

Article.propTypes = {
  controls: PropTypes.bool,
  ...Box.propTypes,
  a11yTitle: PropTypes.shape({
    next: PropTypes.string,
    previous: PropTypes.string
  }),
  onProgress: PropTypes.func,
  onSelect: PropTypes.func,
  scrollStep: PropTypes.bool,
  selected: PropTypes.number
};

Article.defaultProps = {
  pad: 'none',
  direction: 'column'
};