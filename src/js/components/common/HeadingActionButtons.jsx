import React from 'react'
import PropTypes from 'prop-types'

import { Button, FormGroup } from 'react-bootstrap'

const HeadingActionButtons = (props) => {
  const {
    actions,
    style,
    className,
    formGroupClassName,
    defaultIcon,
    onButtonClicked,
    onCancelClicked
  } = props

  let wrapperClassName = ''
  if (typeof className === 'string') {
    wrapperClassName = className
  }

  let groupClassName = 'actions float-right'
  if (typeof formGroupClassName === 'string') {
    groupClassName = formGroupClassName
  }

  // TODO: Use commands!?
  if (!(actions instanceof Array && actions.length > 0)) {
    // If no actions were specified don't render anything
    return null
  }

  return (
    <div
      className={wrapperClassName}
      style={style}>
      {actions.map(action => {
        let buttonText = (typeof action.buttonText === 'string') ? action.buttonText : props.buttonText
        // TODO: Instead of onClick, maybe 'execute' (if command pattern)?
        let onButtonClicked = (typeof action.onClick === 'function') ? action.onClick : onButtonClicked
        let icon = (typeof action.icon === 'string') ? action.icon : defaultIcon

        let iconElement = null
        if (typeof icon === 'string' && icon !== '') {
          iconElement = <i className={icon} />
        }

        return (
          <Button className='heading-action-button' onClick={onButtonClicked}>
            <h5>{iconElement} {buttonText}</h5>
          </Button>
        )
      })}

      {/*<Button className='btn action-button' onClick={onCancelClicked}>
        <h5><i className='fa fa-ban'/> Cancel</h5>
      </Button>*/}
    </div>
  )
}

HeadingActionButtons.propTypes = {
  defaultIcon: PropTypes.string,
  actions: PropTypes.array,
  style: PropTypes.object,
  className: PropTypes.string,
  formGroupClassName: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClicked: PropTypes.func,
  onCancelClicked: PropTypes.func
}

HeadingActionButtons.defaultProps = {
  defaultIcon: '',
  actions: [],
  style: {},
  className: 'heading-actions',
  formGroupClassName: '',
  buttonText: '',
  onButtonClicked: () => {},
  onCancelClicked: () => {}
}

export default HeadingActionButtons
