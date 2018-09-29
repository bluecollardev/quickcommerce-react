import assign from 'object-assign'
import ProductBrowser from 'qc-react/components/browser/ProductBrowser.jsx'

import ProductDetail from 'qc-react/components/catalog/ProductDetail.jsx'
import ProductOptionRow from 'qc-react/components/catalog/ProductOptionRow.jsx'

import QcProduct from 'qc-react/components/shop/Product.jsx'

import Stepper from 'qc-react/components/stepper/BrowserStepper.jsx'

import HtmlHelper from 'qc-react/helpers/HTML.js'
import CartContext from 'qc-react/modules/cart/CartContext.jsx'

import React from 'react'

import { Button, Col, Row } from 'react-bootstrap'
// Pre-configured step types
import ProductOptionStep from '../steps/ProductOption.jsx'

class ProductComponent extends QcProduct {
  constructor(props) {
    // Quick Commerce theme Product constructor
    super(props)

    this.loadProduct = this.loadProduct.bind(this)

    /*this.state = {
     showOptions: true
     }*/

    this.configureSteps = this.configureSteps.bind(this)
    this.setStep = this.setStep.bind(this)
    this.categoryFilterSelected = this.categoryFilterSelected.bind(this)
    this.categoryClicked = this.categoryClicked.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.optionClicked = this.optionClicked.bind(this)
    this.itemDropped = this.itemDropped.bind(this)
    this.stepClicked = this.stepClicked.bind(this)

    // Store our stepper instance
    // Stepper maintains its own state and store
    this.stepper = new Stepper()
    this.stepper.setSteps(this.configureSteps())
  }

  configureSteps() {
    return [
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
            // TODO: This is being triggered when clicking a browser item, but there's no data object...
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
    ]
  }

  setStep(stepId, stepDescriptor, data) {
    data = data || null
    let title = (data !== null && data.hasOwnProperty('name')) ? data.name : ''
    let price = (data !== null && data.hasOwnProperty('price') && !isNaN(data.price)) ? Number(data.price).toFixed(2) : 0.00

    this.setState({
      step: stepId,
      title: title,
      itemPrice: price,
      item: data
    })
  }

