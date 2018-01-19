// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import CSSClassnames from '../../../utils/CSSClassnames'
import Intl from '../../../utils/Intl'
import Props from '../../../utils/Props'

const CLASS_ROOT = CSSClassnames.CONTROL_ICON
const COLOR_INDEX = CSSClassnames.COLOR_INDEX

export default class Icon extends Component {
    render () {
        const { className, colorIndex } = this.props
        let { a11yTitle, size, responsive } = this.props
        let { intl } = this.context

        const classes = classnames(
      CLASS_ROOT,
      `${CLASS_ROOT}-social-stack-overflow`,
      className,
            {
                [`${CLASS_ROOT}--${size}`]: size,
                [`${CLASS_ROOT}--responsive`]: responsive,
                [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
            }
    )

        a11yTitle = a11yTitle || Intl.getMessage(intl, 'social-stack-overflow')

        const restProps = Props.omit(this.props, Object.keys(Icon.propTypes))
        return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><path fill="#000000" fillRule="evenodd" d="M11.4137208,0.131625 L0.592720771,5.187375 C0.267970771,5.338875 0.269470771,5.800875 0.594970771,5.950875 L11.4992208,10.968375 C11.8217208,11.116875 12.1929708,11.116875 12.5154708,10.968375 L23.4204708,5.950875 C23.7459708,5.800875 23.7467208,5.338875 23.4227208,5.187375 L12.6017208,0.131625 C12.2252208,-0.043875 11.7902208,-0.043875 11.4137208,0.131625 Z M23.4227208,11.6582856 L21.1877208,10.6142856 C20.8637208,10.4627856 20.4894708,10.4620356 20.1647208,10.6112856 L12.5162208,14.1302856 C12.1937208,14.2787856 11.8224708,14.2787856 11.4999708,14.1302856 L3.85072077,10.6112856 C3.52597077,10.4620356 3.15172077,10.4627856 2.82772077,10.6142856 L0.592720771,11.6582856 C0.267970771,11.8097856 0.269470771,12.2717856 0.594970771,12.4217856 L11.4999708,17.4392856 C11.8224708,17.5877856 12.1937208,17.5877856 12.5162208,17.4392856 L23.4204708,12.4217856 C23.7459708,12.2717856 23.7474708,11.8097856 23.4227208,11.6582856 Z M23.4227208,18.1582856 L21.1877208,17.1142856 C20.8637208,16.9627856 20.4894708,16.9620356 20.1647208,17.1112856 L12.5162208,20.6302856 C12.1937208,20.7787856 11.8224708,20.7787856 11.4999708,20.6302856 L3.85072077,17.1112856 C3.52597077,16.9620356 3.15172077,16.9627856 2.82772077,17.1142856 L0.592720771,18.1582856 C0.267970771,18.3097856 0.269470771,18.7717856 0.594970771,18.9217856 L11.4999708,23.9392856 C11.8224708,24.0877856 12.1937208,24.0877856 12.5162208,23.9392856 L23.4204708,18.9217856 C23.7459708,18.7717856 23.7474708,18.3097856 23.4227208,18.1582856 Z" stroke="none"/></svg>
    }
}

Icon.contextTypes = {
    intl: PropTypes.object
}

Icon.defaultProps = {
    responsive: true
}

Icon.displayName = 'SocialStackOverflow'

Icon.icon = true

Icon.propTypes = {
    a11yTitle: PropTypes.string,
    colorIndex: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
    responsive: PropTypes.bool
}

