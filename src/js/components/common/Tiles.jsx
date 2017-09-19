import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import Props from '../../utils/Props';
import Box from './Box';
import Button from './Button';
import Scroll from '../../utils/Scroll';
import InfiniteScroll from '../../utils/InfiniteScroll';
import Selection from '../../utils/Selection';
import KeyboardAccelerators from '../../utils/KeyboardAccelerators';
import Intl from '../../utils/Intl';
import { announce } from '../../utils/Announcer';

import CSSClassnames from '../../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.TILES;
const TILE = CSSClassnames.TILE;
const SELECTED_CLASS = `${TILE}--selected`;
const ACTIVE_CLASS = `${TILE}--active`;

export default class Tiles extends Component {

  constructor(props, context) {
    super(props, context);
    this.onLeft = this.onLeft.bind(this);
    this.onRight = this.onRight.bind(this);
    this.onScrollHorizontal = this.onScrollHorizontal.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onResize = this.onResize.bind(this);
    this.layout = this.layout.bind(this);
    this.onClick = this.onClick.bind(this);
    this.fireClick = this.fireClick.bind(this);
    this.announceTile = this.announceTile.bind(this);
    this.onPreviousTile = this.onPreviousTile.bind(this);
    this.onNextTile = this.onNextTile.bind(this);
    this.onEnter = this.onEnter.bind(this);

    this.state = {
      activeTile: undefined,
      mouseActive: false,
      overflow: false,
      selected: Selection.normalizeIndexes(props.selected)
    };
  }

