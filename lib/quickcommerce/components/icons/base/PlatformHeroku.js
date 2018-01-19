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
      `${CLASS_ROOT}-platform-heroku`,
      className,
            {
                [`${CLASS_ROOT}--${size}`]: size,
                [`${CLASS_ROOT}--responsive`]: responsive,
                [`${COLOR_INDEX}-${colorIndex}`]: colorIndex
            }
    )

        a11yTitle = a11yTitle || Intl.getMessage(intl, 'platform-heroku')

        const restProps = Props.omit(this.props, Object.keys(Icon.propTypes))
        return <svg {...restProps} version="1.1" viewBox="0 0 24 24" width="24px" height="24px" role="img" className={classes} aria-label={a11yTitle}><path fill="#000000" fillRule="evenodd" d="M20.4425631,0 L3.16168659,0 C1.96912351,0 1,0.966467463 1,2.16168659 L1,21.8403054 C1,23.0335325 1.96912351,24 3.16168659,24 L20.4425631,24 C21.6354582,24 22.6015936,23.0335325 22.6015936,21.8403054 L22.6015936,2.16168659 C22.6015936,0.966467463 21.6354582,0 20.4425631,0 L20.4425631,0 Z M21.4013944,21.8403054 C21.4013944,22.3701859 20.9721116,22.7991368 20.4425631,22.7991368 L3.16168659,22.7991368 C2.63247012,22.7991368 2.2001992,22.3701859 2.2001992,21.8403054 L2.2001992,2.16168659 C2.2001992,1.62981408 2.63247012,1.2001992 3.16168659,1.2001992 L20.4425631,1.2001992 C20.9721116,1.2001992 21.4013944,1.62981408 21.4013944,2.16168659 L21.4013944,21.8403054 Z M6.40036521,20.4013612 L9.10222444,18.0002988 L6.40036521,15.5999004 L6.40036521,20.4013612 L6.40036521,20.4013612 Z M16.1577357,10.6722776 C15.672012,10.1838977 14.7852258,9.60056441 13.302158,9.60056441 C11.675,9.60056441 9.99903718,10.0245352 8.80116202,10.4126494 L8.80116202,3.60122842 L6.40043161,3.60122842 L6.40043161,14.0085989 L8.09697875,13.2400066 C8.1251992,13.2273904 10.860259,12.0012948 13.302158,12.0012948 C14.5202855,12.0012948 14.7902058,12.6719456 14.8031541,13.2323705 L14.8031541,20.4013612 L17.2012284,20.4013612 L17.2012284,13.201494 C17.2038845,13.0474436 17.1886122,11.7157703 16.1577357,10.6722776 M13.0012948,7.50039841 L15.4020252,7.50039841 C16.4866866,6.27164675 17.0394754,4.96354582 17.201494,3.60099602 L14.8030876,3.60099602 C14.5358234,4.96088977 13.9445219,6.26135458 13.0012948,7.50039841" stroke="none"/></svg>
    }
}

Icon.contextTypes = {
    intl: PropTypes.object
}

Icon.defaultProps = {
    responsive: true
}

Icon.displayName = 'PlatformHeroku'

Icon.icon = true

Icon.propTypes = {
    a11yTitle: PropTypes.string,
    colorIndex: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'huge']),
    responsive: PropTypes.bool
}

