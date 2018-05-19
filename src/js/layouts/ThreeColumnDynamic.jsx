import Slot from '../modules/slots/Slots.jsx'
import React from 'react'
import { Modal } from 'react-bootstrap'

const ThreeColumnDynamicLayout = (props) => {
  let displayLeftCol = props.displayLeftCol
  let displayRightCol = props.displayRightCol

  let leftColWidth = 3
  let rightColWidth = 3
  let centerColWidth = 6

  if (props.columnConfiguration instanceof Array && props.columnConfiguration.length === 3) {
    // eg. [4,5,3]
    leftColWidth = props.columnConfiguration[0]
    rightColWidth = props.columnConfiguration[2]
    centerColWidth = props.columnConfiguration[1]
  }

  if (props.columnConfiguration instanceof Array && props.columnConfiguration.length === 2) {
    // eg. [4,5,3]
    if (displayLeftCol) {
      leftColWidth = props.columnConfiguration[0]
      centerColWidth = props.columnConfiguration[1]
    } else if (displayRightCol) {
      centerColWidth = props.columnConfiguration[0]
      rightColWidth = props.columnConfiguration[1]
    }
  }

  let leftColClass = 'col-xs-12 col-md-' + leftColWidth
  let rightColClass = 'col-xs-12 col-md-' + rightColWidth
  let centerColClass = 'col-xs-12 col-md-' + centerColWidth

  if (displayLeftCol && displayRightCol) {
    // Do nothing
  } else if (displayLeftCol && !displayRightCol) {
    leftColClass = 'col-xs-12 col-md-' + leftColWidth
    rightColClass = ''
    centerColClass = 'col-xs-12 col-md-' + (leftColWidth + centerColWidth)
  } else if (!displayLeftCol && displayRightCol) {
    leftColClass = ''
    rightColClass = 'col-xs-12 col-md-' + leftColWidth
    centerColClass = 'col-xs-12 col-md-' + (leftColWidth + centerColWidth)
  } else if (!displayLeftCol && !displayRightCol) {
    leftColClass = ''
    rightColClass = ''
    centerColClass = 'col-xs-12'
  }

  return (
    <div className='summary entry-summary vehicle-summary'>
      <div className='container-fluid product-details padding-top padding-bottom'>
        <div className='row'>
          {displayLeftCol && (
            <div className={leftColClass}>
              <div className='row'>
                <Slot name='leftColumn' content={props.children}/>
              </div>
            </div>
          )}

          {props.children && (
            <div className={centerColClass}>
              <Slot className='main' role='main' content={props.children}/>
            </div>
          )}

          {displayRightCol && (
            <div className={rightColClass}>
              <div className='row'>
                <Slot name='rightColumn' content={props.children}/>
              </div>
            </div>
          )}
        </div>

        <Modal>
          <Modal.Header>
            <Modal.Title></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default ThreeColumnDynamicLayout
