import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { SplitButton, ButtonGroup, Button, Checkbox, Radio, } from 'react-bootstrap'

const ThreeColumnDynamicLayout = (props) => {
  let displayLeftCol = props.displayLeftCol
  let displayRightCol = props.displayRightCol

  let leftColClass = 'col-xs-12 col-md-3'
  let rightColClass = 'col-xs-12 col-md-3'
  let centerColClass = 'col-xs-12 col-md-6'

  if (displayLeftCol && displayRightCol) {
    // Do nothing
  }
  else if (displayLeftCol && !displayRightCol) {
    leftColClass = 'col-xs-12 col-md-3'
    rightColClass = ''
    centerColClass = 'col-xs-12 col-md-9'
  }
  else if (!displayLeftCol && displayRightCol) {
    leftColClass = ''
    rightColClass = 'col-xs-12 col-md-3'
    centerColClass = 'col-xs-12 col-md-9'
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
                {props.leftCol}
              </div>
            </div>
          )}

          {props.children && [
            <div className={centerColClass}>
              {props.children}
            </div>
          ]}

          {displayRightCol && (
            <div className={rightColClass}>
              <div className='row'>
                {props.rightCol}
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
