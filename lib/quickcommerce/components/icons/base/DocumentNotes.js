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
      `${CLASS_ROOT}-document-notes`,
      className,
            {
                [`${CLASS_ROOT}--${size}`]: size,
                [`${CLASS_ROOT}--responsive`]: responsive,
                [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
            }
    )

        a11yTitle = a11yTitle || Intl.getMessage(intl, 'document-notes')

        const restProps = Props.omit(this.props, Object.keys(Icon.propTypes))
        return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><path fill="none" stroke="#000000" strokeWidth="2" d="M4.99787498,8.99999999 L4.99787498,0.999999992 L19.4999998,0.999999992 L22.9999998,4.50000005 L23,23 L4,23 M18,1 L18,6 L23,6 M9.75,12 L9.75,18.5 L9.5,18.5 L4.5,12 L4,12 L4,19 L4.25,19 L4.25,12.5 L4.5,12.5 L9.5,19 L10,19 L10,12 L9.75,12 Z"/></svg>
    }
}

Icon.contextTypes = {
    intl: PropTypes.object
}

Icon.defaultProps = {
    responsive: true
}

Icon.displayName = 'DocumentNotes'

Icon.icon = true

Icon.propTypes = {
    a11yTitle: PropTypes.string,
    colorIndex: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
    responsive: PropTypes.bool
}

