import React from 'react'

import Griddle from 'griddle-react'

import { Col, ControlLabel, FormGroup, Grid, Row, TabPanes, Well } from 'react-bootstrap'

import ProductBrowser from '../browser/ProductBrowser.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

export default class Products extends ProductBrowser {
  render() {
    // Products.render
    let rowComponent = this.configureRow(this.props.customRowComponent)
    let item = this.props.item || null

    let hasItems = false
    let { items } = this.state

    if (typeof items !== 'undefined' && items !== null && Object.keys(this.state.items).length > 0) {
      // No items, don't bother rendering
      hasItems = true
    }

    return (
      <div className="product-catalog col-xs-12">
        {this.props.displayCategoryFilter && (
          <CategoryFilterBar
            items={this.state.categories}
            onFilterSelected={this.props.onFilterSelected}
          />
        )}

        <div className='browser-container'>
          <div className='browser-menu-container'>
            {/*<BrowserMenu
             steps = {this.props.steps}
             activeStep = {this.props.activeStep}
             onStepClicked = {this.props.onStepClicked}
             />*/}
            {this.props.displayProductFilter && (<FilterBar/>)}
          </div>

          {this.props.displayTitle && (
            <div>
              <hr/>
              <h4 className='browser-product-title'>{this.props.title}</h4>
            </div>
          )}

          {hasItems && item !== null && (
            <div className='browser-content row'>
              <Col xs={12}>
                <FormGroup>
                  <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                  <Well>
                    <Row>
                      <Col sm={6}>
                        <Box margin={{ top: 'none' }}>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'>
                            <label>Retail Price</label>
                            <p>
                              <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                            </p>
                          </Box>
                        </Box>
                      </Col>
                      <Col sm={6}>
                        <Box pad={{ vertical: 'small' }}
                          direction='row'
                          align='center'
                          justify='between'>
                          <label>Status</label>
                          <p>
                            <strong style={{ fontSize: '1rem' }}>{item.stock_status}</strong>
                          </p>
                        </Box>
                        <Box margin={{ top: 'none' }}>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'
                            separator='top'>
                            <label>Quantity</label>
                            <p>
                              <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                            </p>
                          </Box>
                        </Box>
                      </Col>
                    </Row>
                  </Well>
                </FormGroup>
              </Col>
            </div>
          )}

          {this.props.children && !hasItems && (
            <div className='browser-content row'>
              <Col sm={6}>
                {item !== null && (
                  <FormGroup>
                    <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                    <Well>
                      <Row>
                        <Col xs={12}>
                          <Box margin={{ top: 'none' }}>
                            <Box pad={{ vertical: 'small' }}
                              direction='row'
                              align='center'
                              justify='between'>
                              <label>Retail Price</label>
                              <p>
                                <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                              </p>
                            </Box>
                          </Box>
                          <Box pad={{ vertical: 'small' }}
                            direction='row'
                            align='center'
                            justify='between'>
                            <label>Status</label>
                            <p>
                              <strong style={{ fontSize: '1rem' }}>{item.stock_status}</strong>
                            </p>
                          </Box>
                          <Box margin={{ top: 'none' }}>
                            <Box pad={{ vertical: 'small' }}
                              direction='row'
                              align='center'
                              justify='between'
                              separator='top'>
                              <label>Quantity</label>
                              <p size='large' margin='none'>
                                <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                              </p>
                            </Box>
                          </Box>
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

          {this.props.children && hasItems && (
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
                    showPager={this.props.showPager}
                    useCustomPagerComponent={true}
                    customPagerComponent={BootstrapPager}
                    useCustomRowComponent={true}
                    resultsPerPage={this.props.resultsPerPage}
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
                  columns={Object.keys(this.state.items)}
                  useGriddleStyles={false}
                  showPager={this.props.showPager}
                  useCustomPagerComponent={true}
                  customPagerComponent={BootstrapPager}
                  useCustomRowComponent={true}
                  resultsPerPage={this.props.resultsPerPage}
                  customRowComponent={rowComponent}
                  results={this.state.items}
                />
              </Grid>
            </div>
          )}

          {/* Render expanded component */}
          {this.props.children}
        </div>
      </div>
    )
  }
}
