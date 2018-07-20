import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const YesNoActionButtons = (props) => {
  const { prevButtonText, nextButtonText, onPrevClicked, onNextClicked } = props

  return (
    <div className='col-xs-12'>
      <div className='actions float-right'>
        <FormGroup>
          <Button className='btn action-button' onClick={this.onCreateWorksheetsClicked}>
            <h5><i className='fa fa-check'/> Create Worksheet(s)</h5>
          </Button>
          <Button className='btn action-button' onClick={this.onCancel}>
            <h5><i className='fa fa-ban'/> Cancel</h5>
          </Button>
        </FormGroup>
      </div>
    </div>
  )
}

YesNoActionButtons.propTypes = {
  yesButtonText: PropTypes.string,
  nextButtonText: PropTypes.string,
  onPrevClicked: PropTypes.func,
  onNextClicked: PropTypes.func
}

YesNoActionButtons.defaultProps = {
  prevButtonText: 'OK',
  nextButtonText: 'Cancel',
  onPrevClicked: () => {},
  onNextClicked: () => {}
}

export default YesNoActionButtons
