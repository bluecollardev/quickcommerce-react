import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const OkCancelNextStepperFlexButtons = (props) => {
  const { prevButtonText, nextButtonText, onPrevClicked, onNextClicked } = props

  return (
    <div className='col-xs-12 flex-button-group'>
      <Button onClick={onPrevClicked}>
        <h4 className='text-center'><i className='fa fa-check-circle'/>
          <small>{prevButtonText}</small>
        </h4>
      </Button>
      &nbsp;&nbsp;
      <Button bsStyle='success' onClick={onNextClicked}>
        <h4 className='text-center'><i className='fa fa-ban'/>
          <small>{nextButtonText}</small>
        </h4>
      </Button>
    </div>
  )
}

OkCancelNextStepperFlexButtons.propTypes = {
  prevButtonText: PropTypes.string,
  nextButtonText: PropTypes.string,
  onPrevClicked: PropTypes.func,
  onNextClicked: PropTypes.func
}

OkCancelNextStepperFlexButtons.defaultProps = {
  prevButtonText: 'OK',
  nextButtonText: 'Cancel',
  onPrevClicked: () => {},
  onNextClicked: () => {}
}

export default OkCancelNextStepperFlexButtons
