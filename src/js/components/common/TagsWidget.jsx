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

const TagsWidget = (props) => {
  const { tags } = props
  return (
    <div className='widget widget-tags'>
      <h3 className='widget-title'>Popular Tags</h3>
      {tags.map((value, idx) => (
        <a key={idx} rel={value} href='#'>{value}</a>
	  ))}
    </div>
  )
}

export default TagsWidget