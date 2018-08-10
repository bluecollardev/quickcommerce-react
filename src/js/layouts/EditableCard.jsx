import React, { Component, Fragment } from 'react'

import { Modal, Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

import Slot from '../modules/slots/Slots.jsx'

class EditableCardLayout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const props = this.props

    let modalColClass = (typeof props.modalColClass === 'string') ? props.modalColClass : 'modal col-xs-12'
    let mainColClass = 'col-xs-12'

    return (
      <div className='summary entry-summary'>
        <div className='container-fluid padding-top padding-bottom'>
          <div className='row'>
            {props.children && (
              <div className={mainColClass}>
                <Slot className='main' role='main' content={props.children} />
              </div>
            )}
          </div>

          <Slot name='modal' content={props.children} />
        </div>
      </div>
    )
  }
}

export default EditableCardLayout
