import React from 'react'
import PropTypes from 'prop-types'

import { Button, FormGroup } from 'react-bootstrap'

const ActionButtons = (props) => {
  const {
    actions,
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
    <div className={wrapperClassName}>
      {actions.map((action, idx) => {
        let buttonText = (typeof action.buttonText === 'string') ? action.buttonText : props.buttonText
        // TODO: Instead of onClick, maybe 'execute' (if command pattern)?
        let onButtonClicked = (typeof action.onClick === 'function') ? action.onClick : onButtonClicked
        let icon = (typeof action.icon === 'string') ? action.icon : defaultIcon

        let iconElement = null
        if (typeof icon === 'string' && icon !== '') {
          iconElement = <i className={icon} />
        }

        return (
          <FormGroup key={idx} className={groupClassName}>
            <Button className='btn action-button' onClick={onButtonClicked}>
              <h5>{iconElement} {buttonText}</h5>
            </Button>
          </FormGroup>
        )
      })}

      {/*<Button className='btn action-button' onClick={onCancelClicked}>
        <h5><i className='fa fa-ban'/> Cancel</h5>
      </Button>*/}
    </div>
  )
}

ActionButtons.propTypes = {
  defaultIcon: PropTypes.string,
  actions: PropTypes.array,
  className: PropTypes.string,
  formGroupClassName: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClicked: PropTypes.func,
  onCancelClicked: PropTypes.func
}

ActionButtons.defaultProps = {
  defaultIcon: '',
  actions: [],
  className: 'actions float-right',
  formGroupClassName: '',
  buttonText: '',
  onButtonClicked: () => {},
  onCancelClicked: () => {}
}

export default ActionButtons
