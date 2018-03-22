import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { SplitButton, ButtonGroup, Button, Checkbox, Radio, } from 'react-bootstrap'

const ThreeColumnDynamicLayout = (props) => {
  return (
    <div className='summary entry-summary vehicle-summary'>
      <div className='product-details'>
        <div className='row'>
          {/*<div className='col-xs-12 vehicle-summary-title'>
         <div className='shop-item-details ribbon-blue'>
         <h5 className='shop-item-title'>
         <small>
         <span className='float-left'>{inventoryNum}</span>
         <span className='float-right'>{year} {title} {style}</span>
         </small>
         </h5>
         </div>
         </div>*/}

          <div className='col-xs-12 col-md-3 space-top-half'>
            <div className='row top_row'>

            </div>
          </div>

          {/*props.displayLocation && [
           <div className='col-sm-12 col-md-6 top_row'>
           {props.children}
           </div>,
           <div className='col-sm-12 col-md-3 top_row'>
           <div className='row'>
           <div className='col-xs-12 vehicle-summary-map'>
           <iframe src='https://maps.google.com/maps?q=carco&t=&z=13&ie=UTF8&iwloc=&output=embed' width='100%' height={260} frameBorder={0} style={{border: 0}} />
           </div>
           </div>
           </div>
           ]*/}

          {props.children && [
            <div className='col-sm-12 col-md-6 top_row'>
              {props.children}
            </div>,
            <div className='col-sm-12 col-md-3 top_row'>
              <div className='row'>

              </div>
            </div>
          ]}
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
