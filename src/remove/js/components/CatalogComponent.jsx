import assign from 'object-assign'
import React from 'react'
import PropTypes from 'prop-types'

import { Col, Row } from 'react-bootstrap'

import QcCatalog from 'qc-react/components/shop/Catalog.jsx'
import Products from 'qc-react/components/shop/Products.jsx'

import DealVehicleSearchQuery from 'indigo-models/DealVehicleSearchQuery'

// Override pre-configured step types
import CategoryStep from '../steps/Category.jsx'
import ProductStep from '../steps/Product.jsx'
import ProductOptionStep from '../steps/ProductOption.jsx'
import ProductRow4x from './catalog/ProductRow4x.jsx'

import DealVehiclesFilterBar from './common/DealVehiclesFilterBar.jsx'
//import { Well } from 'react-bootstrap'

// @flow
class CatalogComponent extends QcCatalog {
  constructor(props) {
    super(props)

    this.loadCategory = this.loadCategory.bind(this)
    this.loadItems = this.loadItems.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    let dealId = this.props.match.params.dealId || null

    if (dealId !== null && !isNaN(dealId)) {
      // Reload when / if top categories have been fetched
      this.props.catalogStore.addChangeListener(this.handleChange)

      this.loadItems()
    }
  }

  loadItems() {
    let dealId = this.props.match.params.dealId || null

    if (dealId !== null && !isNaN(dealId)) {
      let query: DealVehicleSearchQuery = { dealId: parseInt(dealId) }

      console.log('created a new DealVehicleSearchQuery')
      console.log(query)

      this.catalogBrowser.actions.searchProducts(query)
    }

    //this.testSearchQuery()
  }

  // Move examples to regex include
  /*static myRegex = () => {
     let myRegexString = ''
     // Match any number of numeric characters
     myRegexString += '[0-9]+'
     // Match dash exactly
     myRegexString +='-'
     // Match any number of numeric characters
     myRegexString += '[0-9]+'

     return myRegexString
     }

     testMyRegex() {
     let myRegex = new RegExp(CatalogComponent.myRegex)

     '50-10000'.test(CatalogComponent.myRegex)
   }

   testSearchQuery() {
     // Initialize and dump new VehicleSearchQuery
     // TODO: Make me into a test!
     let query = Object.create(VehicleSearchQuery)
     console.log('dumping VehicleSearchQuery')
     console.log(query)
     // Test flow sealed object
     query.foobar = 'Turn up the good, turn down the suck!'
     // Expected to throw an error....
   }*/

  // Configure new steps
  configureSteps() {
    // An array of step functions
    return [
      {
        config: assign({}, CategoryStep, {
          stepId: 'shop',
          indicator: '1',
          title: 'Choose Category'
        }),
        before: (stepId, step) => {
          console.log('load category step...')
          return true
        },
        action: (step, data, done) => {
          //this.topCategoryBrowser.actions.loadCategories()

          if (done) {
            // Process checkout if done
            this.onComplete()
          }
        },
        validate: (stepId, stepDescriptor, data) => {
          console.log('validating current step: ' + stepId)
          console.log(data)

          let categoryId = data['category_id'] || null

          if (categoryId === null) {
            alert('Please select a category to continue')
            return false
          }

          return true
        }
      },
      {
        config: assign({}, ProductStep, {
          stepId: 'cart',
          indicator: '2',
          title: 'Choose Product'
        }),
        before: (stepId, step) => {
          console.log('load product step...')
          return true
        },
        action: (step, data, done) => {
          data = data || null
          if (data !== null && data.hasOwnProperty('category_id') && !Number.isNaN(data.category_id)) {

            this.catalogBrowser.actions.loadProducts(data.category_id) // TODO: CONST for prop name?
          } else {
            this.catalogBrowser.actions.loadProducts()
          }

          if (done) {
            // Process checkout if done
            this.onComplete()
          }
        },
        validate: (stepId, stepDescriptor, data) => {
          console.log('validating current step: ' + stepId)
          console.log(data)

          let productId = data['id'] || null

          if (productId === null) {
            alert('Please select a product to continue')
            return false
          }

          return true
        }
      },
      {
        config: assign({}, ProductOptionStep, {
          stepId: 'options',
          indicator: '3',
          title: 'Customize Product'
        }),
        before: (stepId, step) => {
          console.log('load option step...')
          return true
        },
        action: (step, data, done) => {
          data = data || null
          // Store the selection

          if (data !== null && data.hasOwnProperty('id') && !Number.isNaN(data.id)) {

            this.optionBrowser.actions.loadOptions(data) // TODO: CONST for prop name?
          } else {
            // Do nothing - options only correlate to a browser item
          }

          if (done) {
            // Process checkout if done
            this.onComplete()
          }
        },
        validate: (stepId, stepDescriptor, data) => {
          console.log('validating current step: ' + stepId)
          console.log(data)

          return true
        }
      }
      /*{
        config: {
          stepId: 'checkout',
          indicator: '4',
          title: 'Review Your Order'
        },
        // 'action' must be defined, even if empty
        action: (step, data, done) => {}
      },*/
      /*{
        config: {
          stepId: 'confirm',
          indicator: '5',
          title: 'Confirm Order'
        },
        // 'action' must be defined, even if empty
        action: (step, data, done) => {}
      }*/
    ]
  }

