import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import PropTypes from 'prop-types'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'

import FormComponent from 'quickcommerce-react/components/FormComponent.jsx'

import noUiSlider from 'nouislider'

const ColorsWidget = (props) => {
  const { colors } = props
  return (
    <div className='widget widget-color'>
      <h3 className='widget-title'>Colors</h3>
      <ul>
        {Object.keys(colors).map((key, idx) => (
          <li key={idx} rel={key}><a href='#'>
            <span className='color' style={{backgroundColor: '#93c4ef'}} />
            {colors[key]}
          </a></li>
        ))}
      </ul>
    </div>
  )
}

export default ColorsWidget