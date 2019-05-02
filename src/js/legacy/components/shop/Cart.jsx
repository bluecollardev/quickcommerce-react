import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { DragDropContext } from 'react-dnd'
import { HashRouter, Switch, Route } from 'react-router-dom'
import HTML5Backend from 'react-dnd-html5-backend'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

/* Generic imports */
import SiteLogo from 'quickcommerce-react/components/common/SiteLogo.jsx'
import LanguageSwitcher from 'quickcommerce-react/components/common/LanguageSwitcher.jsx'
import Toolbar from 'quickcommerce-react/components/common/Toolbar.jsx'
import Hero from 'quickcommerce-react/components/shop/Hero.jsx'
import GalleryFullwidthWithGap from 'quickcommerce-react/components/gallery/GalleryFullwidthWithGap.jsx'
import GalleryFullwidthNoGap from 'quickcommerce-react/components/gallery/GalleryFullwidthNoGap.jsx'
import GalleryBoxedWithGap from 'quickcommerce-react/components/gallery/GalleryBoxedWithGap.jsx'
import GalleryBoxedNoGap from 'quickcommerce-react/components/gallery/GalleryBoxedNoGap.jsx'
import Categories from 'quickcommerce-react/components/shop/Categories.jsx'
import Menu from 'quickcommerce-react/components/shop/Menu.jsx'
import Products from 'quickcommerce-react/components/shop/Products.jsx'
import Brands from 'quickcommerce-react/components/shop/Brands.jsx'
import Features from 'quickcommerce-react/components/shop/Features.jsx'

/* Site specific imports */
import PagePreloader from 'quickcommerce-react/components/common/PagePreloader.jsx'
import Footer from '../../js/Footer.jsx'
//import MainContent from '../../js/components/Product.jsx'
import MainContent from '../../js/components/Home.jsx'

import { PosComponent } from 'quickcommerce-react/components/PosComponent.jsx'

/* Copied from PosCompoent */
import DragDropContainer from 'quickcommerce-react/components/cart/DragDropContainer.jsx'
import DragDropCartRow from 'quickcommerce-react/components/cart/DragDropCartRow.jsx'
import CartDropTarget from 'quickcommerce-react/components/cart/CartDropTarget.jsx'
import CartDragItem from 'quickcommerce-react/components/cart/CartDragItem.jsx'
import CatalogRow from 'quickcommerce-react/components/catalog/CatalogRow.jsx'
import CategoryRow1x from 'quickcommerce-react/components/catalog/CategoryRow1x.jsx'
import CategoryRow3x from 'quickcommerce-react/components/catalog/CategoryRow3x.jsx'
import CategoryRow4x from 'quickcommerce-react/components/catalog/CategoryRow4x.jsx'
import CategoryRow5x from 'quickcommerce-react/components/catalog/CategoryRow5x.jsx'
import CategoryRow6x from 'quickcommerce-react/components/catalog/CategoryRow6x.jsx'

/* Override */
import ProductRow from '../../js/components/catalog/ProductRow.jsx'
import ProductRow1x from '../../js/components/catalog/ProductRow1x.jsx'
import TextMenuRow from 'quickcommerce-react/components/catalog/TextMenuRow.jsx'
import TextMenuRow1x from 'quickcommerce-react/components/catalog/TextMenuRow1x.jsx'
import ProductOptionRow from 'quickcommerce-react/components/catalog/ProductOptionRow.jsx'

import Stepper from 'quickcommerce-react/components/stepper/BrowserStepper.jsx'
//import BrowserActions from 'quickcommerce-react/actions/BrowserActions.jsx'
import BrowserStore from 'quickcommerce-react/stores/BrowserStore.jsx'

import CheckoutActions from 'quickcommerce-react/actions/CheckoutActions.jsx'

import CustomerActions from 'quickcommerce-react/actions/CustomerActions.jsx'

import ProductActions from 'quickcommerce-react/actions/ProductActions.jsx'
import ProductBrowser from 'quickcommerce-react/components/browser/ProductBrowser.jsx'
import BrowserMenu from 'quickcommerce-react/components/browser/BrowserMenu.jsx'

import CustomerPicker from 'quickcommerce-react/components/customer/CustomerPicker.jsx'
import SignInForm from 'quickcommerce-react/components/account/SignInForm.jsx'
import CreditCardForm from 'quickcommerce-react/components/payment/CreditCardForm.jsx'
import CustomerProfile from 'quickcommerce-react/components/customer/AuthenticatedCustomerProfile.jsx'

import Keypad from 'quickcommerce-react/components/common/Keypad.jsx'
import Notes from 'quickcommerce-react/components/common/Notes.jsx'

import QcCart from 'quickcommerce-react/modules/Cart.jsx' // Import as alias