  // Override parent
  itemClicked(e, item) {
    // QuickCommerce Theme CatalogComponent.itemClicked
    e.preventDefault()
    e.stopPropagation()

    // If the Quick Add button was clicked
    if (e.target.type === 'button') {
      // TODO: Handler moved to props
      //this.addToCartClicked(e, item)

      return
    }

    this.props.actions.product.setProduct(item)

    // TODO: Leave this in as log if debug mode
    //console.log('opening product page for item:')
    //console.log(item)
    //window.location.hash = '#/product/' + item['product_id'] + '/' + item['name'] // TODO: Use mappings! And use websafe/SEO URL (currently unavailable)

    /*let stepId = 'options'
     let stepDescriptor = this.stepper.getStepById(stepId) || null

     if (stepDescriptor !== null) {
       let data = item

       let isEnded = false
       // Execute the step handler
       this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
       this.stepper.addItem(item.id, 1, item)
     }*/
  }

  categoryFilterSelected(categoryId) {
    categoryId = (!Number.isNaN(parseInt(categoryId))) ? parseInt(categoryId) : null // Ensure conversion
    // Just load browser products, don't trigger any steps
    this.catalogBrowser.actions.loadProducts(categoryId)
  }

  render() {
    let steps = this.stepper.getSteps() // Stepper extends store, we're good

    const { actions, catalogStore, dealStore } = this.props
    let categories = catalogStore.getCategories()

    let filterTags = [
      'Modified',
      'On Sale',
      'Must Go',
      'Factory',
      'Discount',
      'Top Safety'
    ]

    let filterTypes = {
      sedan: 'Sedan',
      coupe: 'Coupe',
      hatchback: 'Hatchback',
      suv: 'SUV',
      mpv: 'Multi-Purpose',
      crossover: 'Crossover',
      minivan: 'Minivan', //van: 'Cargo Van',
      truck2x: 'Pickup Truck', //truck2x: '2 Axle Truck',
      //truckNx: '3+ Axle Truck',
      motorcycle: 'Motorcycle'
    }

    let priceRange = {
      min: 0,
      max: 100000,
      step: 1000,
      startMin: 1000,
      startMax: 30000
    }

    let filterSort = {
      default: 'Default',
      popularity: 'Popularity',
      profitability: 'Profitability',
      latest: 'Latest',
      rating: 'Average Rating',
      alpha: 'Alphabetical'
    }

    let checkoutClasses = ['checkout']
    let checkoutClass = ''

    /*if (isCartOpen) {
     checkoutClasses.push('open')
     }*/

    checkoutClass = checkoutClasses.join(' ')

    return (
      <main>
        <Row>
          <Col xs={12}>
            {/*<h4 className='section-heading padding-top padding-bottom' style={{textAlign: 'center'}}>
             <div className='repeater-buttons'>
             <Button className='repeater-button' onClick={this.showInventorySearchModal}><h5><i className='fa' />&nbsp;</h5></Button>
             </div>
             </h4>*/}
            {this.props.children}
          </Col>
        </Row>

        <Row className='main-content'>
          <Col xs={12}>
            <Row>
              <DealVehiclesFilterBar/>
              <Products
                store={this.props.catalogStore}
                dispatcher={this.props.dispatcher}
                actions={this.props.actions.catalog}
                ref={(browser) => this.catalogBrowser = browser}
                settings={this.props.settingStore}
                activeStep='cart'
                displayTitle={false}
                title={this.props.title}
                showPager={false}
                displayProductFilter={false}
                displayCategoryFilter={false}
                displayTextFilter={false}
                stepper={this.stepper}
                steps={steps}
                resultsPerPage={30}
                customRowComponent={ProductRow4x}
                //items = {settings.config.catalog.items}
                itemMappings={this.props.itemMappings}
                onItemClicked={this.itemClicked}
                onAddToCartClicked={this.props.addToCartClicked}
                onFilterSelected={this.categoryFilterSelected}
                onStepClicked={this.stepClicked}
              />
            </Row>

            <Row>
              <div className='col-xs-12 pagination padding-bottom space-bottom-2x'>
                <div className='col-xs-8 page-numbers'>
                  <a href='#'>1</a>
                  <a href='#'>2</a>
                  <span className='active'>3</span>
                  <a href='#'>4</a>
                  <span>...</span>
                  <a href='#'>10</a>
                </div>
                {/* TODO: Fix margins! */}
                <div className='col-xs-3 pager text-right'>
                  <a href='#'>Prev</a>
                  <span>|</span>
                  <a href='#'>Next</a>
                </div>
              </div>
            </Row>
          </Col>
          {/*<Col xs={12} sm={4} md={3} className={checkoutClass}>
           {this.props.children}
           </Col>*/}
        </Row>
      </main>
    )
  }

  componentWillUnmount() {
    this.props.catalogStore.removeChangeListener(this.handleChange)
  }

  // TODO: These handlers exist in several different components... is that what we want?

  handleChange() {
    // Indigo CatalogComponent.handleChange
    this.forceUpdate()
  }

  loadCategory() {
    let settings = this.props.settingStore.getSettings().posSettings

    settings['pinned_category_id'] = null // 'New' category
    let categoryId = null

    // Load categories
    //this.props.actions.catalog.loadTopCategories()

    // Get matching category
    /*if (typeof this.props.match !== 'undefined' &&
       typeof this.props.match.params !== 'undefined' &&
       typeof this.props.match.params.cat !== 'undefined' &&
       !isNaN(this.props.match.params.cat)) {
       console.log('load category id: ' + this.props.match.params.cat)
       categoryId = parseInt(this.props.match.params.cat)
     } else if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
       categoryId = parseInt(settings['pinned_category_id'])
     }*/
  }
}

//export default CartContext(CatalogComponent)
export default CatalogComponent
