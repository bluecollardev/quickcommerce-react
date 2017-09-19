// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Children, Component, PropTypes } from 'react';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.BUTTON;

export default class Button extends Component {

  constructor () {
    super();
    this._onClick = this._onClick.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseDown.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this.state = {
      mouseActive: false,
      focus: false
    };
  }

  _onClick (event) {
    const { method, onClick, path} = this.props;
    const { router } = this.context;

    event.preventDefault();

    if ('push' === method) {
      router.push(path);
    } else if ('replace' === method) {
      router.replace(path);
    }

    if (onClick) {
      onClick(...arguments);
    }
  }

  _onMouseDown (event) {
    const { onMouseDown } = this.props;
    this.setState({ mouseActive: true });
    if (onMouseDown) {
      onMouseDown(event);
    }
  }

  _onMouseUp (event) {
    const { onMouseUp } = this.props;
    this.setState({ mouseActive: false });
    if (onMouseUp) {
      onMouseUp(event);
    }
  }

  _onFocus (event) {
    const { onFocus } = this.props;
    const { mouseActive } = this.state;
    if (mouseActive === false) {
      this.setState({ focus: true });
    }
    if (onFocus) {
      onFocus(event);
    }
  }

  _onBlur (event) {
    const { onBlur } = this.props;
    this.setState({ focus: false });
    if (onBlur) {
      onBlur(event);
    }
  }

  render () {
    const {
      a11yTitle, accent, align, children, className, fill, href, icon,
      label, onClick, path, plain, primary, reverse, secondary, type, ...props
    } = this.props;
    delete props.method;
    const { router } = this.context;

    let buttonIcon;
    if (icon) {
      buttonIcon = <span className={`${CLASS_ROOT}__icon`}>{icon}</span>;
    }

    let buttonLabel;
    if (label) {
      buttonLabel = <span className={`${CLASS_ROOT}__label`}>{label}</span>;
    }

    let adjustedHref = (path && router) ? router.createPath(path) : href;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--focus`]: this.state.focus,
        [`${CLASS_ROOT}--primary`]: primary,
        [`${CLASS_ROOT}--secondary`]: secondary,
        [`${CLASS_ROOT}--accent`]: accent,
        [`${CLASS_ROOT}--disabled`]: !onClick && !adjustedHref,
        [`${CLASS_ROOT}--fill`]: fill,
        [`${CLASS_ROOT}--plain`]: plain || Children.count(children) > 0 ||
          (icon && ! label),
        [`${CLASS_ROOT}--align-${align}`]: align
      },
      className
    );

    let adjustedOnClick = (path && router ? this._onClick : onClick);

    const Tag = adjustedHref ? 'a' : 'button';
    let buttonType;
    if (!adjustedHref) {
      buttonType = type;
    }

    const first = reverse ? buttonLabel : buttonIcon;
    const second = reverse ? buttonIcon : buttonLabel;

    return (
      <Tag {...props} href={adjustedHref} type={buttonType}
        className={classes} aria-label={a11yTitle}
        onClick={adjustedOnClick}
        disabled={!onClick && !adjustedHref}
        onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp}
        onFocus={this._onFocus} onBlur={this._onBlur}>
        {first}
        {second}
        {children}
      </Tag>
    );
  }
};

Button.propTypes = {
  a11yTitle: PropTypes.string,
  accent: PropTypes.bool,
  align: PropTypes.oneOf(['start', 'center', 'end']),
  fill: PropTypes.bool,
  href: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.node,
  method: PropTypes.oneOf(['push', 'replace']),
  onClick: PropTypes.func,
  path: PropTypes.string,
  plain: PropTypes.bool,
  primary: PropTypes.bool,
  reverse: PropTypes.bool,
  secondary: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'reset', 'submit'])
};

Button.defaultProps = {
  method: 'push',
  type: 'button'
};

Button.contextTypes = {
  router: PropTypes.object
};
