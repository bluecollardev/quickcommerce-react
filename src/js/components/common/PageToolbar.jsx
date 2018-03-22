import assign from 'object-assign'

import React, { Component } from 'react'
//import {inject, observer, Provider} from 'mobx-react'

//import Avatar from 'material-ui/Avatar'
//import Chip from 'material-ui/Chip'
//import IconButton from 'material-ui/IconButton'
//import Button from 'material-ui/Button'

import { Grid, Col, Row } from 'react-bootstrap'
//import { Thumbnail } from 'react-bootstrap'
//import { Modal, Accordion, Panel } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
//import { Alert, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'
//import { Button, Checkbox, Radio } from 'react-bootstrap'
//import { Jumbotron, Well } from 'react-bootstrap'

import FlexIconMenu from 'quickcommerce-react/components/menu/FlexIconMenu.jsx'

//import DealLenderButtons from '../deal/DealLenderButtons.jsx'

class PageToolbar extends Component {
  constructor(props) {
    // Something is missing here...
    super(props)

    this.cancelBubble = this.cancelBubble.bind(this)
  }

  cancelBubble(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    let { data } = this.props

    return (
      <FlexIconMenu
        className='page-submenu'
        data={data}>
        <Col xs={12} sm={3} lg={2} className='actionButtons submenu-title'>
          <div className='menuWrapper'>
            <h6 className='section-heading padding-top padding-bottom'>
              <span>{this.props.title}</span>
            </h6>
          </div>
        </Col>
        <Col xs={12} sm={9} lg={10} className='actionButtons submenu-menu'>
          <div className='menuWrapper'>
            <h6 className='section-heading padding-top padding-bottom hidden-xs'>
              <span>{this.props.subtitle}</span>
            </h6>

            <div className='mainMenu'></div>
          </div>
        </Col>
      </FlexIconMenu>
    )
  }
}

export default PageToolbar
