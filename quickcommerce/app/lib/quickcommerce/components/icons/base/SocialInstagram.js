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
      `${CLASS_ROOT}-social-instagram`,
      className,
      {
        [`${CLASS_ROOT}--${size}`]: size,
        [`${CLASS_ROOT}--responsive`]: responsive,
        [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
      }
    );

    a11yTitle = a11yTitle || Intl.getMessage(intl, 'social-instagram');

    const restProps = Props.omit(this.props, Object.keys(Icon.propTypes));
    return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><path fill="#000000" fillRule="evenodd" d="M2,5.00955791 C2,3.34942449 3.35063615,2 5.00955791,2 L18.9904421,2 C20.6505755,2 22,3.35063615 22,5.00955791 L22,18.9904421 C22,20.6505755 20.6493638,22 18.9904421,22 L5.00955791,22 C3.34942449,22 2,20.6493638 2,18.9904421 L2,5.00955791 L2,5.00955791 Z M0,5.00955791 L0,18.9904421 C0,21.7535317 2.24445296,24 5.00955791,24 L18.9904421,24 C21.7535317,24 24,21.755547 24,18.9904421 L24,5.00955791 C24,2.24646828 21.755547,0 18.9904421,0 L5.00955791,0 C2.24646828,0 0,2.24445296 0,5.00955791 L0,5.00955791 Z M19,6.5 C19.8284271,6.5 20.5,5.82842712 20.5,5 C20.5,4.17157288 19.8284271,3.5 19,3.5 C18.1715729,3.5 17.5,4.17157288 17.5,5 C17.5,5.82842712 18.1715729,6.5 19,6.5 Z M12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 L12,19 Z M12,17 C9.23857625,17 7,14.7614237 7,12 C7,9.23857625 9.23857625,7 12,7 C14.7614237,7 17,9.23857625 17,12 C17,14.7614237 14.7614237,17 12,17 L12,17 Z" stroke="none"/></svg>;
  }
};

Icon.contextTypes = {
  intl: PropTypes.object
};

Icon.defaultProps = {
  responsive: true
};

Icon.displayName = 'SocialInstagram';

Icon.icon = true;

Icon.propTypes = {
  a11yTitle: PropTypes.string,
  colorIndex: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
  responsive: PropTypes.bool
};