import { bubble as MainMenu, fallDown as CustomerMenu } from 'react-burger-menu'

import Factory from 'quickcommerce-react/factory/Factory.jsx'

import StringHelper from 'quickcommerce-react/helpers/String.js'
import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
import JSONHelper from 'quickcommerce-react/helpers/JSON.js'
import UrlHelper from 'quickcommerce-react/helpers/URL.js'

let fluxFactory = new Factory()

let categories = [] // Empty init containers
let products = [] // Empty init containers

// Pre-configured step types
import CategoryStep from 'quickcommerce-react/steps/Category.jsx'
import ProductStep from 'quickcommerce-react/steps/Product.jsx'
import ProductOptionStep from 'quickcommerce-react/steps/ProductOption.jsx'

import ProductDetail from 'quickcommerce-react/components/catalog/ProductDetail.jsx'

export default class Cart extends Component {    
    constructor(props) {
        super(props)
        
        this.configureSteps = this.configureSteps.bind(this)
        this.setStep = this.setStep.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.addToCartClicked = this.addToCartClicked.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
        this.stepClicked = this.stepClicked.bind(this)
        
        // Store our stepper instance
        // Stepper maintains its own state and store
        this.stepper = new Stepper()
        
        // From PosComponent
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
            canSubmit: false,
            createAccount: false,
            editAccount: false,
            showLogin: (typeof this.props.loggedIn !== 'undefined' && this.props.loggedIn === true) ? true : false,
            checkoutMode: 'pos', // [cart|pos]
            step: 'shop', // [shop|cart|checkout|shipping|confirm] Not finalized, subject to change!
            title: '', // [shop|cart|checkout|shipping|confirm] Not finalized, subject to change!
            purchase: null,
            cart: 0,
            changeAmount: 0.00,
            cashAmount: 0.00,
            paymentMethod: 'In Store', // TODO: Don't hardcode
            paymentCode: 'in_store', // TODO: Don't hardcode
            customPaymentAmount: null,
            settings: {}
        }
        
