import React, { Component } from 'react'

import ProductBrowser from '../browser/ProductBrowser.jsx'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Well } from 'react-bootstrap'

import Griddle from 'griddle-react'

import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Card from 'grommet/components/Card'
import Chart, { Area, Axis, Base, Layers } from 'grommet/components/chart/Chart'
//import Menu from 'grommet/components/Menu'
import Footer from 'grommet/components/Footer'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'
import Select from 'grommet/components/Select'
import Heading from 'grommet/components/Heading'
import Hero from 'grommet/components/Hero'
import Image from 'grommet/components/Image'
import Label from 'grommet/components/Label'
import TableHeader from 'grommet/components/TableHeader'
import TableRow from 'grommet/components/TableRow'
import Paragraph from 'grommet/components/Paragraph'
import Quote from 'grommet/components/Quote'
import Section from 'grommet/components/Section'
import SocialShare from 'grommet/components/SocialShare'
import Video from 'grommet/components/Video'
import CirclePlayIcon from 'grommet/components/icons/base/CirclePlay'

import StarRating from 'react-star-rating'

//import Stepper from '../stepper/BrowserStepper.jsx'
import BrowserActions from '../../actions/BrowserActions.jsx'
import BrowserStore from '../../stores/BrowserStore.jsx'
import BrowserMenu from '../browser/BrowserMenu.jsx'

import CatalogRow from '../catalog/CatalogRow.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

import HtmlHelper from '../../helpers/HTML.js'

export default class Menu extends ProductBrowser {
    render() {
        let rowComponent = this.configureRow(this.props.customRowComponent)
        let item = this.props.item || null
        
        return (
            <div className="col-xs-12 col-sm-10 col-sm-push-1">
                {this.props.displayCategoryFilter && (
                <CategoryFilterBar
                    items = {this.state.categories}
                    onFilterSelected = {this.props.onFilterSelected}
                />
                )}

                <div className='browser-container'>
                  <div className='browser-menu-container'>
                      {/*<BrowserMenu
                          steps = {this.props.steps}
                          activeStep = {this.props.activeStep}
                          onStepClicked = {this.props.onStepClicked}
                          />*/}
                      {this.props.displayProductFilter && (
                      <FilterBar
                          />
                      )}
                  </div>
                  
                  {this.props.displayTitle && (
                      <div>
                          <hr />                
                          <h4 className='browser-product-title'>{this.props.title}</h4>
                      </div>
                  )}
                  
                  <div className='browser-content row'>
                      {/*<Col sm={12}>
                          {this.props.children}
                      </Col>*/}
                      <Col xs={12}>
                          <Griddle
                              showFilter = {this.props.displayTextFilter}
                              columns = {[
                                  'manufacturer',
                                  'name',
                                  'model',
                                  //'location',
                                  //'date_added',
                                  //'options',
                                  'price'
                              ]}
                              useGriddleStyles = {false}
                              showPager = {this.props.showPager}
                              useCustomPagerComponent = {true}
                              customPagerComponent = {BootstrapPager}
                              useCustomRowComponent = {true}
                              sortAlgorithm = {this.props.sortAlgorithm}
                              initialSort = {this.props.initialSort}
                              resultsPerPage = {this.props.resultsPerPage}
                              customRowComponent = {rowComponent}
                              results = {this.state.items}
                          />
                      </Col>
                      <Col xs={12}>
                        {this.props.children}
                      </Col>
                  </div>
              </div>
            </div>
        )
    }
}