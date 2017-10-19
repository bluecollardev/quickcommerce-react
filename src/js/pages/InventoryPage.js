import assign from 'object-assign'
import axios from 'axios' // Move me out! Just using in here for temp report processing

import React, { Component } from 'react'

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio } from 'react-bootstrap';

import DragDropContainer from '../components/cart/DragDropContainer.jsx'
import DragDropCartRow from '../components/cart/DragDropCartRow.jsx'
import CartDropTarget from '../components/cart/CartDropTarget.jsx'
import CartDragItem from '../components/cart/CartDragItem.jsx'
import CatalogRow from '../components/catalog/CatalogRow.jsx'
import ProductOptionRow from '../components/catalog/ProductOptionRow.jsx'

import Stepper from '../components/stepper/BrowserStepper.jsx'
import BrowserActions from '../actions/BrowserActions.jsx'
import BrowserStore from '../stores/BrowserStore.jsx'

import ProductActions from '../actions/ProductActions.jsx'
import ProductBrowser from '../components/browser/ProductBrowser.jsx'
import BrowserMenu from '../components/browser/BrowserMenu.jsx'
import NewAccountForm from '../components/account/NewAccountForm.jsx'
import EditAccountForm from '../components/account/EditAccountForm.jsx'
import CustomerProfile from '../components/customer/CustomerProfile.jsx'

import Cart from '../modules/Cart.jsx'
import InternalCartStore from '../modules/CartStore.jsx'

// Dirty global hack to maintain store instance until I refactor 
// this component to use context or switch from flux to redux
window.CartStore = (typeof window.CartStore === 'undefined') ? InternalCartStore : window.CartStore

let CartStore = window.CartStore

import CheckoutStore from '../stores/CheckoutStore.jsx' // Will need for totals and stuff
import ProductStore from '../stores/ProductStore.jsx' // Will need for totals and stuff
import SettingStore from '../stores/SettingStore.jsx'
import { bubble as MainMenu, fallDown as CustomerMenu } from 'react-burger-menu'

import Factory from '../factory/Factory.jsx'

import StringHelper from '../helpers/String.js'
import ArrayHelper from '../helpers/Array.js'
import JSONHelper from '../helpers/JSON.js'
import UrlHelper from '../helpers/URL.js'

let fluxFactory = new Factory()

let categories = [] // Empty init containers
let products = [] // Empty init containers

// Pre-configured step types
import CategoryStep from '../steps/Category.jsx'
import ProductStep from '../steps/Product.jsx'
import ProductOptionStep from '../steps/ProductOption.jsx'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import PurchaserComponent from '../components/PurchaserComponent.jsx'

// The actual shopping cart component itself (includes embedded ProductBrowser)
import RetailComponent from '../components/RetailComponent.jsx' // TODO: Might be a good idea later to wrap this

