import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const PrevNextStepperFlexButtons = (props) => {
  const { prevButtonText, nextButtonText, onPrevClicked, onNextClicked } = props

  return (
    <div className='col-xs-12 flex-button-group'>
      <Button onClick={onPrevClicked}>
        <h4 className='text-center'><i className='fa fa-arrow-circle-left'/>
          <small>{prevButtonText}</small>
        </h4>
      </Button>
      &nbsp;&nbsp;
      <Button bsStyle='success' onClick={onNextClicked}>
        <h4 className='text-center'><i className='fa fa-arrow-circle-right'/>
          <small>{nextButtonText}</small>
        </h4>
      </Button>
    </div>
  )
}

PrevNextStepperFlexButtons.propTypes = {
  prevButtonText: PropTypes.string,
  nextButtonText: PropTypes.string,
  onPrevClicked: PropTypes.func,
  onNextClicked: PropTypes.func
}

PrevNextStepperFlexButtons.defaultProps = {
  prevButtonText: 'Back',
  nextButtonText: 'Next',
  onPrevClicked: () => {},
  onNextClicked: () => {}
}

export default PrevNextStepperFlexButtons
