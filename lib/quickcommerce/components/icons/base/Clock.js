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
      `${CLASS_ROOT}-clock`,
      className,
            {
                [`${CLASS_ROOT}--${size}`]: size,
                [`${CLASS_ROOT}--responsive`]: responsive,
                [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
            }
    )

        a11yTitle = a11yTitle || Intl.getMessage(intl, 'clock')

        const restProps = Props.omit(this.props, Object.keys(Icon.propTypes))
        return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><path fill="none" stroke="#000000" strokeWidth="2" d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,5 L12,12 L17,12"/></svg>
    }
}

Icon.contextTypes = {
    intl: PropTypes.object
}

Icon.defaultProps = {
    responsive: true
}

Icon.displayName = 'Clock'

Icon.icon = true

Icon.propTypes = {
    a11yTitle: PropTypes.string,
    colorIndex: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
    responsive: PropTypes.bool
}