  stepClicked(stepProps) {
    // Get the BrowserStepDescriptor instance by stepId (shop|cart|checkout|etc).
    // We can't get it by index because the Step argument for this method is the config prop
    // provided to the Step component, not an instance of BrowserStepDescriptor.
    // Maybe I'll change this later...
    if (this.stepper.getSteps() instanceof Array) {
      let stepDescriptor = this.stepper.getStepById(stepProps.stepId) || null

      if (stepDescriptor !== null) {
        let data = {}
        let isEnded = false
        // Execute the step handler
        this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepProps.stepId))

      }
    }
  }

  categoryClicked(e, item) {
    e.preventDefault()
    e.stopPropagation()

    //let stepId = 'cart'
    //let stepDescriptor = this.stepper.getStepById(stepId) || null

    console.log(item)
    // Just load browser products, don't trigger any steps
    this.catalogBrowser.actions.loadProducts(item['category_id'])
  }

  // TODO: These handlers exist in several different components... is that what we want?
  // I don't think so... I should declare my handlers at the top of the app and pass them in as props I think...
  itemClicked(e, item) {
    e.preventDefault()
    e.stopPropagation()

    // If the Quick Add button was clicked
    if (e.target.type === 'button') {
      this.addToCartClicked(e, item)

      return
    }

    this.props.actions.product.setProduct(item)

    // TODO: Leave this in as log if debug mode
    console.log('opening product page for item:')
    console.log(item)
    window.location.hash = '#/product/' + item['product_id'] + '/' + item['name'] // TODO: Use mappings! And use websafe/SEO URL (currently unavailable)

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

  itemDropped(item) {
    //let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
  }

  optionClicked(item) {
    // TODO: Check what type of options etc... I have written code for this just need to port it over from the previous app
    /*let stepId = 'checkout'
     let stepDescriptor = this.stepper.getStepById(stepId) } || null

     if (typeof stepDescriptor !== null) {
     let data = item

     let isEnded = false
     // Execute the step handler
     this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
     }*/

    console.log('option clicked')
    console.log(item)

    let product = this.state.item

    this.stepper.addOption(item['product_option_value_id'], 1, item, product)
    this.forceUpdate() // Redraw, options have changed
  }

  categoryFilterSelected(categoryId, e) {
    categoryId = (!Number.isNaN(parseInt(categoryId))) ? parseInt(categoryId) : null // Ensure conversion

    let stepId = 'cart'
    let stepDescriptor = this.stepper.getStepById(stepId) || null

    if (stepDescriptor !== null) {
      let data = { category_id: categoryId }

      let isEnded = false
      // Execute the step handler
      this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
    }
  }

  componentDidMount() {
    this.loadProduct()
  }

  loadProduct() {
    let fetch = true // TODO: Force fetch for now, should be set to false

    if (typeof this.props.match !== 'undefined' && typeof this.props.match.params !== 'undefined' && typeof this.props.match.params.itemId !== 'undefined' && !isNaN(this.props.match.params.itemId)) {

      let itemId = parseInt(this.props.match.params.itemId)

      if (this.state.product === null) {
        console.log('load item id: ' + this.props.match.params.itemId)
        fetch = true
      } else if (this.state.product.hasOwnProperty('product_id')) { // TODO: Use mappings!
        if (!(Number(this.state.product['product_id']) === Number(itemId))) {
          console.log('load item id: ' + this.props.match.params.itemId)
          // If product ids don't match, refetch
          fetch = true
        }
      }

      if (fetch) {
        // Doesn't this set itself?
        this.props.productService.fetch(itemId, () => {
          this.setState({ product: this.props.productStore.getProduct() })

          this.optionBrowser.actions.loadOptions(this.props.productStore.getProduct())
        })
      }
    } else {
      if (this.state.product === null) {
        if (settings.hasOwnProperty('pinned_item_id') && !isNaN(settings['pinned_item_id'])) {
          // This block won't be triggered yet, setting doesn't currently exist
          itemId = parseInt(settings['pinned_item_id'])
        } else {
          let product = sessionStorage.getItem('selectedProduct')
          // If there's a product in session grab it (we probably triggered it from another page)
          if (typeof product === 'string' && product !== '') {
            this.setState({ product: JSON.parse(product) })
          }
        }
      }
    }
  }

  onClick(e) {
    // onClick handler for Quick Commerce theme (CartDragItem)
    if (typeof this.props.onItemClicked === 'function') {
      let fn = this.props.onItemClicked
      fn(e, this.props.item)
    }
  }

  /**
   * This handler is different from other onAddToCartClicked handlers. Trigger addToCart directly.
   */
  onAddToCartClicked(e) {
    // QuickCommerce theme Product component's onAddToCartClicked handler
    // onAddToCartClicked handler for Product
    let input = document.querySelectorAll('#product-form input.quantity')[0]
    let quantity = parseInt(input.value)
    console.log('adding ' + quantity + ' items to cart')

    // TODO: Use mappings!
    let item = {
      id: this.state.product['product_id'],
      quantity: quantity,
      data: this.state.product
    }

    if (typeof this.props.addToCart === 'function') {
      let fn = this.props.addToCart
      fn(e, item, quantity) // TODO: Quantity may be redunant...
    }
  }

  toggleOptions() {
    this.setState({showOptions: (this.state.showOptions) ? false : true})
  }

  getDescription() {
    let product = this.state.product || null
    if (product !== null) {
      // TODO: Use mappings!
      if (typeof this.state.product['description'] === 'string') {
        const html = HtmlHelper.decodeHtmlSpecialChars(this.state.product['description'])
        return { __html: html }
      }
    }

    return { __html: '' }
  }

  configureRow(rowComponent) {
    let that = this
    let fn = null

    if (this.props.hasOwnProperty('onItemClicked') && typeof this.props.onItemClicked === 'function') {

      // Wrap the function in a generic handler so we can pass in custom args
      let callback = fn = this.props.onItemClicked
      fn = function () {
        // What's the current step?
        let step = BrowserActions.getCurrentStep()

        // Make sure there's a next step before calling it into action
        // Also, subtract a step to account for zero index
        if (that.props.stepper.currentStep < (that.props.stepper.steps.length - 1)) {
          that.props.stepper.next()
        }

        // Execute our handler
        callback(arguments[0])
      }
    } else {
      fn = this.props.onItemClicked
    }

    rowComponent.defaultProps.onItemClicked = fn

    return rowComponent
  }

  /*addToCart(e) {
   e.preventDefault()

   if (typeof this.refs.parallax !== 'undefined') {
   this.refs.parallax.scrollTo(0) // Scroll subscription up
   }

   let input = document.querySelectorAll('#product-form input[type=number]')[0]
   let quantity = parseInt(input.value)
   console.log('adding ' + quantity + ' items to cart')

   let item = this.state.product
   CartStore.addItem(item.id, quantity, item)

   window.location.hash = '/category'

   let scrollDuration = 111
   let scrollStep = -window.scrollY / (scrollDuration / 15),
   scrollInterval = setInterval(() => {
   if (window.scrollY !== 0) {
   window.scrollBy(0, scrollStep)
   } else clearInterval(scrollInterval)
   }, 15)
   }*/

  render() {
    const { productStore } = this.props
    const { product } = this.state

    let steps = this.stepper.getSteps() // Stepper extends store, we're good
    let rowComponent = this.configureRow(ProductOptionRow)

    // Render Product component
    let description = this.getDescription()
    let shortDescription = this.getShortDescription()
    let price = (parseFloat(product.price)).toFixed(2)

    let productOptions = productStore.getProductOptions()
    let options = productOptions.map((productOption) => {
      return assign({}, {
        id: productOption['product_option_id'],
        values: productStore.getProductOptionValues(productOption['product_option_id']),
        product: productStore.getProduct()
      })
    })

    let primaryImage = QC_IMAGES_URI + product['image'] // TODO: Use mappings
    console.log('primary image')
    console.log(primaryImage)

    let hasExtraImages = false

    // TODO: Use mappings!
    if (product.hasOwnProperty('images')) {
      if (product['images'] instanceof Array && product['images'].length > 0) {
        primaryImage = QC_IMAGES_URI + product['images'][0].image
        hasExtraImages = true
      }
    }

    let slideStyle = {backgroundImage: 'url(' + primaryImage + ')' // Temp!
    }

    if (!hasExtraImages) {
      //slideStyle.backgroundPosition = 'left top'// Using med res photo, don't adjust background position
    }

    let colLeft = (options.length > 0) ? 6 : 12
    let colRight = (options.length > 0) ? 6 : 12

    return (
      <main className='content-wrapper'>

        {hasExtraImages && (
          <section className='fw-section bg-gray'>
            <a href='#' className='page-nav page-prev'>
              <span className='page-preview'>
                <img src='img/pager/01.jpg' alt='Page'/>
              </span>
              — Prev
            </a>
            <a href='#' className='page-nav page-next'>
              <span className='page-preview'>
                <img src='img/pager/02.jpg' alt='Page'/>
              </span>
              Next —
            </a>

            <div>
              <div className='product-gallery'>
                <ul className='product-gallery-preview'>
                  <li id='preview01' className='current'>
                    <div className='fullpage-slide' style={slideStyle}></div>
                  </li>
                  <li id='preview02'>
                    <div className='fullpage-slide' style={slideStyle}></div>
                  </li>
                  <li id='preview03'>
                    <div className='fullpage-slide' style={slideStyle}></div>
                  </li>
                </ul>

                <ul className='product-gallery-thumblist'>
                  <li><a href='#preview01'>
                    <img src='img/shop/product-gallery/thumb01.jpg' alt='Product'/>
                  </a></li>
                  <li className='active'><a href='#preview02'>
                    <img src='img/shop/product-gallery/thumb02.jpg' alt='Product'/>
                  </a></li>
                  <li><a href='#preview03'>
                    <img src='img/shop/product-gallery/thumb03.jpg' alt='Product'/>
                  </a></li>
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className='fw-section padding-bottom-3x'>
          <div className='container-fluid'>
            <form id='product-form'>
              <Col sm={colLeft}>
                <div className='product-info padding-top-2x text-center'>
                  <h1 className='h2 space-bottom-half'>{this.state.product.name}</h1>
                  <div className='product-meta'>
                    <div className='product-sku'>
                      <strong>SKU: </strong>
                      <span>146950023</span>
                    </div>
                    <div className='product-category'>
                      <strong>Category: </strong>
                      <a href='#'>Single Origin</a>
                    </div>
                    <span className='product-rating text-warning'>
                      <i className='material-icons star'/>
                      <i className='material-icons star'/>
                      <i className='material-icons star'/>
                      <i className='material-icons star'/>
                      <i className='material-icons star_border'/>
                    </span>
                  </div>
                  <h2>${price}</h2>

                  <div className='text-gray' dangerouslySetInnerHTML={shortDescription}></div>
                  <div className='product-tools shop-item'>
                    <div className='count-input'>
                      <a className='incr-btn' data-action='decrease' href='#'>–</a>
                      <input className='quantity' type='text' defaultValue={1}/>
                      <a className='incr-btn' data-action='increase' href='#'>+</a>
                    </div>
                    <div className='form-element'>
                      <select className='form-control form-control-sm color-select'>
                        <option value='blue' data-image='preview02'>Blue</option>
                        <option value='creme' data-image='preview01'>Creme</option>
                        <option value='red' data-image='preview03'>Red</option>
                      </select>
                    </div>
                    <Button className='add-to-cart' onClick={this.onAddToCartClicked}>
                      <em>Add to Order</em>
                      <svg x='0px' y='0px' width='32px' height='32px' viewBox='0 0 32 32'>
                        <path strokeDasharray='19.79 19.79' strokeDashoffset='19.79' fill='none' stroke='#FFFFFF' strokeWidth={2} strokeLinecap='square' strokeMiterlimit={10}
                          d='M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11'
                        />
                      </svg>
                    </Button>

                    {!options !== false && (
                      <Button
                        style={{ width: '100%' }}
                        onClick={this.toggleOptions}
                        bsStyle='danger'>
                        <em><i className='fa fa-truck'/> Subscribe!</em>
                      </Button>
                    )}
                  </div>
                  <div className='product-share'>
                    <span>Share this product: </span>
                    <div className='social-bar'>
                      <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                        <i className='socicon-facebook'/>
                      </a>
                      <a href='#' className='sb-twitter' data-toggle='tooltip' data-placement='top' title='Twitter'>
                        <i className='socicon-twitter'/>
                      </a>
                      <a href='#' className='sb-instagram' data-toggle='tooltip' data-placement='top' title data-original-title='Instagram'>
                        <i className='socicon-instagram'/>
                      </a>
                    </div>
                  </div>
                </div>

              </Col>
              <Col sm={colRight}>
                {options !== false && (
                  <Row className='page-row-wrapper subscription-wrapper'>
                    <Col sm={12} className='subscription-component'>
                      <ProductBrowser
                        ref={(browser) => this.optionBrowser = browser}
                        activeStep='options'
                        displayTitle={false}
                        title={this.state.title}
                        price={this.state.itemPrice}
                        item={this.state.item}
                        displayProductFilter={false}
                        displayCategoryFilter={false}
                        displayTextFilter={false}
                        stepper={this.stepper}
                        steps={steps}
                        customRowComponent={ProductOptionRow}
                        results={options}
                        onItemClicked={this.optionClicked}
                        onFilterSelected={this.categoryFilterSelected}
                        onStepClicked={this.stepClicked}
                      />
                    </Col>
                  </Row>
                )}
              </Col>

              <div className='row product-section'>
                <div className='col-xs-12'>
                  <ProductDetail/>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    )
  }

  getShortDescription() {
    let product = this.state.product || null
    if (product !== null) {
      if (typeof this.state.product['meta_description'] === 'string') {
        const html = HtmlHelper.decodeHtmlSpecialChars(this.state.product['meta_description'])
        return { __html: html }
      }
    }

    return { __html: '' }
  }
}

export default CartContext(ProductComponent)
