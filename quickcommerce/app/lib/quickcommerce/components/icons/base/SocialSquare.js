// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import CSSClassnames from '../../../utils/CSSClassnames';
import Intl from '../../../utils/Intl';
import Props from '../../../utils/Props';

const CLASS_ROOT = CSSClassnames.CONTROL_ICON;
const COLOR_INDEX = CSSClassnames.COLOR_INDEX;

export default class Icon extends Component {
  render () {
    const { className, colorIndex } = this.props;
    let { a11yTitle, size, responsive } = this.props;
    let { intl } = this.context;

    const classes = classnames(
      CLASS_ROOT,
      `${CLASS_ROOT}-social-square`,
      className,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--responsive`]: responsive,
        [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
      }
    );

    a11yTitle = a11yTitle || Intl.getMessage(intl, 'social-square');

    const restProps = Props.omit(this.props, Object.keys(Icon.propTypes));
    return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><path fill="#000000" fillRule="evenodd" d="M14.4444444,8.33333333 L9.55555556,8.33333333 C8.88088889,8.33333333 8.33333333,8.88088889 8.33333333,9.55555556 L8.33333333,14.4444444 C8.33333333,15.1191111 8.88088889,15.6666667 9.55555556,15.6666667 L14.4444444,15.6666667 C15.1191111,15.6666667 15.6666667,15.1191111 15.6666667,14.4444444 L15.6666667,9.55555556 C15.6666667,8.88088889 15.1191111,8.33333333 14.4444444,8.33333333 M18.1111111,22 L5.88888889,22 C3.74128475,22 2,20.2587153 2,18.1111111 L2,5.88888889 C2,3.74128475 3.74128475,2 5.88888889,2 L18.1111111,2 C20.2587153,2 22,3.74128475 22,5.88888889 L22,18.1111111 C22,20.2587153 20.2587153,22 18.1111111,22 L18.1111111,22 Z M18.1111111,24 C21.3632847,24 24,21.3632847 24,18.1111111 L24,5.88888889 C24,2.63671525 21.3632847,0 18.1111111,0 L5.88888889,0 C2.63671525,0 0,2.63671525 0,5.88888889 L0,18.1111111 C0,21.3632847 2.63671525,24 5.88888889,24 L18.1111111,24 L18.1111111,24 Z" stroke="none"/></svg>;
  }
};

Icon.contextTypes = {
  intl: PropTypes.object
};

Icon.defaultProps = {
  responsive: true
};

Icon.displayName = 'SocialSquare';

Icon.icon = true;

Icon.propTypes = {
  a11yTitle: PropTypes.string,
  colorIndex: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
  responsive: PropTypes.bool
};

