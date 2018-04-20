import { Dispatcher } from 'flux'

import Griddle from 'griddle-react'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { Col, ControlLabel, FormGroup, Grid, Row, TabPanes, Well } from 'react-bootstrap'
//import Stepper from '../stepper/BrowserStepper.jsx'
import BrowserActions from '../../actions/BrowserActions.jsx'

import itemFieldNames from '../../forms/ItemFields.jsx'
import { BrowserStore } from '../../stores/BrowserStore.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

import BrowserMenu from './BrowserMenu.jsx'

//import StarRating from 'react-star-rating'

class ProductBrowser extends Component {
  static propTypes = {
    itemMappings: PropTypes.object, // TODO: object.isRequired
    onAddToCartClicked: PropTypes.func,
    onItemClicked: PropTypes.func,
    onFilterSelected: PropTypes.func,
    onStepClicked: PropTypes.func
  }

  static defaultProps = {
    itemMappings: itemFieldNames, // Defaults from ItemFields
    onItemClicked: () => {},
    onAddToCartClicked: () => {},
    onFilterSelected: () => {},
    onStepClicked: () => {}
  }

  constructor(props) {
    super(props)

    this.configureRow = this.configureRow.bind(this)
    this.getInitialState = this.getInitialState.bind(this)
    this.loadBrowserData = this.loadBrowserData.bind(this)

    // Initialize or set ProductBrowser dispatcher
    if (!props.hasOwnProperty('dispatcher')) {
      this.dispatcher = new Dispatcher()
    } else {
      this.dispatcher = props.dispatcher
    }

    // Initialize or set ProductBrowser store
    if (!props.hasOwnProperty('store')) {
      this.store = new BrowserStore(this.dispatcher)
    } else {
      this.store = props.store
    }

    // Initialize or set ProductBrowser actions
    if (!props.hasOwnProperty('actions')) {
      this.actions = BrowserActions(this.dispatcher)
    } else {
      this.actions = props.actions
    }

    this.store.addChangeListener(this.loadBrowserData)

    this.state = this.getInitialState()
  }

  // Need to pass in non-default actions, this component needs some work, right now it's a hassle to get it working
  // in any manner other than with Quick Commerce endpoints
  setActions(actions) {
    this.actions = actions
  }

  // TODO: Fry anything we don't need in here!
  getInitialState() {
    let state = {
      categories: [],
      items: [],
      options: [],
      availableTracks: [], // Just so we don't forget VEST
      availableDates: [], // VEST as well
      unavailableDates: [], // Bookings,
      stepForward: false
    }

    return state
  }

  componentDidMount() {
    //let cards = document.getElementsByClassName('card')
    //HtmlHelper.equalHeights(cards, true)

    this.loadBrowserData()
  }

  componentDidUpdate() {
    let cards = document.getElementsByClassName('card')
    //HtmlHelper.equalHeights(cards, true)
  }

  componentWillUnmount() {
    if (typeof this.loadBrowserData === 'function') {
      this.store.removeChangeListener(this.loadBrowserData)
    }
  }

  loadBrowserData() {
    // Grab our items and update our component state whenever the BrowserStore is updated
    let items = this.store.getItems()
    let categories = this.store.getCategories()
    let options = this.store.getOptions()

    /*console.log('product browser state change detected')
     console.log(categories)
     console.log(items)
     console.log(options)*/

    this.setState({
      categories: categories,
      items: items,
      options: options
    })
  }

  reset() {
    this.props.stepper.start()
  }

  configureRow(rowComponent) {
    let that = this
    let fn = null

    // Configure product browser row
    if (this.props.hasOwnProperty('onItemClicked') && typeof this.props.onItemClicked === 'function') {

      // Wrap the function in a generic handler so we can pass in custom args
      let callback = fn = this.props.onItemClicked
      fn = function () {
        // What's the current step?
        let step = that.store.getConfig()

        // Make sure there's a next step before calling it into action
        // Also, subtract a step to account for zero index
        if (that.props.stepper.currentStep < (that.props.stepper.steps.length - 1)) {
          that.props.stepper.next()
        }

        // Execute our handler
        callback(...arguments)
      }
    } else {
      fn = this.props.onItemClicked
    }

    // Override default component props and decorate them with our passed in props
    rowComponent.defaultProps.onItemClicked = fn
    rowComponent.defaultProps.onAddToCartClicked = this.props.onAddToCartClicked // Shortcut - quick add to cart
    rowComponent.defaultProps.stepper = this.props.stepper

    return rowComponent
  }

  render() {
    // Render ProductBrowser
    let rowComponent = this.configureRow(this.props.customRowComponent)
    let item = this.props.item || null

    console.log('product browser render triggered')
    console.log(this.state)

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
            <h4 className='browser-product-title'>{this.props.title}</h4>
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
                      {/*<Box margin={{top: 'none'}}>
                       <Box pad={{vertical: 'small'}}
                       direction='row'
                       align='center'
                       justify='between'>
                       <label>Retail Price</label>
                       <Paragraph size='large' margin='none'>
                       <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                       </Paragraph>
                       </Box>
                       <Box pad={{vertical: 'small'}}
                       direction='row'
                       align='center'
                       justify='between'
                       separator='top'>
                       <label>Rating</label>
                       <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />
                       </Box>
                       </Box>*/}
                    </Col>
                    <Col sm={6}>
                      {/*<Box pad={{vertical: 'small'}}
                       direction='row'
                       align='center'
                       justify='between'>
                       <label>Status</label>
                       <Paragraph size='large' margin='none'>
                       <strong style={{ fontSize: '1rem' }}>{item.stock_status}</strong>
                       </Paragraph>
                       </Box>
                       <Box margin={{top: 'none'}}>
                       <Box pad={{vertical: 'small'}}
                       direction='row'
                       align='center'
                       justify='between'
                       separator='top'>
                       <label>Quantity</label>
                       <Paragraph size='large' margin='none'>
                       <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                       </Paragraph>
                       </Box>
                       </Box>*/}
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
                        {/*<Box margin={{top: 'none'}}>
                         <Box pad={{vertical: 'small'}}
                         direction='row'
                         align='center'
                         justify='between'>
                         <label>Retail Price</label>
                         <Paragraph size='large' margin='none'>
                         <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                         </Paragraph>
                         </Box>
                         <Box pad={{vertical: 'small'}}
                         direction='row'
                         align='center'
                         justify='between'
                         separator='top'>
                         <label>Rating</label>
                         <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />
                         </Box>
                         </Box>
                         <Box pad={{vertical: 'small'}}
                         direction='row'
                         align='center'
                         justify='between'>
                         <label>Status</label>
                         <Paragraph size='large' margin='none'>
                         <strong style={{ fontSize: '1rem' }}>{item.stock_status}</strong>
                         </Paragraph>
                         </Box>
                         <Box margin={{top: 'none'}}>
                         <Box pad={{vertical: 'small'}}
                         direction='row'
                         align='center'
                         justify='between'
                         separator='top'>
                         <label>Quantity</label>
                         <Paragraph size='large' margin='none'>
                         <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                         </Paragraph>
                         </Box>
                         </Box>*/}
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
               <strong style={{ fontSize: '1.3rem' }}>Some Stock Status</strong>
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

export default ProductBrowser