  componentDidMount () {
    const { direction, onMore, selectable } = this.props;
    this.setSelection();
    if (onMore) {
      this.scroll = InfiniteScroll.startListeningForScroll(this.moreRef,
        onMore);
    }
    if ('row' === direction) {
      window.addEventListener('resize', this.onResize);
      document.addEventListener('wheel', this.onWheel, { passive: true });
      this.trackHorizontalScroll();
      // give browser a chance to stabilize
      this.layoutTimer = setTimeout(this.layout, 10);
    }
    if (selectable) {
      // only listen for navigation keys if the tile row can be selected
      this.keyboardHandlers = {
        left: this.onPreviousTile,
        up: this.onPreviousTile,
        right: this.onNextTile,
        down: this.onNextTile,
        enter: this.onEnter,
        space: this.onEnter
      };
      KeyboardAccelerators.startListeningToKeyboard(
        this, this.keyboardHandlers
      );
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.selected !== undefined) {
      this.setState({
        selected: Selection.normalizeIndexes(nextProps.selected)
      });
    }
    if (this.scroll) {
      InfiniteScroll.stopListeningForScroll(this.scroll);
      this.scroll = undefined;
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { direction, onMore, selectable } = this.props;
    if (onMore && !this.scroll) {
      this.scroll = InfiniteScroll.startListeningForScroll(this.moreRef,
        onMore);
    }
    if ('row' === direction) {
      this.trackHorizontalScroll();
      // give browser a chance to stabilize
      this.layoutTimer = setTimeout(this.layout, 10);
    }
    if (selectable) {
      this.setSelection();
      // only listen for navigation keys if the list row can be selected
      this.keyboardHandlers = {
        left: this.onPreviousTile,
        up: this.onPreviousTile,
        right: this.onNextTile,
        down: this.onNextTile,
        enter: this.onEnter,
        space: this.onEnter
      };
      KeyboardAccelerators.startListeningToKeyboard(
        this, this.keyboardHandlers
      );
    }
  }

  componentWillUnmount () {
    const { direction, selectable } = this.props;
    if (this.scroll) {
      InfiniteScroll.stopListeningForScroll(this.scroll);
    }
    if ('row' === direction) {
      window.removeEventListener('resize', this.onResize);
      document.removeEventListener('wheel', this.onWheel);
      if (this.tracking) {
        const tiles = findDOMNode(this.tilesRef);
        tiles.removeEventListener('scroll', this.onScrollHorizontal);
      }
    }
    if (selectable) {
      KeyboardAccelerators.stopListeningToKeyboard(
        this, this.keyboardHandlers
      );
    }
    if (this.layoutTimer) {
      clearTimeout(this.layoutTimer);
    }
  }

  announceTile (label) {
    const { intl } = this.context;
    const enterSelectMessage = Intl.getMessage(intl, 'Enter Select');
    // avoid a long text to be read by the screen reader
    const labelMessage = label.length > 15 ?
      `${label.substring(0, 15)}...` : label;
    announce(`${labelMessage} ${enterSelectMessage}`);
  }

  onPreviousTile (event) {
    if (findDOMNode(this.tilesRef).contains(document.activeElement)) {
      event.preventDefault();
      const { activeTile } = this.state;
      const rows = findDOMNode(this.tilesRef).querySelectorAll(`.${TILE}`);
      if (rows && rows.length > 0) {
        if (activeTile === undefined) {
          rows[0].classList.add(ACTIVE_CLASS);
          this.setState({ activeTile: 0 }, () => {
            this.announceTile(
              rows[this.state.activeTile].innerText
            );
          });
        } else if (activeTile - 1 >= 0) {
          rows[activeTile].classList.remove(ACTIVE_CLASS);
          rows[activeTile - 1].classList.add(ACTIVE_CLASS);
          this.setState({ activeTile: activeTile - 1 }, () => {
            this.announceTile(
              rows[this.state.activeTile].innerText
            );
          });
        }
      }

      //stop event propagation
      return true;
    }
  }

  onNextTile (event) {
    if (findDOMNode(this.tilesRef).contains(document.activeElement)) {
      event.preventDefault();
      const { activeTile } = this.state;
      const rows = findDOMNode(this.tilesRef).querySelectorAll(`.${TILE}`);
      if (rows && rows.length > 0) {
        if (activeTile === undefined) {
          rows[0].classList.add(ACTIVE_CLASS);
          this.setState({ activeTile: 0 }, () => {
            this.announceTile(
              rows[this.state.activeTile].innerText
            );
          });
        } else if (activeTile + 1 <= rows.length - 1) {
          rows[activeTile].classList.remove(ACTIVE_CLASS);
          rows[activeTile + 1].classList.add(ACTIVE_CLASS);
          this.setState({ activeTile: activeTile + 1 }, () => {
            this.announceTile(
              rows[this.state.activeTile].innerText
            );
          });
        }
      }

      //stop event propagation
      return true;
    }
  }

  fireClick (element, shiftKey) {
    let event;
    try {
      event = new MouseEvent('click', {
        'bubbles': true,
        'cancelable': true,
        'shiftKey': shiftKey
      });
    } catch (e) {
      // IE11 workaround.
      event = document.createEvent('Event');
      event.initEvent('click', true, true);
    }
    // We use dispatchEvent to have the browser fill out the event fully.
    element.dispatchEvent(event);
  }

  onEnter (event) {
    const { activeTile } = this.state;
    const { intl } = this.context;
    if (findDOMNode(this.tilesRef).contains(document.activeElement) &&
      activeTile !== undefined) {
      const rows = findDOMNode(this.tilesRef).querySelectorAll(`.${TILE}`);
      this.fireClick(rows[activeTile], event.shiftKey);
      rows[activeTile].classList.remove(ACTIVE_CLASS);
      const label = rows[activeTile].innerText;
      // avoid a long text to be read by the screen reader
      const labelMessage = label.length > 15 ?
        `${label.substring(0, 15)}...` : label;
      const selectedMessage = Intl.getMessage(intl, 'Selected');
      announce(`${labelMessage} ${selectedMessage}`);
    }
  }

  onLeft () {
    const tiles = findDOMNode(this.tilesRef);
    Scroll.scrollBy(tiles, 'scrollLeft', - tiles.offsetWidth);
  }

  onRight () {
    const tiles = findDOMNode(this.tilesRef);
    Scroll.scrollBy(tiles, 'scrollLeft', tiles.offsetWidth);
  }

  onScrollHorizontal () {
    // debounce
    clearTimeout(this.layoutTimer);
    this.layoutTimer = setTimeout(this.layout, 50);
  }

  onWheel (event) {
    if (Math.abs(event.deltaX) > 100) {
      clearInterval(this.scrollTimer);
    } else if (event.deltaX > 5) {
      this.onRight();
    } else if (event.deltaX < -5) {
      this.onLeft();
    }
  }

  layout () {
    const { direction } = this.props;

    if ('row' === direction) {
      // determine if we have more tiles than room to fit
      const tiles = findDOMNode(this.tilesRef);

      // 20 is to allow some fuzziness as scrollbars come and go
      const newState = {
        overflow: (tiles.scrollWidth > (tiles.offsetWidth + 20)),
        overflowStart: (tiles.scrollLeft <= 20),
        overflowEnd:
          (tiles.scrollLeft >= (tiles.scrollWidth - tiles.offsetWidth)),
        scrollWidth: tiles.scrollWidth
      };

      const state = {
        overflow: this.state.overflow,
        overflowStart: this.state.overflowStart,
        overflowEnd: this.state.overflowEnd,
        scrollWidth: this.state.scrollWidth
      };

      // Shallow compare states.
      if (JSON.stringify(newState) !== JSON.stringify(state)) {
        this.setState({ ...newState });
      }

      // mark any tiles that might be clipped
      const rect = tiles.getBoundingClientRect();
      const children = tiles.querySelectorAll(`.${TILE}`);

      Array.from(children).map((child, index) => {
        const childRect = child.getBoundingClientRect();
        // 12 accounts for padding
        if ((childRect.left + 12) < rect.left ||
          (childRect.right - 12) > rect.right) {
          child.classList.add(`${TILE}--eclipsed`);
        } else {
          child.classList.remove(`${TILE}--eclipsed`);
        }
      });
    }
  }

  onResize () {
    // debounce
    clearTimeout(this.layoutTimer);
    this.layoutTimer = setTimeout(this.layout, 50);
  }

  trackHorizontalScroll () {
    const { overflow } = this.state;
    if (overflow && ! this.tracking) {
      const tiles = findDOMNode(this.tilesRef);
      tiles.addEventListener('scroll', this.onScrollHorizontal);
      this.tracking = true;
    }
  }

  setSelection () {
    Selection.setClassFromIndexes({
      containerElement: findDOMNode(this.tilesRef),
      childSelector: `.${TILE}`,
      selectedClass: SELECTED_CLASS,
      selectedIndexes: this.state.selected
    });
  }

  onClick (event) {
    const { onSelect, selectable, selected } = this.props;
    const selection = Selection.onClick(event, {
      containerElement: findDOMNode(this.tilesRef),
      childSelector: `.${TILE}`,
      selectedClass: SELECTED_CLASS,
      multiSelect: ('multiple' === selectable),
      priorSelectedIndexes: this.state.selected
    });
    // only set the selected state and classes if the caller isn't managing it.
    if (selected === undefined) {
      this.setState({ selected: selection }, this.setSelection);
    }

    if (onSelect) {
      onSelect(selection.length === 1 ? selection[0] : selection);
    }
  }

  renderChild (element) {
    const { flush } = this.props;

    if (element) {
      // only clone tile children
      if (element.type && element.type.displayName === 'Tile') {
        const elementClone = React.cloneElement(element, {
          hoverBorder: !flush
        });

        return elementClone;
      }
      return element;
    }

    return undefined;
  }

  // children should be an array of Tile
  render () {
    const {
      a11yTitle, className, children, direction, fill, flush, onBlur, onFocus,
      onMore, onMouseDown, onMouseUp, selectable
    } = this.props;
    const {
      activeTile, focus, mouseActive, overflow, overflowEnd, overflowStart
    } = this.state;
    const { intl } = this.context;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--fill`]: fill,
        [`${CLASS_ROOT}--flush`]: flush,
        [`${CLASS_ROOT}--focus`]: focus,
        [`${CLASS_ROOT}--selectable`]: selectable,
        [`${CLASS_ROOT}--moreable`]: onMore,
        [`${CLASS_ROOT}--overflowed`]: overflow
      },
      className
    );

    const other = Props.pick(this.props, Object.keys(Box.propTypes));

    let more;
    if (onMore) {
      more = (
        <div ref={ref => this.moreRef = ref} className={`${CLASS_ROOT}__more`}>
          <SpinningIcon />
        </div>
      );
    }

    const tileContents = Children.map(children, (element) => {
      return this.renderChild(element);
    });

    let selectableProps;
    if (selectable) {
      const multiSelectMessage = selectable === 'multiple' ?
        `(${Intl.getMessage(intl, 'Multi Select')})` : '';
      const tilesMessage = a11yTitle || Intl.getMessage(intl, 'Tiles');
      const navigationHelpMessage = Intl.getMessage(intl, 'Navigation Help');
      selectableProps = {
        'aria-label': (
          `${tilesMessage} ${multiSelectMessage} ${navigationHelpMessage}`
        ),
        tabIndex: '0',
        onClick: this.onClick,
        onMouseDown: (event) => {
          this.setState({ mouseActive: true });
          if (onMouseDown) {
            onMouseDown(event);
          }
        },
        onMouseUp: (event) => {
          this.setState({ mouseActive: false });
          if (onMouseUp) {
            onMouseUp(event);
          }
        },
        onFocus: (event) => {
          if (mouseActive === false) {
            this.setState({ focus: true });
          }
          if (onFocus) {
            onFocus(event);
          }
        },
        onBlur: (event) => {
          if (activeTile) {
            const rows = (
              findDOMNode(this.tilesRef).querySelectorAll(`.${TILE}`)
            );
            rows[activeTile].classList.remove(ACTIVE_CLASS);
          }
          this.setState({ focus: false, activeTile: undefined });
          if (onBlur) {
            onBlur(event);
          }
        }
      };
    }

    let contents = (
      <Box ref={ref => this.tilesRef = ref} {...other}
        wrap={direction ? false : true}
        direction={direction ? direction : 'row'}
        className={classes} focusable={false} {...selectableProps}>
        {tileContents}
        {more}
      </Box>
    );

    if (overflow) {
      let left;
      let right;

      if (!overflowStart) {
        const previousTilesMessage = Intl.getMessage(intl, 'Previous Tiles');
        left = (
          <Button className={`${CLASS_ROOT}__left`}
            icon={<LinkPreviousIcon />}
            a11yTitle={previousTilesMessage} onClick={this.onLeft} />
        );
      }
      if (!overflowEnd) {
        const nextTilesMessage = Intl.getMessage(intl, 'Next Tiles');
        right = (
          <Button className={`${CLASS_ROOT}__right`}
            icon={<LinkNextIcon />}
            a11yTitle={nextTilesMessage} onClick={this.onRight} />
        );
      }

      contents = (
        <div className={`${CLASS_ROOT}__container`}>
          {left}
          {contents}
          {right}
        </div>
      );
    }

    return contents;
  }

}

Tiles.contextTypes = {
  intl: PropTypes.object
};

Tiles.propTypes = {
  fill: PropTypes.bool,
  flush: PropTypes.bool,
  onMore: PropTypes.func,
  onSelect: PropTypes.func,
  selectable: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(['multiple'])
  ]),
  selected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  ...Box.propTypes
};

Tiles.defaultProps = {
  flush: true,
  justify: 'start',
  pad: 'small'
};