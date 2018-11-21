import React, { Component } from 'react'
import { Dispatcher } from 'flux'

import { Col, ControlLabel, FormGroup, Grid, Row, TabPanes, Well } from 'react-bootstrap'

import Griddle from 'griddle-react'

import AbstractBrowserStep from './AbstractBrowserStep.jsx'

import BrowserMenu from './BrowserMenu.jsx'
import FilterBar from './common/FilterBar.jsx'
import CategoryFilterBar from './common/CategoryFilterBar.jsx'
import BootstrapPager from './common/GriddleBootstrapPager.jsx'

/**
 * Sample config:
 * <BrowserStep
     ref={(browser) => this.catalogBrowser = browser}
     settings={this.props.settingStore}
     //items = {settings.config.catalog.items}
     activeStep='cart'
     displayTitle={false}
     title={this.props.title}
     showPager={false}
     displayProductFilter={false}
     displayCategoryFilter={false}
     displayTextFilter={false}
     stepper={this.stepper}
     steps={steps}
     resultsPerPage={15}
     customRowComponent={ProductRow4x}
     onItemClicked={this.itemClicked}
     onAddToCartClicked={this.props.addToCartClicked}
     onFilterSelected={this.categoryFilterSelected}
     onStepClicked={this.stepClicked}
   />
 */
class BrowserStep extends AbstractBrowserStep {
  constructor(props) {
    super(props)

    if (typeof this.registerDecorators === 'function') {
      this.registerDecorators = this.registerDecorators.bind(this)
    }

    this.state = {
      items: []
    }
  }

  componentWillMount() {
    if (typeof this.registerDecorators === 'function') {
      this.registerDecorators()
    }
  }

  componentDidMount() {
    const { filterItems } = this.props

    if (typeof this.fetchData === 'function') {
      this.fetchData((payload) => {
        let items = payload.content || []
        if (typeof filterItems === 'function') {
          items = filterItems(items)
        }

        this.setState({ items: items })
      })
    }
  }

  render() {
    // Render BrowserStep
    let rowComponent = this.configureRow(this.props.customRowComponent)
    let item = this.props.item || null

    //console.log('product browser render triggered')
    //console.log(this.state)

    return (
      <div className='browser-container'>
        <div className='browser-menu-container'>
          {this.props.displayCategoryFilter && (
            <CategoryFilterBar
              items={this.state.categories}
              onFilterSelected={this.props.onFilterSelected}
            />
          )}
          <BrowserMenu
            steps={this.props.steps}
            activeStep={this.props.activeStep}
            onStepClicked={this.props.onStepClicked}
          />
          {this.props.displayProductFilter && (
            <FilterBar />
          )}
        </div>

        {this.props.displayTitle && (
          <div>
            <hr/>
            {/*<h4 className='browser-product-title'>{this.props.title}</h4>*/}
          </div>
        )}

        {Object.keys(this.state.items).length > 0 && item !== null && (
          <div className='browser-content row'>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                <Well>
                  <Row>
                    <Col sm={6}>
                    </Col>
                    <Col sm={6}>
                    </Col>
                  </Row>
                </Well>
              </FormGroup>
            </Col>
          </div>
        )}

        {this.props.children && !(Object.keys(this.state.items).length > 0) && (
          <div className='browser-content row'>
            <Col sm={6}>
              {item !== null && (
                <FormGroup>
                  <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                  <Well>
                    <Row>
                      <Col xs={12}>
                      </Col>
                    </Row>
                  </Well>
                </FormGroup>
              )}
            </Col>
            <Col sm={6}>
              {this.props.children}
            </Col>
          </div>
        )}

        {this.props.children && (Object.keys(this.state.items).length > 0) && (
          <div className='browser-content row'>
            <Col sm={6}>
              <Grid fluid={true}>
                <Griddle
                  showFilter={this.props.displayTextFilter}
                  columns={[
                    'manufacturer',
                    'name',
                    'model',
                    //'location',
                    //'date_added',
                    //'options',
                    'price'
                  ]}
                  useGriddleStyles={false}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  useCustomRowComponent={true}
                  resultsPerPage={12}
                  customRowComponent={rowComponent}
                  results={this.state.items}
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
                showFilter={this.props.displayTextFilter}
                columns={[
                  'manufacturer',
                  'name',
                  'model',
                  //'location',
                  //'date_added',
                  //'options',
                  'price'
                ]}
                useGriddleStyles={false}
                useCustomPagerComponent={true}
                customPagerComponent={BootstrapPager}
                useCustomRowComponent={true}
                resultsPerPage={12}
                customRowComponent={rowComponent}
                results={this.state.items}
              />
            </Grid>
          </div>
        )}
      </div>
    )
  }
}

export default BrowserStep
