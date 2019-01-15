import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const PrevNextStepperFlexButtons = (props) => {
  const { prevButtonText, nextButtonText, prevButtonDisabled, nextButtonDisabled, onPrevClicked, onNextClicked } = props

  let prevButtonBsStyle = (prevButtonDisabled === false) ? 'default' : 'default'
  let nextButtonBsStyle = (nextButtonDisabled === false) ? 'success' : 'default'

  let prevButtonDisabledClass = (prevButtonDisabled === false) ? '' : 'disabled'
  let nextButtonDisabledClass = (nextButtonDisabled === false) ? '' : 'disabled'

  return (
    <Fragment>
      {/* TODO: Allow for a custom className */}
      <div className='flex-button-group'>
        <Button className={prevButtonDisabledClass} bsStyle={prevButtonBsStyle} onClick={onPrevClicked}>
          <h4 className='text-center'><i className='fa fa-arrow-circle-left'/>
            <small>{prevButtonText}</small>
          </h4>
        </Button>
        <Button className={nextButtonDisabledClass} bsStyle={nextButtonBsStyle} onClick={onNextClicked}>
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
  nextButtonDisabled: PropTypes.bool,
  onPrevClicked: PropTypes.func,
  onNextClicked: PropTypes.func
}

PrevNextStepperFlexButtons.defaultProps = {
  prevButtonText: 'Back',
  nextButtonText: 'Next',
  nextButtonDisabled: false,
  onPrevClicked: () => {},
  onNextClicked: () => {}
}

export default PrevNextStepperFlexButtons
