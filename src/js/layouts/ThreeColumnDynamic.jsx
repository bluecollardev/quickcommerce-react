import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { SplitButton, ButtonGroup, Button, Checkbox, Radio, } from 'react-bootstrap'

import Slot, { slot, findNamedSlotNode } from 'quickcommerce-react/modules/slots/Slots.jsx'

const ThreeColumnDynamicLayout = (props) => {
  let displayLeftCol = props.displayLeftCol
  let displayRightCol = props.displayRightCol

  let leftColWidth = 3
  let rightColWidth = 3
  let centerColWidth = 6

  if (props.columnConfiguration instanceof Array &&
    props.columnConfiguration.length == 3) {
    // eg. [4,5,3]
    leftColWidth = props.columnConfiguration[0]
    rightColWidth = props.columnConfiguration[2]
    centerColWidth = props.columnConfiguration[1]
  }

  let leftColClass = 'col-xs-12 col-md-' + leftColWidth
  let rightColClass = 'col-xs-12 col-md-' + rightColWidth
  let centerColClass = 'col-xs-12 col-md-' + centerColWidth

  if (displayLeftCol && displayRightCol) {
    // Do nothing
  }
  else if (displayLeftCol && !displayRightCol) {
    leftColClass = 'col-xs-12 col-md-' + leftColWidth
    rightColClass = ''
    centerColClass = 'col-xs-12 col-md-' + (leftColWidth + rightColWidth)
  }
  else if (!displayLeftCol && displayRightCol) {
    leftColClass = ''
    rightColClass = 'col-xs-12 col-md-' + leftColWidth
    centerColClass = 'col-xs-12 col-md-' + (leftColWidth + rightColWidth)
  }
  else if (!displayLeftCol && !displayRightCol) {
    leftColClass = ''
    rightColClass = ''
    centerColClass = 'col-xs-12'
  }

  return (
    <div className='summary entry-summary vehicle-summary'>

      <div className='product-details'>
        <div className='row'>
          {displayLeftCol && (
            <div className={leftColClass}>
              <div className='row'>
                <Slot name='leftColumn' as='leftColumn' content={props.children} />
              </div>
            </div>
          )}

          {props.children && [
            <div className={centerColClass}>
              <Slot className='main' role='main' content={props.children} />
            </div>
          ]}

          {displayRightCol && (
            <div className={rightColClass}>
              <div className='row'>
                <Slot name='rightColumn' as='rightColumn' content={props.children} />
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