        /*this.stepper.on('item-added', (item, quantity, oldQuantity) => {
            console.log('browser item added, add it to our cart')
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
            console.log(item)
            //cart.addItem(item['product_option_value_id'], 1, item, product)
        })
        
        this.stepper.on('item-changed', (item, quantity, oldQuantity) => {
            console.log('browser item changed, update the item in our cart')
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
            console.log(item)
            //cart.updateItem(item['product_option_value_id'], 1, item, product)
        })*/
    }
    
    componentDidMount() {
        /*let orderButton = document.getElementById('cart-button')
        console.log('order button')
        console.log(orderButton)
        
        orderButton.addEventListener('click', (e) => {
            e.preventDefault()
            
            let scrollDuration = 666
            let scrollStep = -window.scrollY / (scrollDuration / 15),
                scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep)
                } else clearInterval(scrollInterval)
            }, 15)
            
            this.setState({
                cart: 1
            })
        })*/
        
        //let settings = this.props.settingStore.getSettings().posSettings
    }
    
    configureSteps() {
        // An array of step functions
        return [
        /*{
            config: {
                stepId: 'checkout',
                indicator: '4',
                title: 'Review Your Order'
            },
            // 'action' must be defined, even if empty
            action: (step, data, done) => {
            }
        },*/
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
    
    setStep(stepId, stepDescriptor, data) {
        /*data = data || null
        let title = (data !== null && data.hasOwnProperty('name')) ? data.name : ''
        let price = (data !== null && data.hasOwnProperty('price') && !isNaN(data.price)) ? Number(data.price).toFixed(2) : 0.00
        
        this.setState({ 
            step: stepId,
            title: title,
            itemPrice: price,
            item: data
        })*/
    }
    
    stepClicked(stepProps) {
        // Get the BrowserStepDescriptor instance by stepId (shop|cart|checkout|etc).
        // We can't get it by index because the Step argument for this method is the config prop
        // provided to the Step component, not an instance of BrowserStepDescriptor.
        // Maybe I'll change this later...
        /*if (this.stepper.getSteps() instanceof Array) {            
            let stepDescriptor = this.stepper.getStepById(stepProps.stepId) || null

            if (stepDescriptor !== null) {
                let data = {}
                let isEnded = false
                // Execute the step handler
                this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepProps.stepId))
                
            }
        }*/
    }
  
    itemClicked(e, item) {
        e.preventDefault()
        e.stopPropagation()
        
        // If the Quick Add button was clicked
        if (e.target.type === 'button') {
            this.addToCartClicked(e, item)
            
            return
        }
        
        this.props.actions.product.setProduct(item)
        
        window.location.hash = '#/product'
        
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
    
    addToCart(e) {
        e.preventDefault()
        e.stopPropagation()
        
        let quantity = 0
        
        if (this.state.chooseQuantity) {
            // If the keypad popup modal is open, use its value
            quantity = parseFloat(this.popupKeypad.getForm().value)
        } else {
            quantity = parseFloat(this.keypad.getForm().value)
        }
        
        if (!isNaN(quantity) && quantity > 0) {
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
            let item = this.stepper.getItem(0) // Hardcoded to zero indexed item, should be fine because we explicitly clear the stepper selection
            
            //alert('Adding ' + quantity + 'x ' + item.data.name + '(s) to the order.')
            cart.addItem(item.id, quantity, item)
            this.keypad.component.clear()
            
            this.stepper.start()
            
            let settings = this.props.settingStore.getSettings().posSettings
            if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
                console.log('pinned category, auto select category : ' + settings['pinned_category'])
                this.categoryClicked(null, {
                    category_id: settings['pinned_category_id']
                })
            } else {
                this.setStep('shop')
            }
        } else {
            alert('Please enter the desired quantity.')
        }
    }
    
    quickAddToCart(e) {
        this.addToCart(e) // Add to cart
        this.popupKeypad.component.clear()
        
        // Close quantity keypad popup modal
        this.setState({
            chooseQuantity: false
        })
    }
    
    addToCartClicked(e, item) {
        e.preventDefault()
        e.stopPropagation()
        
        /*let stepId = 'options'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = item
            
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
            this.stepper.addItem(item.id, 1, item)
        }*/
        
        this.stepper.addItem(item.id, 0, item) // Don't set a quantity just register the item
        
        this.setState({
            chooseQuantity: true
        })
    }
    
    render() {
        //let steps = this.stepper.getSteps() // Stepper extends store, we're good
        
        return (
            <main className="content-wrapper">{/* Main Content Wrapper */}
                {/* Container */}
                <section className="container padding-top-3x padding-bottom">
                  <h1 className="space-top-half">Shopping Cart</h1>
                  <div className="row padding-top">
                    {/* Cart */}
                    <div className="col-sm-8 padding-bottom-2x">
                        <p className="text-sm">
                        <span className="text-gray">Currently</span> 3 items
                        <span className="text-gray"> in cart</span>
                        </p>
                        <div className="shopping-cart">
                        {/* Item */}
                        <div className="item">
                          <a href="shop-single.html" className="item-thumb">
                            <img src="img/cart/item01.jpg" alt="Item" />
                          </a>
                          <div className="item-details">
                            <h3 className="item-title"><a href="shop-single.html">Concrete Lamp</a></h3>
                            <h4 className="item-price">$85.90</h4>
                            <div className="count-input">
                              <a className="incr-btn" data-action="decrease" href="#">–</a>
                              <input className="quantity" type="text" defaultValue={1} />
                              <a className="incr-btn" data-action="increase" href="#">+</a>
                            </div>
                          </div>
                          <a href="#" className="item-remove" data-toggle="tooltip" data-placement="top" title="Remove">
                            <i className="material-icons remove_shopping_cart" />
                          </a>
                        </div>{/* .item */}
                        {/* Item */}
                        <div className="item">
                          <a href="shop-single.html" className="item-thumb">
                            <img src="img/cart/item02.jpg" alt="Item" />
                          </a>
                          <div className="item-details">
                            <h3 className="item-title"><a href="shop-single.html">Resin Storage Box</a></h3>
                            <h4 className="item-price">$38.00</h4>
                            <div className="count-input">
                              <a className="incr-btn" data-action="decrease" href="#">–</a>
                              <input className="quantity" type="text" defaultValue={2} />
                              <a className="incr-btn" data-action="increase" href="#">+</a>
                            </div>
                          </div>
                          <a href="#" className="item-remove" data-toggle="tooltip" data-placement="top" title="Remove">
                            <i className="material-icons remove_shopping_cart" />
                          </a>
                        </div>{/* .item */}
                        {/* Item */}
                        <div className="item">
                          <a href="shop-single.html" className="item-thumb">
                            <img src="img/cart/item03.jpg" alt="Item" />
                          </a>
                          <div className="item-details">
                            <h3 className="item-title"><a href="shop-single.html">Ceramic Watch</a></h3>
                            <h4 className="item-price">$299.00</h4>
                            <div className="count-input">
                              <a className="incr-btn" data-action="decrease" href="#">–</a>
                              <input className="quantity" type="text" defaultValue={1} />
                              <a className="incr-btn" data-action="increase" href="#">+</a>
                            </div>
                          </div>
                          <a href="#" className="item-remove" data-toggle="tooltip" data-placement="top" title="Remove">
                            <i className="material-icons remove_shopping_cart" />
                          </a>
                        </div>{/* .item */}
                        </div>{/* .shopping-cart */}
                        {/* Coupon */}
                        <div className>
                        <p className="text-gray text-sm">Have discount coupon?</p>
                        <form method="post" className="row">
                          <div className="col-md-8 col-sm-7">
                            <div className="form-element">
                              <input type="text" className="form-control" placeholder="Enter coupon" required />
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-5">
                            <button type="submit" className="btn btn-default btn-ghost btn-block space-top-none space-bottom">Apply Coupon</button>
                          </div>
                        </form>
                        </div>
                        <Row className='checkout-parts'>
                            <Col xs={12}>
                                <div>
                                    <QcCart
                                        ref = 'cart'
                                        tableClassName = 'table cart'
                                        onChange = {this.refresh}
                                        columns = {['price']}
                                        iterator = {this.rowIterator}
                                        containerComponent = {DragDropContainer}
                                        rowComponent = {DragDropCartRow}
                                        onItemDropped = {this.itemDropped} />
                                </div>
                            </Col>
                            <Col className='cart-buttons' xs={12}>
                                {/*
                                <Button
                                  onClick = {this.showCodeModal}
                                  style = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  bsStyle = 'default'>
                                    <h4>Enter Code</h4>
                                </Button>
                                */}
                                
                                {/*this.state.canSubmit && (
                                <Button
                                  style = {{
                                      width: '100%'
                                      //marginTop: '2rem'
                                  }}
                                  onClick = {this.setStep.bind(this, 'checkout')}
                                  bsStyle = 'success'>
                                    <h4><i className='fa fa-shopping-cart' /> Check Out</h4>
                                </Button>
                                )*/}
                                
                                {/*this.state.step === 'cart' && (
                                <Button
                                  onClick = {this.showScanModal}
                                  style = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  className = 'hidden-xs hidden-sm'
                                  bsStyle = 'default'>
                                    <h4><i className='fa fa-barcode' /> Scan Item</h4>
                                </Button>
                                )*/}
                                
                                {this.state.canSubmit && (
                                <Button
                                  style = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  onClick = {this.showChargeModal}
                                  bsStyle = 'success'>
                                    <h4><i className='fa fa-money' /> Charge</h4>
                                </Button>
                                )}

                                {this.state.canSubmit && (
                                <Button
                                  style = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  className = 'pull-right'
                                  onClick = {this.reset}
                                  bsStyle = 'danger'>
                                    <h4><i className='fa fa-times' /> Empty</h4>
                                </Button>
                                )}

                                {this.state.canSubmit && (
                                <Button
                                  onClick = {this.emptyCart}
                                  style = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  className = 'hidden-xs hidden-sm hidden-md'
                                  onClick = {this.reload}
                                  bsStyle = 'default'>
                                    <h4><i className='fa fa-refresh' /> Reset</h4>
                                </Button>
                                )}

                                {/*this.state.canSubmit && (
                                <Button
                                  style =   {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  onClick = {this.setStep.bind(this, 'shop')}
                                  bsStyle = 'default'>
                                    <h4><i className='fa fa-clipboard' /> Change Order</h4>
                                </Button>
                                )*/}

                                {/*this.state.step !== 'cart' && (
                                <Button
                                  style = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  onClick = {this.setStep.bind(this, 'shop')}
                                  bsStyle = 'default'>
                                    <h4><i className='fa fa-shopping-cart' /> Continue Shopping</h4>
                                </Button>
                                )*/}
                                
                                {/*<Row>
                                    <Col xs={12} md={6}>
                                        <Button
                                          block
                                          style = {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick = {this.openDrawer}
                                          bsStyle = 'default'>
                                            <h4><i className='fa fa-external-link-square' /> Open Drawer</h4>
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Button
                                          block
                                          style = {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick = {this.printReport}
                                          bsStyle = 'default'>
                                            <h4><i className='fa fa-print' /> End of Day</h4>
                                        </Button>
                                    </Col>
                                </Row>*/}                               
                            </Col>
                        </Row>
                    </div>{/* .col-sm-8 */}
                    {/* Sidebar */}
                    <div className="col-md-3 col-md-offset-1 col-sm-4 padding-bottom-2x">
                      <aside>
                        <h3 className="toolbar-title">Cart subtotal:</h3>
                        <h4 className="amount">$460.90</h4>
                        <p className="text-sm text-gray">* Note: This amount does not include costs for international shipping. You will be able to calculate shipping costs on checkout.</p>
                        <a href="#/" className="btn btn-default btn-block waves-effect waves-light">Update Cart</a>
                        <a href="#/checkout" className="btn btn-primary btn-block waves-effect waves-light space-top-none">Checkout</a>
                      </aside>
                    </div>{/* .col-md-3.col-sm-4 */}
                  </div>{/* .row */}
                </section>{/* .container */}
            </main>
        )
    }
}