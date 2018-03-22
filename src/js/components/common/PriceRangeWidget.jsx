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

const PriceRangeWidget = (props) => {
  const { priceRange } = props
  return (
    <div className='widget widget-price-range'>
      <h3 className='widget-title'>Price Range</h3>
      <aside method='post' className='price-range-slider' data-start-min={priceRange.startMin} data-start-max={priceRange.startMax} data-min={priceRange.min} data-max={priceRange.max} data-step={priceRange.step}>
        <div className='ui-range-slider' />
        <footer className='ui-range-slider-footer'>
          {/*<div className='column'>
			<button type='submit' className='btn btn-ghost btn-sm btn-default'>Filter</button>
		  </div>*/}
          <div className='column'>
            <div className='ui-range-values'>
              <div className='ui-range-value-min'>$<span /><input type='hidden' /></div> -
              <div className='ui-range-value-max'>$<span /><input type='hidden' /></div>
            </div>
          </div>
        </footer>
      </aside>
    </div>
  )
}

export default PriceRangeWidget