import React, { Component } from 'react'

import ProductBrowser from '../browser/ProductBrowser.jsx'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Well } from 'react-bootstrap'

import Griddle from 'griddle-react'

import StarRating from 'react-star-rating'

//import Stepper from '../stepper/BrowserStepper.jsx'
import BrowserActions from '../../actions/BrowserActions.jsx'
import BrowserStore from '../../stores/BrowserStore.jsx'
import BrowserMenu from '../browser/BrowserMenu.jsx'

import CategoryRow from '../catalog/CategoryRow.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

import HtmlHelper from '../../helpers/HTML.js'

export default class Categories extends ProductBrowser {    
    render() {
        // Render categories
        let rowComponent = this.configureRow(this.props.customRowComponent)
        let item = this.props.item || null
        
        console.log('dumping categories')
        console.log(this.state.categories)

        return (
            <div className="row padding-top padding-bottom">
                {this.props.displayCategoryFilter && (
                <CategoryFilterBar
                    items = {this.state.categories}
                    onFilterSelected = {this.props.onFilterSelected}
                />
                )}    
                
                {/*<ul className="nav-tabs text-center" role="tablist">
                  <li className="active"><a href="#pho" role="tab" data-toggle="tab">Noodle Soups</a></li>
                  <li><a href="#bun" role="tab" data-toggle="tab">Noodle Bowls</a></li>
                  <li><a href="#rice" role="tab" data-toggle="tab">Rice Dishes</a></li>
                  <li><a href="#appetizers" role="tab" data-toggle="tab">Appetizers</a></li>
                </ul>*/}

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
                  
                  {this.props.children && (Object.keys(this.state.categories).length > 0) && (
                  <div className='browser-content row'>
                      <Col sm={6}>
                          {/*item !== null && (
                          <FormGroup>
                              <ControlLabel>Product Details</ControlLabel>
                              <Well>
                                  <Box margin={{top: 'none'}}>
                                      <Paragraph size='large' margin='none'>
                                          <h3>{this.props.title}</h3>
                                      </Paragraph>
                                      
                                      <Box pad={{vertical: 'small'}}
                                          direction='row'
                                          align='center'
                                          justify='between'
                                          separator='top'>
                                          <label>Retail Price</label>
                                          <Paragraph size='large' margin='none'>
                                              <strong style={{ fontSize: '1.7rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                                          </Paragraph>
                                      </Box>
                                      <Box pad={{vertical: 'small'}}
                                          direction='row'
                                          align='center'
                                          justify='between'
                                          separator='top'>
                                          <label>Status</label>
                                          <Paragraph size='large' margin='none'>
                                              <strong style={{ fontSize: '1.3rem' }}>{item.stock_status}</strong>
                                          </Paragraph>
                                      </Box>
                                      <Box pad={{vertical: 'small'}}
                                          direction='row'
                                          align='center'
                                          justify='between'
                                          separator='top'>
                                          <label>Qty Available</label>
                                          <Paragraph size='large' margin='none'>
                                              <strong style={{ fontSize: '1.3rem' }}>{item.quantity}</strong>
                                          </Paragraph>
                                      </Box>
                                      <Box pad={{vertical: 'small'}}
                                          direction='row'
                                          align='center'
                                          justify='between'
                                          separator='top'>
                                          <label>Average Review</label>
                                          <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />
                                      </Box>
                                  </Box>
                              </Well>
                          </FormGroup>
                          )*/}
                          <Grid fluid={true}>
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
                                  showPager = {false}
                                  useCustomPagerComponent = {true}
                                  customPagerComponent = {BootstrapPager}
                                  useCustomRowComponent = {true}
                                  resultsPerPage = {this.props.resultsPerPage}
                                  customRowComponent = {rowComponent}
                                  results = {this.state.categories.slice(0, this.props.maxResults)}
                              />
                          </Grid>
                      </Col>
                      <Col sm={6}>
                          {this.props.children}
                      </Col>
                  </div>
                  )}
                      
                  {!this.props.children && (
                  <div className='browser-content row'>
                      <Grid fluid={true}>
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
                              showPager = {false}
                              useCustomPagerComponent = {true}
                              customPagerComponent = {BootstrapPager}
                              useCustomRowComponent = {true}
                              resultsPerPage = {this.props.resultsPerPage}
                              customRowComponent = {rowComponent}
                              results = {this.state.categories.slice(0, this.props.maxResults)}
                          />
                      </Grid>
                  </div>
                  )}
                </div>
                {/*<div className="col-sm-3 col-xs-6">
                    <a href="#" className="category-link">
                      <img src={this.props.categories[0].backgroundImage} alt={this.props.categories[0].title} />
                      {this.props.categories[0].title}
                    </a>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                    <a href="#" className="category-link">
                      <img src={this.props.categories[1].backgroundImage} alt={this.props.categories[1].title} />
                      {this.props.categories[1].title}
                    </a>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                    <a href="#" className="category-link">
                      <img src={this.props.categories[2].backgroundImage} alt={this.props.categories[2].title} />
                      {this.props.categories[2].title}
                    </a>
                    </div>
                    <div className="col-sm-3 col-xs-6">
                    <a href="#" className="category-link">
                      <img src={this.props.categories[3].backgroundImage} alt={this.props.categories[3].title} />
                      {this.props.categories[3].title}
                    </a>
                </div>*/}
            </div>
        )
    }
}