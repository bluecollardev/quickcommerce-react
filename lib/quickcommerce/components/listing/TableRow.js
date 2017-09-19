// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.TABLE_ROW;

export default class TableRow extends Component {
  render () {
    const { children, className, onClick, ...props } = this.props;

    const classes = classnames(
      CLASS_ROOT,
      {
        [`${CLASS_ROOT}--selectable`]: onClick
      },
      className
    );

    return (
      <tr {...props} className={classes} onClick={onClick}>
        {children}
      </tr>
    );
  }
};

TableRow.propTypes = {
  onClick: PropTypes.func
};
