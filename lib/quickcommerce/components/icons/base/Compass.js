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
      `${CLASS_ROOT}-compass`,
      className,
            {
                [`${CLASS_ROOT}--${size}`]: size,
                [`${CLASS_ROOT}--responsive`]: responsive,
                [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
            }
    )

        a11yTitle = a11yTitle || Intl.getMessage(intl, 'compass')

        const restProps = Props.omit(this.props, Object.keys(Icon.propTypes))
        return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><circle cx="12" cy="12" r="10" stroke="#000000" strokeWidth="2" fill="none"/><path fill="#000000" d="M8.5,8.5 L17.5,6.5 L15.5,15.5 L6.5,17.5 L8.5,8.5 Z M12,14 C13.1045695,14 14,13.1045695 14,12 C14,10.8954305 13.1045695,10 12,10 C10.8954305,10 10,10.8954305 10,12 C10,13.1045695 10.8954305,14 12,14 Z" stroke="none"/></svg>
    }
}

Icon.contextTypes = {
    intl: PropTypes.object
}

Icon.defaultProps = {
    responsive: true
}

Icon.displayName = 'Compass'

Icon.icon = true

Icon.propTypes = {
    a11yTitle: PropTypes.string,
    colorIndex: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
    responsive: PropTypes.bool
}