export default AuthenticatedComponent(class InventoryPage extends Component {
    constructor(props) {
        super(props)

        this.getSelection = this.getSelection.bind(this)
        this.hasItems = this.hasItems.bind(this)
        this.configureSteps = this.configureSteps.bind(this)
        this.onComplete = this.onComplete.bind(this)
        this.setStep = this.setStep.bind(this)
        this.continueShopping = this.continueShopping.bind(this)
        this.refresh = this.refresh.bind(this)
        this.showLoginForm = this.showLoginForm.bind(this)
        this.hideLoginForm = this.hideLoginForm.bind(this)
        this.onSaleComplete = this.onSaleComplete.bind(this)
        this.reset = this.reset.bind(this)
        this.categoryClicked = this.categoryClicked.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
        this.itemDropped = this.itemDropped.bind(this)
        this.stepClicked = this.stepClicked.bind(this)
        this.getTotal = this.getTotal.bind(this)
        this.categoryFilterSelected = this.categoryFilterSelected.bind(this)
        this.rowIterator = this.rowIterator.bind(this)

        // Subscribe to checkout block ui events
        CheckoutStore.on('block-ui', () => {
            this.setState({
                blockUi: true
            })
        })

        CheckoutStore.on('unblock-ui', () => {
            this.setState({
                blockUi: false
            })
        })

        //this.configureSteps = this.configureSteps.bind(this)

        // Store our stepper instance
        // Stepper maintains its own state and store
        this.stepper = new Stepper(this.configureSteps())
        this.stepper.start()

        let categoryData = []
        let productData = []

        for (var key in categories) {
            let item = categories[key]
            if (item.thumbnail) {
                item.id = key
                categoryData.push(item)
            }
        }

        for (var key in products) {
            let item = products[key]
            if (item.thumbnail) {
                item.id = key
                productData.push(item)
            }
        }

        this.state = {
            blockUi         : false,
            chooseQuantity  : false,
            data            : { categories: categoryData, products: productData },
            initialSelection : CartStore.getSelection(),
            canSubmit: false,
            createAccount: false,
            editAccount: false,
            showLogin: (typeof this.props.loggedIn !== 'undefined' && this.props.loggedIn === true) ? true : false,
            checkoutMode: 'pos', // [cart|pos]
            step: 'shop', // [shop|cart|checkout|shipping|confirm] Not finalized, subject to change!
            purchase: null,
            cart: 0,
            changeAmount: 0.00,
            cashAmount: 0.00,
            settings: {}
        }
    }
    
    componentDidMount() {        
        this.setState({
            showLogin: (typeof this.props.loggedIn !== 'undefined' && this.props.loggedIn === true) ? true : false,
            cart: (typeof this.props.location !== 'undefined' && this.props.location.pathname === '/checkout/cart') ? 1 : 0
        })
        
        let categoryId = null
        if (typeof this.props.match !== 'undefined' && 
            typeof this.props.match.params !== 'undefined' && 
            typeof this.props.match.params.cat !== 'undefined' && !isNaN(this.props.match.params.cat)) {
            console.log('load category id: ' + this.props.match.params.cat)
            categoryId = parseInt(this.props.match.params.cat)
            this.categoryClicked({
                category_id: categoryId
            })
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        let categoryId = null
        
        // Check props, otherwise this will run in a loop like forever
        if (this.props !== prevProps) {
            if (typeof this.props.match !== 'undefined' && 
                typeof this.props.match.params !== 'undefined' && 
                typeof this.props.match.params.cat !== 'undefined') {
                console.log('load category id: ' + this.props.match.params.cat)
                categoryId = parseInt(this.props.match.params.cat)
                this.categoryClicked({
                    category_id: categoryId
                })
            }
        }
    }
    
    getSelection() {
        return CartStore.getSelection()
    }
    
    hasItems() {
        let selection = CartStore.getSelection() || null
        return (selection instanceof Array && selection.length > 0)
    }
    
    configureSteps() {
        // An array of step functions
        return [{
            config: assign({}, CategoryStep, {
                stepId: 'shop',
                indicator: '1',
                title: 'Vehicle Types'
            }),
            before: (stepId, step) => {
                console.log('load category step...')
                return true
            },
            action: (step, data, done) => {
                // Store the selection
                //this.stepper.addItem(item, quantity, data)
                
                BrowserActions.loadCategories()

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
                title: 'Vehicle Selection'
            }),
            before: (stepId, step) => {
                console.log('load product step...')
                return true
            },
            action: (step, data, done) => {
                data = data || null
                // Store the selection
                //this.stepper.addItem(item, quantity, data)
                
                if (data !== null &&
                    data.hasOwnProperty('category_id') &&
                    !Number.isNaN(data.category_id)) {

                    BrowserActions.loadProducts(data.category_id) // TODO: CONST for prop name?
                } else {
                    BrowserActions.loadProducts()
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
                title: 'Customize Options'
            }),
            before: (stepId, step) => {
                console.log('load option step...')
                return true
            },
            action: (step, data, done) => {
                data = data || null
                // Store the selection
                
                if (data !== null &&
                    data.hasOwnProperty('id') &&
                    !Number.isNaN(data.id)) {

                    BrowserActions.loadOptions(data) // TODO: CONST for prop name?
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
        },
        {
            config: {
                stepId: 'checkout',
                indicator: '4',
                title: 'Review'
            },
            // 'action' must be defined, even if empty
            action: (step, data, done) => {
            }
        },
        /*{
            config: {
                stepId: 'confirm',
                indicator: '5',
                title: 'Confirm Order'
            },
            // 'action' must be defined, even if empty
            action: (step, data, done) => {
            }
        }*/]
    }
    
    onComplete() {
        var doCheckout = true,
            product = null,
            date = null

        // TODO: Cart only if product is not free display
        var productConfig = BrowserStore.product,
            productOptions = productConfig.option,
            cartProduct = {
                product_id: productConfig.product_id
            }

        if (typeof productOptions !== 'undefined') {
            cartProduct.option = {}
            productOptions.forEach(function (value, key) {
                console.log(key)
                console.log(value)
                if (value instanceof Date) {
                    // I hate JavaScript dates - really could use moment.js here...
                    cartProduct.option[key.replace('product_option_', '')] = date = [value.getFullYear(), parseInt(value.getMonth() + 1), value.getDate()].join('-')
                } else {
                    // TODO: Support multiple checkbox/select options
                    cartProduct.option[key.replace('product_option_', '')] = [value]
                }
            })
        }
    }
    
    setStep(step) {
        //this.props.stepper.setStep(this.props.stepper.getIndex(arguments[0]))

        this.setState({ step: step })
    }
    
    continueShopping() {
        this.setStep('shop')
        
        window.location.hash = '/category'
    }
    
    refresh() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart

        this.setState({ canSubmit : !cart.isEmpty() })
    }
    
    showLoginForm() {
        this.setState({ showLogin: true })
    }
    
    hideLoginForm() {
        this.setState({ showLogin: false })
    }
    
    onSaleComplete() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.clearCart()

        // Make sure all modals are closed
        // Set state directly to avoid triggering any actions or processes associated with the show/hide modal methods
        this.setState({
            complete: null,
            charge: null
        })

        let stepId = 'shop'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = {}
            let isEnded = false

            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
    }
    
    reset() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.emptyCart()

        let stepId = 'shop'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (typeof stepDescriptor !== null) {
            let data = {}
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
    }
    
    categoryClicked(item) {
        let stepId = 'cart'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = item
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
    }
    
    itemClicked(item) {
        let stepId = 'options'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = item
            let isEnded = false
            
            if (item.hasOwnProperty('options') && item.options instanceof Array) {
                if (item.options.length > 0) {
                    // Execute the step handler
                    this.stepper.load(stepDescriptor, data, isEnded)

                    // Update our component state
                    this.setStep(stepId)
                    
                    return
                }
            }
            
            //let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
            //cart.addItem(item.id, 1, item)
            
            // Add to product browser
        }
    }
    
    optionClicked(item) {
        /*let stepId = 'checkout'
        let instance = this.stepper.getStepById(stepId)

        if (typeof instance !== 'undefined' && instance !== 'null') {
            let data = item
            let isEnded = false

            // Execute the step handler
            instance.execute(data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }*/
        
        console.log('option clicked')
        console.log(item)

        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.addOption(item['product_option_value_id'], 1, item)
    }
    
    itemDropped(item) {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.addItem(item, 1, products[item])
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
                if (this.stepper.load(stepDescriptor, data, isEnded)) {
                    // Update our component state
                    this.setStep(stepProps.stepId)                    
                }
                
            }
        }
    }
    
    getTotal() {
        let total = 0

        if (typeof this.refs.cart !== 'undefined' && this.refs.cart !== null) {
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        }

        return total
    }
    
    categoryFilterSelected(categoryId, e) {
        categoryId = (!Number.isNaN(parseInt(categoryId))) ? parseInt(categoryId) : null // Ensure conversion

        let stepId = 'cart'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = {
                category_id: categoryId
            }

            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
    }
    
    rowIterator(context, row) {
        if (!context) {
            return {
                total : 0
            }
        } else {
            const price = Number(row.data['price'])
            return {
                total : Number(context.total) + Number(row.quantity) * price
            }
        }
    }

    render() {
        let steps = this.stepper.getSteps() // Stepper extends store, we're good

        let options = false
        // TODO: This is wrong, should be checking ID or something
        if (this.state.hasOwnProperty('product') && this.state.product !== null && this.state.product.hasOwnProperty('price')) {
            let price = (parseFloat(this.state.product.price)).toFixed(2)
            if (typeof this.state.product.options !== 'undefined' && 
            this.state.product.options instanceof Array && 
            this.state.product.options.length > 0) {
               options = this.state.product.options
            }
        }

        return (
            <div className='cart-ui'>
                <Tabs activeKey={this.state.step} id='dev-tabs'>
                    <Tab eventKey={'shop'} title='Browser'>
                        <Row>
                            <Col sm={12}>
                                <BlockUi tag='div' blocking={this.state.blockUi}>
                                    <ProductBrowser
                                        activeStep = 'shop'
                                        displayProductFilter = {false}
                                        displayCategoryFilter = {false}
                                        stepper = {this.stepper}
                                        steps = {steps}
                                        customRowComponent = {CatalogRow}
                                        results = {this.state.data.categories}
                                        fluxFactory = {fluxFactory}
                                        onItemClicked = {this.categoryClicked}
                                        onFilterSelected = {this.categoryFilterSelected}
                                        onStepClicked = {this.stepClicked}
                                        />
                                </BlockUi>
                            </Col>
                        </Row>
                    </Tab>
                    
                    <Tab eventKey={'cart'} title='Cart'>
                        <Row>
                            <Col sm={12}>
                                <BlockUi tag='div' blocking={this.state.blockUi}>
                                    <ProductBrowser
                                        activeStep = 'cart'
                                        displayProductFilter = {false}
                                        displayCategoryFilter = {true}
                                        stepper = {this.stepper}
                                        steps = {steps}
                                        customRowComponent = {CatalogRow}
                                        results = {this.state.data.products}
                                        fluxFactory = {fluxFactory}
                                        onItemClicked = {this.itemClicked}
                                        onFilterSelected = {this.categoryFilterSelected}
                                        onStepClicked = {this.stepClicked}
                                        />
                                </BlockUi>
                            </Col>
                        </Row>
                    </Tab>

                    <Tab eventKey={'options'} title='Options'>
                        <Row>
                            <Col sm={12}>
                                <BlockUi tag='div' blocking={this.state.blockUi}>
                                    <ProductBrowser
                                        activeStep = 'options'
                                        title = ''
                                        displayProductFilter = {false}
                                        displayCategoryFilter = {true}
                                        stepper = {this.stepper}
                                        steps = {steps}
                                        customRowComponent = {ProductOptionRow}
                                        results = {this.state.data.options}
                                        fluxFactory = {fluxFactory}
                                        onItemClicked = {this.optionClicked}
                                        onFilterSelected = {this.categoryFilterSelected}
                                        onStepClicked = {this.stepClicked}
                                        />
                                </BlockUi>
                            </Col>
                        </Row>
                    </Tab>
                    
                    {/* This tab is a master component for previous product selection tabs */}
                    <Tab eventKey={'product'} title='Product Details'>
                        <Row>
                            <Col sm={12} lg={8}>
                                <BlockUi tag='div' blocking={this.state.blockUi}>
                                    <ProductBrowser
                                        displayProductFilter = {false}
                                        displayCategoryFilter = {false}
                                        stepper = {this.stepper}
                                        steps = {steps}
                                        activeStep = {this.state.step}
                                        customRowComponent = {CatalogRow}
                                        results = {this.state.data.options}
                                        fluxFactory = {fluxFactory}
                                        onItemClicked = {this.optionClicked}
                                        onFilterSelected = {this.categoryFilterSelected}
                                        onStepClicked = {this.stepClicked}
                                        />
                                </BlockUi>
                            </Col>
                            <Col sm={12} lg={4} className='checkout' style={{
                                    zIndex        : '10',
                                    overflow      : 'auto'
                                }}>
                                <Grid>
                                    {/*this.state.checkoutMode === 'pos' && (
                                    <div className='order-parts'>
                                        <Title>Order Summary</Title>
                                    </div>
                                    )*/}
                                    <Row className='checkout-parts'>
                                        <Col xs={12}>
                                            <div>
                                                <Cart
                                                  ref                     = 'cart'
                                                  tableClassName          = 'table cart'
                                                  onChange                = {this.refresh}
                                                  columns                 = {['price']}
                                                  iterator                = {this.rowIterator}
                                                  containerComponent      = {DragDropContainer}
                                                  rowComponent            = {DragDropCartRow}
                                                  onItemDropped           = {this.itemDropped} />
                                            </div>
                                        </Col>
                                        <Col className='cart-buttons' md={12}>
                                            <Button
                                              onClick   =   {this.emptyCart}
                                              style     =   {{
                                                  width: '100%',
                                                  marginTop: '2rem'
                                              }}
                                              className =   'hidden-xs hidden-sm hidden-md'
                                              onClick   =   {this.reload}
                                              bsStyle   =   'default'>
                                                <h4><i className='fa fa-refresh' /> Reset</h4>
                                            </Button>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Col>
                        </Row>
                    </Tab>
                    
                </Tabs>
            </div>
        )
    }
})