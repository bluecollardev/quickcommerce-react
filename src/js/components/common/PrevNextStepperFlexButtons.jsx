import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const PrevNextStepperFlexButtons = (props) => {
  const { prevButtonText, nextButtonText, onPrevClicked, onNextClicked } = props

  return (
    <Fragment>
      {/* TODO: Allow for a custom className */}
      <div className='flex-button-group'>
        <Button onClick={onPrevClicked}>
          <h4 className='text-center'><i className='fa fa-arrow-circle-left'/>
            <small>{prevButtonText}</small>
          </h4>
        </Button>
        <Button bsStyle='success' onClick={onNextClicked}>
          <h4 className='text-center'><i className='fa fa-arrow-circle-right'/>
            <small>{nextButtonText}</small>
          </h4>
        </Button>
      </div>
    </Fragment>
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
