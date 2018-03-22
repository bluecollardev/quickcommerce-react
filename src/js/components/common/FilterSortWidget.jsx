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

import { SelectList } from 'quickcommerce-react/components/form/Dropdown.jsx'
import { DateInput, DateTimeInput, TimeInput, NumericInput } from 'quickcommerce-react/components/form/Input.jsx'

import noUiSlider from 'nouislider'

const SortWidget = (props) => {
  const { sort } = props
  
  return (
    <div className='widget widget-sorting'>
      <h3 className='widget-title'>
        <FormGroup className='form-element form-select'>
          <ControlLabel>
            <i className='fa fa-sort' />&nbsp;Arrange By
          </ControlLabel>
          <SelectList className='form-control'
            items={[
              { code: 'PROFIT', value: 'Profitability (Default)', selected: true },
              { code: 'PROFITMANDATE', value: 'Profit Mandate' },
              { code: 'PROFITMANDATE', value: 'Price (High to Low)' },
              { code: 'PROFITMANDATE', value: 'Price (Low to High)' }
            ]}
          />
        </FormGroup>
      </h3>
      <ul>
        {Object.keys(sort).map((key, idx) => (
          <li key={idx} rel={key} className='active'><a href='#'>
            <i className='material-icons' />
            {sort[key]}
          </a></li>
        ))}
      </ul>
    </div>
  )
}

export default SortWidget