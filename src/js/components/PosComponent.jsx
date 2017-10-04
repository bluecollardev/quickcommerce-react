import assign from 'object-assign'
import axios from 'axios' // Move me out! Just using in here for temp report processing

import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Header from 'grommet/components/Header'
import Title from 'grommet/components/Title'
import Box from 'grommet/components/Box'
import Label from 'grommet/components/Label'
import Paragraph from 'grommet/components/Paragraph'
import NumberInput from 'grommet/components/NumberInput'

//import ArrayHelper from '../helpers/Array.js'
import ObjectHelper from '../helpers/Object.js'
//import StringHelper from '../helpers/String.js'

import AuthenticatedComponent from './AuthenticatedComponent.jsx'

import TopMenu from './menu/TopMenu.jsx'
import AccountMenu from './menu/AccountMenu.jsx'

import DragDropContainer from './cart/DragDropContainer.jsx'
import DragDropCartRow from './cart/DragDropCartRow.jsx'
import CartDropTarget from './cart/CartDropTarget.jsx'
import CartDragItem from './cart/CartDragItem.jsx'
import CatalogRow from './catalog/CatalogRow.jsx'
import ProductOptionRow from '../components/catalog/ProductOptionRow.jsx'

import Stepper from './stepper/BrowserStepper.jsx'
import BrowserActions from '../actions/BrowserActions.jsx'
import BrowserStore from '../stores/BrowserStore.jsx'

import CheckoutActions from '../actions/CheckoutActions.jsx'
import CheckoutService from '../services/CheckoutService.jsx'

import CustomerActions from '../actions/CustomerActions.jsx'
import CustomerService from '../services/CustomerService.jsx'

import SettingActions from '../actions/SettingActions.jsx'
import ProductActions from '../actions/ProductActions.jsx'
import ProductBrowser from './browser/ProductBrowser.jsx'
import BrowserMenu from './browser/BrowserMenu.jsx'
import CustomerPicker from './customer/CustomerPicker.jsx'
import SignInForm from './account/SignInForm.jsx'
import CreditCardForm from './payment/CreditCardForm.jsx'
import CustomerProfile from './customer/AuthenticatedCustomerProfile.jsx'

import Keypad from './common/Keypad.jsx'
import Notes from './common/Notes.jsx'

import Cart from '../modules/Cart.jsx'
import InternalCartStore from '../modules/CartStore.jsx'

// Dirty global hack to maintain store instance until I refactor 
// this component to use context or switch from flux to redux
window.CartStore = (typeof window.CartStore === 'undefined') ? InternalCartStore : window.CartStore

let CartStore = window.CartStore

import StarMicronicsStore from '../stores/StarMicronicsStore.jsx'
import CheckoutStore from '../stores/CheckoutStore.jsx' // Will need for totals and stuff
import ProductStore from '../stores/ProductStore.jsx'
import SettingStore from '../stores/SettingStore.jsx'

import ToggleDisplay from 'react-toggle-display'
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

const CURRENCY = [
    { name: 'ONE HUNDRED', value: 100.00},
    { name: 'TWENTY', value: 20.00},
    { name: 'TEN', value: 10.00},
    { name: 'FIVE', value: 5.00},
    { name: 'ONE', value: 1.00},
    { name: 'QUARTER', value: 0.25},
    { name: 'DIME', value: 0.10},
    { name: 'NICKEL', value: 0.05},
    { name: 'PENNY', value: 0.01}
]

const CASH_IN_DRAWER = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.10],
    ['QUARTER', 4.25],
    ['ONE', 90.00],
    ['FIVE', 55.00],
    ['TEN', 20.00],
    ['TWENTY', 60.00],
    ['ONE HUNDRED', 100.00]
]

export default AuthenticatedComponent(class PosComponent extends Component {
    constructor(props) {
        super(props)
        
        this.getSelection = this.getSelection.bind(this)
        this.hasItems = this.hasItems.bind(this)
        this.configureSteps = this.configureSteps.bind(this)
        this.setStep = this.setStep.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.onComplete = this.onComplete.bind(this)
        this.updateNotes = this.updateNotes.bind(this)
        this.updatePaymentMethod = this.updatePaymentMethod.bind(this)
        this.updateShippingMethod = this.updateShippingMethod.bind(this)
        this.continueShopping = this.continueShopping.bind(this)
        this.refresh = this.refresh.bind(this)
        this.showNewCustomerForm = this.showNewCustomerForm.bind(this)
        this.hideNewCustomerForm = this.hideNewCustomerForm.bind(this)
        this.showEditCustomerForm = this.showEditCustomerForm.bind(this)
        this.hideEditCustomerForm = this.hideEditCustomerForm.bind(this)
        this.changeCustomer = this.changeCustomer.bind(this)
        this.showLoginForm = this.showLoginForm.bind(this)
        this.hideLoginForm = this.hideLoginForm.bind(this)
        this.showOrder = this.showOrder.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.showScanModal = this.showScanModal.bind(this)
        this.hideScanModal = this.hideScanModal.bind(this)
        this.showCodeModal = this.showCodeModal.bind(this)
        this.showChargeModal = this.showChargeModal.bind(this)
        this.hideChargeModal = this.hideChargeModal.bind(this)
        this.completeOrder = this.completeOrder.bind(this)
        this.showReceiptModal = this.showReceiptModal.bind(this)
        this.hideReceiptModal = this.hideReceiptModal.bind(this)
        this.printReceipt = this.printReceipt.bind(this)
        this.printOrder = this.printOrder.bind(this)
        this.printReport = this.printReport.bind(this)
        this.showCompleteModal = this.showCompleteModal.bind(this)
        this.hideCompleteModal = this.hideCompleteModal.bind(this)
        this.onSaleComplete = this.onSaleComplete.bind(this)
        this.reset = this.reset.bind(this)
        this.categoryClicked = this.categoryClicked.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
        this.itemDropped = this.itemDropped.bind(this)
        this.stepClicked = this.stepClicked.bind(this)
        this.selectPaymentMethod = this.selectPaymentMethod.bind(this)
        this.toggleCustomPaymentAmount = this.toggleCustomPaymentAmount.bind(this)
        this.getChangeAmounts = this.getChangeAmounts.bind(this)
        this.getTotal = this.getTotal.bind(this)
        this.categoryFilterSelected = this.categoryFilterSelected.bind(this)
        this.openDrawer = this.openDrawer.bind(this)
        this.calculateChange = this.calculateChange.bind(this)
        this.selectChangePreset = this.selectChangePreset.bind(this)
        this.renderOptions = this.renderOptions.bind(this)
        this.renderPlainTxtOptions = this.renderPlainTxtOptions.bind(this)
        this.renderCashOptions = this.renderCashOptions.bind(this)
        this.renderPaymentOptions = this.renderPaymentOptions.bind(this)
        this.renderEndOfDayReport = this.renderEndOfDayReport.bind(this)
        this.renderPlainTxtOrder = this.renderPlainTxtOrder.bind(this)
        this.renderPlainTxtReceipt = this.renderPlainTxtReceipt.bind(this)
        
        this.getDefaultSettings = this.getDefaultSettings.bind(this)
        
        SettingActions.fetchStore(8)
        
        SettingStore.on('store-info-loaded', (id, payload) => {
            CheckoutStore.stores[id] = payload
        }) // Load ACE bar store data so we don't have to later
        
        SettingActions.fetchSettings()
        
        SettingStore.on('settings-loaded', (payload) => {
            CheckoutStore.settings = payload

            // We only wanna do this once, so stick 'er right up top
           CheckoutService.createOrder({
                action: 'insert'
                //orderTaxRates: this.orderTaxRates
            })
        })
        
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
        
        CheckoutStore.on('set-customer', () => {
            console.log('checkout customer change detected')
            console.log(CustomerStore.customer)
            console.log(CustomerStore.billingAddress)
            console.log(CustomerStore.shippingAddress)
            
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                CheckoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (CheckoutStore.payload.hasOwnProperty('order') && 
                    CheckoutStore.payload.order !== null) {
                    // Do we update?
                    if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(CheckoutStore.payload.order.orderId) &&
                        CheckoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, assign({}, CheckoutStore.payload.order, {
                            action: 'update',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    } else {
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        CheckoutService.createOrder(assign({}, CheckoutStore.payload.order, {
                            action: 'insert',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                    }
                // Payload order doesn't exist, we're gonna have to create it
                } else {
                    // TODO: Fix me! I'm hardcoded
                    // Change country and zone to customer default address
                    CheckoutService.createOrder(assign({}, {
                        action: 'insert',
                        defaultSettings: this.getDefaultSettings()
                    }), (payload) => {
                        CheckoutStore.setOrder(payload)
                        //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                    })
                }
            }
        })

        CheckoutStore.on('set-order-status', () => {
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                CheckoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                    // Do we update?
                    if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(CheckoutStore.payload.order.orderId) &&
                        CheckoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, assign({}, CheckoutStore.payload.order, {
                            action: 'updateOrderStatus',
                            defaultSettings: this.getDefaultSettings(),
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })
        
        CheckoutStore.on('set-payment-method', () => {
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                CheckoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                    // Do we update?
                    if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(CheckoutStore.payload.order.orderId) &&
                        CheckoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, assign({}, CheckoutStore.payload.order, {
                            action: 'updatePaymentMethod',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })
        
        CheckoutStore.on('set-shipping-method', () => {
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                CheckoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                    // Do we update?
                    if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(CheckoutStore.payload.order.orderId) &&
                        CheckoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, assign({}, CheckoutStore.payload.order, {
                            action: 'updateShippingMethod',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })
        
        CheckoutStore.on('set-notes', () => {
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                CheckoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                    // Do we update?
                    if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(CheckoutStore.payload.order.orderId) &&
                        CheckoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, assign({}, CheckoutStore.payload.order, {
                            action: 'updateNotes',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })  
        
        /*CheckoutStore.on('set-order', () => {
            console.log('checkout change detected')
            console.log(CustomerStore.customer)
            console.log(CustomerStore.billingAddress)
            console.log(CustomerStore.shippingAddress)
            
            if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
                // Just handle, customer should be set to CheckoutStore
                CheckoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                    // Do we update?
                    if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(CheckoutStore.payload.order.orderId) &&
                        CheckoutStore.payload.order.orderId > 0) {
                        CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, assign({}, CheckoutStore.payload.order, {
                            action: 'update',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            CheckoutStore.setOrder(payload)
                            //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                        })
                    }
                }
            }
        })*/
        
        // We call this data because it's not a complete item, just a POJO
        CartStore.on('item-added', (itemId, quantity, data) => {
            console.log('item added to order')
            console.log(data)
            
            // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator
            if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(CheckoutStore.payload.order.orderId)) {
                    let lineTotal = data['price'] * quantity
                    let lineTotalWithTax = CheckoutStore.calculateWithTaxes(lineTotal, data['tax_class_id'])
                    let lineTax = CheckoutStore.calculateTaxes(lineTotal, data['tax_class_id'])

                    // We're mutating the supplied data object by design
                    let orderProduct = assign(data, {
                        product_id: parseInt(itemId),
                        quantity: quantity, // TODO: Inject quantity
                        total: lineTotal,
                        tax: lineTax
                    })

                    let orderTaxRates = CheckoutStore.getOrderTaxRates()
                    let orderOptions = CheckoutStore.getOrderOptions(parseInt(data['id']))

                    CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, {
                        action: 'insert',
                        orderProduct: orderProduct,
                        orderProductId: 0,
                        orderOptions: orderOptions, // TODO: If we fix the UI glitch (when tapping first option, item is created) we need to re-enable this
                        productId: parseInt(data['id']),
                        orderTaxRates: orderTaxRates,
                        defaultSettings: this.getDefaultSettings()
                    }, (payload) => {
                        let onSuccess = (payload) => {
                            // Format the return payload
                            /* Returned JSON payload
                            "orderProducts": [
                                {
                                    "orderProductId": 4,
                                    "orderId": 198,
                                    "productId": 3381,
                                    "name": "Ceni Subscription",
                                    "model": "Ceni Subscription",
                                    "quantity": 1,
                                    "price": "111.1100",
                                    "total": "111.1100",
                                    "tax": "5.5555",
                                    "reward": 0
                                }
                            ],
                            "orderOptions": [
                                {
                                    "orderOptionId": 2,
                                    "orderId": 198,
                                    "orderProductId": 4,
                                    "productOptionId": "249",
                                    "productOptionValueId": "514",
                                    "name": "Coffee Package Size",
                                    "value": "340g",
                                    "type": "select"
                                }
                            ]*/
                            
                            orderProducts.reduce((list, item, index) => {
                                
                            })
                            
                            // Update our CartStore
                            CartStore.updateItem()
                        }
                        
                        CheckoutStore.setOrder(payload)
                        //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId, onSuccess)
                    })
                } else {
                    // Create a new order
                }
            }
        })
        
        CartStore.on('item-changed', (item, quantity, oldQuantity) => {
            console.log('item quantity changed')
            console.log(item)
            console.log('qty: ' + quantity)
            console.log('old qty: ' + oldQuantity)
            
            // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator
            if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(CheckoutStore.payload.order.orderId)) {
                    let lineTotal = item['price'] * quantity
                    let lineTotalWithTax = CheckoutStore.calculateWithTaxes(lineTotal, item['tax_class_id'])
                    let lineTax = CheckoutStore.calculateTaxes(lineTotal, item['tax_class_id'])

                    let orderProductId = 0
                    for (let idx = 0; idx < CheckoutStore.payload.orderProducts.length; idx++) {
                        if (parseInt(CheckoutStore.payload.orderProducts[idx].productId) === parseInt(item['id'])) {
                            orderProductId = CheckoutStore.payload.orderProducts[idx].orderProductId
                        }
                    }
                    
                    let orderProduct = assign({}, item, {
                        product_id: parseInt(item['id']),
                        quantity: quantity, // TODO: Inject quantity
                        total: lineTotal,
                        tax: lineTax
                    })

                    let orderTaxRates = CheckoutStore.getOrderTaxRates()
                    //let orderOptions = CheckoutStore.getOrderOptions()

                    CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, {
                        action: 'modifyQuantity',
                        orderProduct: orderProduct,
                        orderProductId: orderProductId,
                        //orderOptions: orderOptions,
                        quantityBefore: oldQuantity,
                        quantityAfter: quantity,
                        orderTaxRates: orderTaxRates
                    }, (payload) => {
                        CheckoutStore.setOrder(payload)
                        //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                    })
                }
            }
        })
        
        CartStore.on('product-options-changed', (item, quantity, product) => {
            console.log('product options changed')
            console.log(item)
            console.log('qty: ' + quantity)

            if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(CheckoutStore.payload.order.orderId)) {
                    let lineTotal = item['price'] * quantity
                    let lineTotalWithTax = CheckoutStore.calculateWithTaxes(lineTotal, item['tax_class_id'])
                    let lineTax = CheckoutStore.calculateTaxes(lineTotal, item['tax_class_id'])
                    
                    let orderProductId = 0
                    // Grab associated orderProduct
                    let orderProduct = CheckoutStore.payload.orderProducts.filter(orderProduct => {
                        return orderProduct.productId === parseInt(product['id'])
                    })
                    
                    if (orderProduct instanceof Array && orderProduct.length === 1) {
                        orderProductId = orderProduct[0].orderProductId
                    }

                    /*let orderProduct = assign({}, item, {
                        product_id: parseInt(item['id']),
                        quantity: quantity, // TODO: Inject quantity
                        total: lineTotal,
                        tax: lineTax
                    })*/
                    
                    // TODO: Promises would probably work better here
                    let orderTaxRates = CheckoutStore.getOrderTaxRates()
                    let orderOptions = CheckoutStore.getOrderOptions(parseInt(product['id']), orderProductId)

                    CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, {
                        action: 'update',
                        //orderProduct: orderProduct,
                        orderProductId: orderProductId,
                        orderOptions: orderOptions,
                        //quantityBefore: oldQuantity,
                        //quantityAfter: quantity,
                        orderTaxRates: orderTaxRates,
                        defaultSettings: this.getDefaultSettings()
                    }, (payload) => {
                        CheckoutStore.setOrder(payload)
                        //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('item-removed', (item) => {
            console.log('item removed')
            console.log(item)

            if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(CheckoutStore.payload.order.orderId)) {
                    let orderProductId = 0
                    for (let idx = 0; idx < CheckoutStore.payload.orderProducts.length; idx++) {
                        if (parseInt(CheckoutStore.payload.orderProducts[idx].productId) === parseInt(item['id'])) {
                            orderProductId = CheckoutStore.payload.orderProducts[idx].orderProductId
                        }
                    }

                    let data = assign({}, item, {
                        product_id: parseInt(item['id']),
                        quantity: 0
                    })

                    let orderTaxRates = CheckoutStore.getOrderTaxRates()
                    //let orderOptions = CheckoutStore.getOrderOptions()

                    CheckoutService.updateOrder(CheckoutStore.payload.order.orderId, {
                        action: 'modifyQuantity',
                        orderProduct: data,
                        orderProductId: orderProductId,
                        quantityAfter: 0,
                        orderTaxRates: orderTaxRates,
                        //orderOptions: orderOptions
                    }, (payload) => {
                        CheckoutStore.setOrder(payload)
                        //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('cart-reset', () => {
            console.log('reset checkout store - cart was reset') // TODO: Have clear and reset, they aren't really the same thing

            CheckoutService.clearOrder()
        })

        CartStore.on('cart-cleared', () => {
            console.log('clearing checkout store - cart was checked-out') // TODO: Have clear and reset, they aren't really the same thing

            // Don't reset, which deletes order, just create a new order
            CheckoutService.createOrder({
                action: 'insert'
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
    }
    
    // TODO: Refactor me
    getDefaultSettings() {
        let customerId = 0
        if (CustomerStore.customer.hasOwnProperty('customer_id') && !isNaN(CustomerStore.customer['customer_id'])) {
            let storeCustomerId = parseInt(CustomerStore.customer['customer_id'])
            if (storeCustomerId > 0) {
                customerId = storeCustomerId
            }
        }
        
        return {
            config_country_id: 38, // Hard-code to Canada
            config_zone_id: 602, // Hard-code to Alberta
            config_customer_id: customerId,
            config_customer_type: (customerId > 0) ? 3 : 1,
            POS_a_country_id: CheckoutStore.payload.order.paymentCountryId,
            POS_a_zone_id: CheckoutStore.payload.order.paymentZoneId,
            POS_initial_status_id: 1,
            POS_c_id: customerId,
            POS_customer_group_id: 1,
            config_customer_group_id: 1,
            // Codes are for existing (3) / built-in (1) customer types, 2 indicates custom customer
            POS_c_type: (customerId > 0) ? 3 : 1
        }
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
                title: 'Choose Category'
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
                title: 'Choose Product'
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
                title: 'Customize Product'
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
    
    changeCustomer(item) {
        //CustomerService.setCustomer(item)
        CheckoutActions.setExistingCustomer({ customer: item })
    }
    
    updateNotes(notes) {
        this.setState({
            notes: notes
        }, () => {
            CheckoutStore.setNotes(notes)
        })
    }
    
    updatePaymentMethod(code, method) {
        CheckoutStore.setPaymentMethod(code, method)
    }
    
    updateShippingMethod(code, method) {
        CheckoutStore.setShippingMethod(code, method)
    }
    
    onComplete() {
        /*var doCheckout = true,
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
        }*/

        /*product = productDataSource.get(productConfig.get('product_id'))
        if (typeof product !== 'undefined') {
            // VESTHOOK
            if (page.hasOwnProperty('productRequiresCheckout')) {
                // Make sure the method exists first
                doCheckout = page.productRequiresCheckout(product)
            }
        } else {
            // TODO: Throw an error or something?
        }

        // TODO: Alter this in some way so it's reusable...
        if (!doCheckout) {
            doFreeDownload()
        }

        // TODO: WARNING: QUICK KIOSK FIX for PROOF OF CONCEPT ONLY
        // We need the ability to bypass checkout for testing
        doCheckout = false
        page.displayDownload()
        // END

        if (doCheckout) {
            doCheckout()
        }*/
    }
    
    onSaleComplete() {
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
        
        console.log('checkout change detected')
        console.log(CustomerStore.customer)
        console.log(CustomerStore.billingAddress)
        console.log(CustomerStore.shippingAddress)
        
        if (typeof CustomerStore.customer !== 'undefined' && CustomerStore.customer !== null) {
            // Just handle, customer should be set to CheckoutStore
            CheckoutStore.setExistingCustomer()
            
            // Payloard order exists
            if (CheckoutStore.payload.hasOwnProperty('order') && CheckoutStore.payload.order !== null) {
                // Do we update?
                if (CheckoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(CheckoutStore.payload.order.orderId) &&
                    CheckoutStore.payload.order.orderId > 0) {
                    // No orderId detected in the payload order, let's try create instead
                } else {
                    // TODO: Fix me! I'm hardcoded
                    CheckoutService.createOrder(assign({}, CheckoutStore.payload.order, {
                        action: 'insert',
                        defaultSettings: this.getDefaultSettings()
                    }), (payload) => {
                        CheckoutStore.setOrder(payload)
                        //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                    })
                }
            // Payload order doesn't exist, we're gonna have to create it
            } else {
                CheckoutService.createOrder(assign({}, {
                    action: 'insert',
                    defaultSettings: this.getDefaultSettings()
                }), (payload) => {
                    CheckoutStore.setOrder(payload)
                    //CheckoutService.fetchOrder(CheckoutStore.payload.order.orderId)
                })
            }
        }
    }
    
    continueShopping() {
        this.setStep('shop')
        
        window.location.hash = '/category'
    }
    
    showNewCustomerForm() {
        this.hideLoginForm()
        console.log('show new customer form')
        this.setState({ createAccount: true, editAccount: false })
    }
    
    hideNewCustomerForm() {
        this.showLoginForm()
        console.log('hide new customer form')
        this.setState({ createAccount: false })
    }
    
    showEditCustomerForm() {
        console.log('show edit customer form')
        this.hideLoginForm()
        this.setState({ editAccount: true, createAccount: false })
    }
    
    hideEditCustomerForm() {
        this.showLoginForm()
        console.log('hide edit customer form')
        this.setState({ editAccount: false })
    }
    
    showLoginForm() {
        this.setState({ showLogin: true })
    }
    
    hideLoginForm() {
        this.setState({ showLogin: false })
    }
    
    showOrder() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        this.setState({ purchase: cart.getSelection() })
    }
    
    hideModal() {
        this.setState({ purchase: null })
    }
    
    showScanModal() {
        this.setState({ scan: 1 })
    }
    
    hideScanModal() {
        this.setState({ scan: null })
    }
    
    showCodeModal() {
        this.setState({ code: 1 })
    }
    
    hideCodeModal() {
        this.setState({ code: null })
    }
    
    showChargeModal() {
        this.setState({ 
            charge: 1,
            checkout: {
                system: {
                    currency: CURRENCY,
                    drawer: CASH_IN_DRAWER
                },
                store: SettingStore.getStoreData(),
                order: CheckoutStore.getOrderDetails(),
                items: CartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                totals: CheckoutStore.getTotals(),
                total: CheckoutStore.getTotal()
            }
        })
    }
    
    hideChargeModal() {
        this.setState({ charge: null })
    }
    
    completeOrder() {
        // Grab the total, by completing the order we're gonna wipe out the totals
        let orderTotal = parseFloat(CheckoutStore.getTotal().value)
        // Create the order
        CheckoutService.doCheckout(
        (data) => {
            // onSuccess handler
            if (this.state.customPaymentAmount) {
                // Get amount
                let cashAmount = null
                if (typeof this.customPaymentAmount !== 'undefined' && 
                    this.customPaymentAmount !== null) {
                    cashAmount = parseFloat(this.customPaymentAmount.value)
                    
                    this.setState({
                        charge: null,
                        cashAmount: (cashAmount).toFixed(2),
                        changeAmount: (cashAmount - orderTotal).toFixed(2),
                        prevCheckout: assign({}, this.state.checkout)
                    }, () => {
                        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
                        cart.clearCart()
                        
                        this.checkoutNotes.component.clear()
                        
                        this.showCompleteModal()
                    })
                } else {
                    throw new Error('something went wrong with cash amount')
                    // TODO: This is a kind of a stupid error message I can handle this better
                }
            } else {
                this.setState({
                    charge: null,
                    prevCheckout: assign({}, this.state.checkout)
                }, () => {
                    let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
                    cart.clearCart()
                    
                    this.checkoutNotes.component.clear()
                    
                    this.showCompleteModal()
                })
            }
        },
        (data) => {
            // onError handler
            this.setState({ charge: null })
        })
    }
    
    showReceiptModal() {
        // Hide the current modal
        this.hideCompleteModal()

        // Trigger receipt display
        this.setState({ receipt: 1 })
    }
    
    hideReceiptModal() {
        // Hide the receipt
        this.setState({ receipt: null })

        this.showCompleteModal()
    }
    
    printReceipt() {
        // Send output as plain text string
        StarMicronicsStore.printReceipt(this.renderPlainTxtReceipt())
    }
    
    printOrder() {
        // Send output as plain text string
        StarMicronicsStore.printOrder(this.renderPlainTxtOrder())
    }
    
    printReport() {
        axios({
            url: QC_API + 'report/endofday',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        })
        .then(response => {
            let payload = response.data

            // Send output as plain text string
            StarMicronicsStore.printReport(this.renderEndOfDayReport(payload))

        }).catch(err => {
            // Do nothing
        })
    }
    
    showCompleteModal() {
        // Hide the charge modal, if for any reason it is visible
        this.setState({
            complete: 1,
            checkout: {
                system: {
                    currency: CURRENCY,
                    drawer: CASH_IN_DRAWER
                },
                store: SettingStore.getStoreData(),
                order: CheckoutStore.getOrderDetails(),
                items: CartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                totals: CheckoutStore.getTotals(),
                total: CheckoutStore.getTotal()
            }
        }, () => {
            this.openDrawer()
            this.printOrder()
        })
    }
    
    hideCompleteModal() {
        this.setState({
            complete: null
        })
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
    
    categoryClicked(item) {
        let stepId = 'cart'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            // Clear existing selections
            if (this.stepper.getSelection().length > 0) {
                this.stepper.clear()
            }
            
            let data = item
            
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
        }
    }
    
    itemClicked(item) {
        let stepId = 'options'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = item
            
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
            this.stepper.addItem(item.id, 1, item)
        }
    }
    
    itemDropped(item) {
        //let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        //cart.addItem(item, 1, products[item])
    }
    
    optionClicked(item) {
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

        //this.stepper.addOption(item['product_option_value_id'], 1, item) // TODO: Finish the options bit, products are already good, just hack in the options the old way for now
        // Note: I just looked again, and actually, it functions pretty good as is... maybe I'll leave the change for a later release, we're relatively good to go here
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.addOption(item['product_option_value_id'], 1, item, product)
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
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
        }
    }
    
    addToCart(e) {
        e.preventDefault()
        e.stopPropagation()
        
        let quantity = parseFloat(this.keypad.getForm().value)
        
        if (!isNaN(quantity) && quantity > 0) {
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
            let item = this.stepper.getItem(0) // Hardcoded to zero indexed item
            
            //alert('Adding ' + quantity + 'x ' + item.data.name + '(s) to the order.')
            cart.addItem(item.id, quantity, item.data)
            
            this.keypad.setField('value', 0)
            
            this.stepper.start()
            this.setStep('shop')
        } else {
            alert('Please enter the desired quantity.')
        }
    }
    
    refresh() {
        this.keypad.setField('value', 0)
        
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        this.setState({ canSubmit : !cart.isEmpty() })
    }
    
    reset() {
        this.keypad.setField('value', 0)
        
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.emptyCart()
        
        this.checkoutNotes.clear()

        let stepId = 'shop'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (typeof stepDescriptor !== null) {
            let data = {}
            
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
        }
    }
    
    getTotal() {
        let total = 0

        if (typeof this.refs.cart !== 'undefined' && this.refs.cart !== null) {
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        }

        return total
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
    
    selectPaymentMethod(method) {
        let methods = ['cash', 'credit', 'debit', 'cheque', 'giftcard']
        
        if (methods.indexOf(method) > -1) {
            console.log('changing payment method to ' + StringHelper.capitalizeFirstLetter(method))
            this.setState({
                paymentMethod: StringHelper.capitalizeFirstLetter(method),
                paymentCode: method
            }, () => {
                this.updatePaymentMethod(method, StringHelper.capitalizeFirstLetter(method))
                this.forceUpdate() // Redraw receipt
            })
        } else {
            console.log('clear payment method')
            this.setState({
                paymentMethod: 'In Store',
                paymentCode: 'in_store'
            }, () => {
                this.updatePaymentMethod('in_store', 'In Store')
                this.forceUpdate() // Redraw receipt
            })
        }
    }
    
    toggleCustomPaymentAmount() {
        this.setState({
            customPaymentAmount: !this.state.customPaymentAmount
        })
    }
    
    getChangeAmounts(price, cash, cid) {
        let change = cash - price
        cid = cid || CASH_IN_DRAWER // Defined at the top

        // Transform CID array into drawer object
        let register = cid.reduce(function(acc, curr) {
            acc.total += curr[1]
            acc[curr[0]] = curr[1]
            return acc
        }, {total: 0})

        // Handle exact change
        if (register.total === change) {
            return 'Closed'
        }

        // Handle obvious insufficent funds
        if (register.total < change) {
            return 'Insufficient Funds'
        }

        // Loop through the denomination array
        let change_arr = denom.reduce(function(acc, curr) {
            let value = 0
            // While there is still money of this type in the drawer
            // And while the denomination is larger than the change reminaing
            while (register[curr.name] > 0 && change >= curr.val) {
                change -= curr.val
                register[curr.name] -= curr.val
                value += curr.val

                // Round change to the nearest hundreth deals with precision errors
                change = Math.round(change * 100) / 100
            }

            // Add this denomination to the output only if any was used.
            if (value > 0) {
                acc.push([ curr.name, value ])
            }

            return acc // Return the current Change Array
        }, []) // Initial value of empty array for reduce

        // If there are no elements in change_arr or we have leftover change, return
        // the string 'Insufficient Funds'

        if (change_arr.length < 1 || change > 0) {
            return 'Insufficient Funds'
        }

        // Here is your change, ma'am.
        return change_arr
    }
    
    calculateChange(e) {
        console.log(e)
        let orderTotal = parseFloat(CheckoutStore.getTotal().value)
        
        let cashAmount = e.target.getAttribute('data-amount')
        
        if (isNaN(cashAmount) && cashAmount === 'custom') {
            if (typeof this.customPaymentAmount !== 'undefined' && 
                this.customPaymentAmount !== null) {
                cashAmount = parseFloat(this.customPaymentAmount.value)
            } else {
                throw new Error('something went wrong with cash amount')
                // TODO: This is a kind of a stupid error message I can handle this better
            }
        } else if (!isNaN(cashAmount)) {
            cashAmount = parseFloat(cashAmount)
        }

        this.setState({
            cashAmount: (cashAmount).toFixed(2),
            changeAmount: (cashAmount - orderTotal).toFixed(2)
        })
    }
    
    selectChangePreset(e) {
        console.log(e)
        let orderTotal = parseFloat(CheckoutStore.getTotal().value)
        
        let cashAmount = e.target.getAttribute('data-amount')
        
        if (isNaN(cashAmount) && cashAmount === 'custom') {
            if (typeof this.customPaymentAmount !== 'undefined' && 
                this.customPaymentAmount !== null) {
                cashAmount = parseFloat(this.customPaymentAmount.value)
            } else {
                throw new Error('something went wrong with cash amount')
                // TODO: This is a kind of a stupid error message I can handle this better
            }
        } else if (!isNaN(cashAmount)) {
            cashAmount = parseFloat(cashAmount)
        }

        this.setState({
            cashAmount: (cashAmount).toFixed(2),
            changeAmount: (cashAmount - orderTotal).toFixed(2)
        })

        this.completeOrder()
    }
    
    renderPaymentOptions() {
        return (
            <div className='cash-options payment-options'>
                <Button bsStyle='default' data-type='cash' onClick={this.selectPaymentMethod.bind(this, 'cash')}>Cash</Button>&nbsp;
                <Button bsStyle='default' data-type='visa' onClick={this.selectPaymentMethod.bind(this, 'credit')}>Visa</Button>&nbsp;
                <Button bsStyle='default' data-type='mastercard' onClick={this.selectPaymentMethod.bind(this, 'credit')}>Mastercard</Button>&nbsp;
                <Button bsStyle='default' data-type={'debit'} onClick={this.selectPaymentMethod.bind(this, 'debit')}>Debit</Button>&nbsp;
                <Button bsStyle='default' data-type={'cheque'} onClick={this.selectPaymentMethod.bind(this, 'cheque')}>Cheque</Button>&nbsp;
                <Button bsStyle='default' data-type={'giftcard'} onClick={this.selectPaymentMethod.bind(this, 'giftcard')}>Gift Card</Button>
            </div>
        )
    }
    
    renderCashOptions() {
        let total = parseFloat(CheckoutStore.getTotal().value)
        let min = Math.ceil(total/5)*5 // 5 dollars is the lowest bill denomination
        let options = []

        for (let idx = 0; idx < 5; idx++) {
            options.push(min * (idx + 1))
        }

        return (
            <div className='cash-options'>
                <Button bsStyle='success' data-amount={total} onClick={this.selectChangePreset}>${total.toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[0]} onClick={this.selectChangePreset}>${options[0].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[1]} onClick={this.selectChangePreset}>${options[1].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[2]} onClick={this.selectChangePreset}>${options[2].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='success' data-amount={options[3]} onClick={this.selectChangePreset}>${options[3].toFixed(2)}</Button>&nbsp;
                {/*<Button bsStyle='default' data-amount={options[4]} onClick={this.calculateChange}>${options[4].toFixed(2)}</Button>&nbsp;*/}
                <Button bsStyle='disabled' data-amount='custom' onClick={this.toggleCustomPaymentAmount}>Custom</Button>&nbsp;
            </div>
        )
    }
    
    renderOptions(selectedOptions) {
        let options = []
        
        for (let idx in selectedOptions) {
            options.push(<li>{selectedOptions[idx].data.option.name}: <b>{selectedOptions[idx].data.name}</b></li>)
        }
        
        return (            
            <ul style={{
                paddingLeft: '1.5rem',
                marginLeft: '0'
            }}>
            {options}
            </ul>
        )
    }
    
    renderReceipt(cached = true) {
        cached = cached || true
        let render = false
        
        if (this.state.hasOwnProperty('checkout') &&
            this.state.checkout.hasOwnProperty('order') &&
            typeof this.state.checkout.order !== 'undefined') {
            render = true
        }
        
        if (!render) return
        
        let output = []

        // Build our receipt, line by line
        // Store info
        let store = this.state.checkout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>780.244.0ACE</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{datetime.toString()}</span>)

        output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

        output.push(<hr />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{[this.state.paymentMethod, 'Sale'].join(' ')}</h4></span>)
        output.push(<br />)
        //output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
            let price = parseFloat(items[idx].data['price']).toFixed(2)
            let model = items[idx].data['model']
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                            {this.renderOptions(items[idx].options)}
                        </span>
                    )
                } else {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                        </span>
                    )
                }
            
        }

        output.push(<br />)
        
        // Comments
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Order Notes</h4></span>)
        
        output.push(
            <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                <span style={{'font-size': '16px', 'font-weight': 'normal'}}>{this.state.notes}</span>
            </span>
        )
        
        output.push(<br />)

        // Totals
        let totals = this.state.checkout.totals || []
        let total = this.state.checkout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    {totals[idx].title}
                    <span style={{'float': 'right'}}>${parseFloat(totals[idx].value).toFixed(2)}</span>
                </span>
            )
        }

        if (total !== null) {
            output.push(<br />)
            output.push(<hr />)

            // Final total
            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    <h4 style={{display: 'inline-block'}}>{total.title}</h4>
                    <span style={{'float': 'right', 'font-size': '18px', 'font-weight': 'bold'}}>${parseFloat(total.value).toFixed(2)}</span>
                </span>
            )
        }
        
        output.push(<br />)
        
        // Payment details
        output.push(
            <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                Payment Method
                <span style={{'float': 'right', 'font-size': '16px', 'font-weight': 'bold'}}>{this.state.paymentMethod}</span>
            </span>
        )

        return output
    }
    
    renderCachedReceipt(cached = true) {
        cached = cached || true
        let render = false
        
        if (this.state.hasOwnProperty('prevCheckout') &&
            this.state.prevCheckout.hasOwnProperty('order') &&
            typeof this.state.prevCheckout.order !== 'undefined') {
            render = true
        }
        
        if (!render) return
        
        let output = []

        // Build our receipt, line by line
        // Store info
        let store = this.state.prevCheckout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>780.244.0ACE</span>)
        headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{datetime.toString()}</span>)

        output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

        output.push(<hr />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Sale</h4></span>)
        output.push(<br />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
            let price = parseFloat(items[idx].data['price']).toFixed(2)
            let model = items[idx].data['model']
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                            {this.renderOptions(items[idx].options)}
                        </span>
                    )
                } else {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            {model}
                            <span style={{'float': 'right'}}>${price}</span>
                        </span>
                    )
                }
            
        }

        output.push(<br />)

        // Totals
        let totals = this.state.prevCheckout.totals || []
        let total = this.state.prevCheckout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    {totals[idx].title}
                    <span style={{'float': 'right'}}>${parseFloat(totals[idx].value).toFixed(2)}</span>
                </span>
            )
        }

        if (total !== null) {
            output.push(<br />)
            output.push(<hr />)

            // Final total
            output.push(
                <span style={{'display': 'block', 'clear': 'both'}} className='receipt-line-item'>
                    {total.title}
                    <span style={{'float': 'right', 'font-size': '18px', 'font-weight': 'bold'}}>${parseFloat(total.value).toFixed(2)}</span>
                </span>
            )
        }

        return output
    }
    
    renderEndOfDayReport(data) {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.checkout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push('ACE Coffee Roasters')
        headerLines.push('10055 - 80 Ave NW')
        headerLines.push('Edmonton, Alberta T6E 1T4')
        headerLines.push('780.244.0ACE')
        headerLines.push(datetime.toString())

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('End of Day Report')
        output.push('\n')
        output.push('Qty        Item        Total')

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = data['purchased_products']
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx]['quantity'] + ' x ',
                items[idx]['model'],
                '$' + (parseFloat(items[idx]['total']).toFixed(2))
            ].join('  ')

            output.push(line)
        }

        output.push('\n')

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    renderPlainTxtOrder() {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.prevCheckout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push('ORDER')
        headerLines.push(datetime.toString())

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('ITEMS')
        output.push('\n')

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx].quantity + ' x ',
                items[idx].data['model']
            ].join('  ')

            output.push(line)
            
            if (typeof items[idx].options !== 'undefined' && 
                items[idx].options instanceof Array && 
                items[idx].options.length > 0) {
                output = output.concat(this.renderPlainTxtOptions(items[idx].options))
            }
        }
        
        if (typeof this.state.notes === 'string' && this.state.notes !== '') {
            output.push('\n')
            output.push('NOTES')
            output.push('\n')
            output.push(this.state.notes)
        }

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    renderPlainTxtReceipt() {
        let output = []

        // Build our receipt, line by line
        // Store info
        //let store = this.state.prevCheckout.store
        let datetime = new Date()

        let headerLines = []
        headerLines.push('ACE Coffee Roasters')
        headerLines.push('10055 - 80 Ave NW')
        headerLines.push('Edmonton, Alberta T6E 1T4')
        headerLines.push('780.244.0ACE')
        headerLines.push(datetime.toString())

        output.push(...headerLines) // ES6 extend array

        output.push('\n')
        output.push('Sale')
        output.push('\n')
        output.push('Qty        Item        Total')

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
            let line = [
                items[idx].quantity + ' x ',
                items[idx].data['model'],
                '$' + (parseFloat(items[idx].data['price']) * items[idx].quantity).toFixed(2)
            ].join('  ')

            output.push(line)
        }

        output.push('\n')

        // Totals
        let totals = this.state.prevCheckout.totals || []
        let total = this.state.prevCheckout.total || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue

            // Set the total title
            let subTotalTitle = ''
            switch (totals[idx].code) {
                case 'sub_total':
                    subTotalTitle = 'Sub-total'
                    break
                case 'total':
                    subTotalTitle = 'Total'
                    break
                default:
                    subTotalTitle = totals[idx].title
            }

            output.push(subTotalTitle + ': $' + parseFloat(totals[idx].value).toFixed(2))
        }

        if (total !== null) {
            // Final total
            // Set the total title
            let totalTitle = ''
            switch (total.code) {
                case 'sub_total':
                    totalTitle = 'Sub-total'
                    break
                case 'total':
                    totalTitle = 'Total'
                    break
                default:
                    totalTitle = total.title
            }

            output.push(totalTitle + ': $' + parseFloat(total.value).toFixed(2))
        }
        
        output.push('\n')
        output.push('Payment Method' + ': ' + this.state.paymentMethod)

        return output.join('\n') + '\n' // Pad the bottom of the page... probably a way to do this via Star API but I'll check that out later
    }
    
    renderPlainTxtOptions(selectedOptions) {
        let options = []
        
        for (let idx in selectedOptions) {
            options.push(selectedOptions[idx].data.option.name + ': ' + selectedOptions[idx].data.name)
            options.push('\n')
        }
        
        return options
    }
    
    // Simply triggers CheckoutStore method
    openDrawer() {
        StarMicronicsStore.openDrawer()
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
        
        let orderTotal = 0.00
        if (CheckoutStore.payload.orderTotals instanceof Array && CheckoutStore.payload.orderTotals.length > 0) {
            let orderTotalValue = parseFloat(CheckoutStore.getTotal().value)
            if (!isNaN(orderTotalValue)) {
                orderTotal = orderTotalValue.toFixed(2) 
            }
        }

        return (
            <div className='cart-ui'>
                <div id='browser'>
                    <Tabs activeKey={this.state.step} id='dev-tabs'>
                        <Tab eventKey={'shop'} title='Browser'>
                            <Row>
                                <Col sm={12}>
                                    <BlockUi tag='div' blocking={this.state.blockUi}>
                                        <ProductBrowser
                                            activeStep = 'shop'
                                            title = {this.state.title}
                                            displayTitle = {false}
                                            displayProductFilter = {false}
                                            displayCategoryFilter = {false}
                                            displayTextFilter = {true}
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
                                            displayTitle = {true}
                                            title = {this.state.title}
                                            displayProductFilter = {false}
                                            displayCategoryFilter = {true}
                                            displayTextFilter = {true}
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
                                            displayTitle = {false}
                                            title = {this.state.title}
                                            price = {this.state.itemPrice}
                                            item = {this.state.item}
                                            displayProductFilter = {false}
                                            displayCategoryFilter = {false}
                                            displayTextFilter = {false}
                                            stepper = {this.stepper}
                                            steps = {steps}
                                            customRowComponent = {ProductOptionRow}
                                            results = {this.state.data.options}
                                            fluxFactory = {fluxFactory}
                                            onItemClicked = {this.optionClicked}
                                            onFilterSelected = {this.categoryFilterSelected}
                                            onStepClicked = {this.stepClicked}>
                                            <Keypad ref = {(keypad) => this.keypad = keypad}/>
                                            <FormGroup
                                                style={{
                                                        display: 'block'
                                                    }}>
                                                <Button block bsStyle='success' onClick={this.addToCart}>
                                                    <h4><i className='fa fa-shopping-cart' /> Add to Order</h4>
                                                </Button>
                                            </FormGroup>
                                        </ProductBrowser>
                                    </BlockUi>
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey={'checkout'} title='Checkout'>
                            <Row>
                                <Col sm={12}>
                                    <div className='browser-container'>
                                        <div className='browser-menu-container'>
                                            <BrowserMenu
                                                activeStep = 'checkout'
                                                steps = {steps}
                                                onStepClicked = {this.stepClicked}
                                                />
                                        </div>
                                        <div className='browser-content'>
                                            <div className='container-fluid'>
                                                {/*<Row>
                                                    <Col sm={12}>
                                                        <Header direction='row'
                                                          pad={{horizontal: 'medium'}}>
                                                          <Title>Customer Info</Title>
                                                        </Header>
                                                    </Col>
                                                </Row>*/}
                                                <Row>
                                                {/*<CustomerProfile
                                                        customer = {CheckoutStore.customer}
                                                        billingAddress = {CheckoutStore.billingAddress}
                                                        shippingAddress = {CheckoutStore.shippingAddress}
                                                        displayProfile = {false}
                                                        displayBillingAddress = {true}
                                                        displayShippingAddress = {true}
                                                        />*/}
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                    
                    <div id='checkout-notes'>
                        <div className='container-fluid'>
                            <Row>
                                <Col xs={12}>
                                <Notes 
                                    ref = {(notes) => this.checkoutNotes = notes}
                                    onSaveSuccess = {this.updateNotes}
                                    displaySummary = {true}
                                    modal = {true}
                                    title = 'Order Notes' />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>

                <div id='checkout'>
                    <Grid>
                        <Row className='account-parts'>
                            <Col xs={12}>
                                {this.props.loggedIn && (
                                <Row className='account-panel'>
                                    <Col xs={12} md={12} lg={6}>
                                        <SignInForm
                                            onCreate = {this.showNewCustomerForm}
                                            onLoginSuccess = {this.props.onLoginSuccess}
                                            />
                                    </Col>
                                    <Col xs={12} md={12} lg={6}>
                                        <TopMenu>
                                            <AccountMenu />
                                        </TopMenu>
                                    </Col>
                                </Row>
                                )}
                                
                                {this.props.loggedIn && (
                                <hr style={{flex: '0'}} />
                                )}
                                
                                <div>
                                    <CustomerPicker
                                        customer = {this.props.customer}
                                        onCreate = {this.showNewCustomerForm}
                                        onEdit = {this.showEditCustomerForm}
                                        onSubmit = {this.changeCustomer}
                                        />
                                </div>
                                
                                {/* User, not customer account forms */}
                                {/* TODO: Move to a modal? */}
                                {this.state.createAccount && (
                                <div>
                                    <CustomerProfile
                                        customer = {CustomerStore.customer}
                                        billingAddress = {CustomerStore.billingAddress}
                                        shippingAddress = {CustomerStore.shippingAddress}
                                        editAccount = {false}
                                        createAccount = {true}
                                        displayProfile = {true}
                                        displayCurrentAddress = {true}
                                        displayBillingAddress = {true}
                                        displayShippingAddress = {false}
                                        onCreateSuccess = {(payload) => {
                                            let data = ObjectHelper.recursiveFormatKeys(payload, 'camelcase', 'underscore')
                                            
                                            CustomerActions.setCustomer(data.customer) // TODO: This should trigger an event... right now it doesn't trigger anything
                                            CustomerActions.setBillingAddress({
                                                addresses: data.addresses,
                                                billingAddressId: data.customer['address_id'],
                                                billingAddress: data.addresses[0] // TODO: Get the right address using ID
                                            })
                                            
                                            /*CustomerActions.setShippingAddress({
                                                addresses: [payload.data],
                                                shippingAddressId: addressId,
                                                shippingAddress: payload.data
                                            })*/
                                            
                                            CheckoutStore.setExistingCustomer({ customer: data.customer })
                                             // TODO: Return customer does not have new address ID assigned, so we're grabbing it from the address
                                            CheckoutStore.setBillingAddress({
                                                addresses: data.addresses,
                                                billingAddressId: data.addresses[0]['address_id'],
                                                billingAddress: data.addresses[0] // TODO: Get the right address using ID
                                            })
                                            
                                            this.forceUpdate()
                                            this.hideNewCustomerForm()
                                        }}
                                        onCancel = {this.hideNewCustomerForm}
                                        modal = {true}>
                                    </CustomerProfile>
                                </div>
                                )}

                                {this.state.editAccount && (
                                <div>
                                    <CustomerProfile
                                        customer = {CustomerStore.customer}
                                        billingAddress = {CustomerStore.billingAddress}
                                        shippingAddress = {CustomerStore.shippingAddress}
                                        editAccount = {true}
                                        createAccount = {false}
                                        displayProfile = {true}
                                        displayCurrentAddress = {true}
                                        displayBillingAddress = {true}
                                        displayShippingAddress = {false}
                                        onSaveSuccess = {(payload) => {
                                            let data = ObjectHelper.recursiveFormatKeys(payload, 'camelcase', 'underscore')
                                            
                                            CustomerActions.setCustomer(data.customer) // TODO: This should trigger an event... right now it doesn't trigger anything
                                            CustomerActions.setBillingAddress({
                                                addresses: data.addresses,
                                                billingAddressId: data.customer['address_id'],
                                                billingAddress: data.addresses[0] // TODO: Get the right address using ID
                                            })
                                            
                                            CheckoutStore.setExistingCustomer({ customer: data.customer })
                                            CheckoutStore.setBillingAddress({
                                                addresses: data.addresses,
                                                billingAddressId: data.customer['address_id'],
                                                billingAddress: data.addresses[0] // TODO: Get the right address using ID
                                            })
                                            // Force an update
                                            //this.forceUpdate()
                                            this.hideEditCustomerForm()
                                        }}
                                        onCancel = {this.hideEditCustomerForm}
                                        modal = {true}>
                                    </CustomerProfile>
                                </div>
                                )}
                            </Col>
                        </Row>
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
                            <Col className='cart-buttons' xs={12}>
                                {/*
                                <Button
                                  onClick   =  {this.showCodeModal}
                                  style     =   {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  bsStyle   =   'default'>
                                    <h4>Enter Code</h4>
                                </Button>
                                */}
                                
                                {/*this.state.canSubmit && (
                                <Button
                                  style   = {{
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
                                  onClick   =   {this.showScanModal}
                                  style     =   {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  className =   'hidden-xs hidden-sm'
                                  bsStyle   =   'default'>
                                    <h4><i className='fa fa-barcode' /> Scan Item</h4>
                                </Button>
                                )*/}
                                
                                {this.state.canSubmit && (
                                <Button
                                  style     = {{
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
                                  style     = {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  className = 'pull-right'
                                  onClick   = {this.reset}
                                  bsStyle   = 'danger'>
                                    <h4><i className='fa fa-times' /> Empty</h4>
                                </Button>
                                )}

                                {this.state.canSubmit && (
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
                                )}

                                {/*this.state.canSubmit && (
                                <Button
                                  style     =   {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  onClick   =   {this.setStep.bind(this, 'shop')}
                                  bsStyle   =   'default'>
                                    <h4><i className='fa fa-clipboard' /> Change Order</h4>
                                </Button>
                                )*/}

                                {/*this.state.step !== 'cart' && (
                                <Button
                                  style     =   {{
                                      width: '100%',
                                      marginTop: '2rem'
                                  }}
                                  onClick   =   {this.setStep.bind(this, 'shop')}
                                  bsStyle   =   'default'>
                                    <h4><i className='fa fa-shopping-cart' /> Continue Shopping</h4>
                                </Button>
                                )*/}
                                
                                <Row>
                                    <Col xs={12} md={6}>
                                        <Button
                                          block
                                          style     = {{
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
                                          style     = {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick = {this.printReport}
                                          bsStyle = 'default'>
                                            <h4><i className='fa fa-print' /> End of Day</h4>
                                        </Button>
                                    </Col>
                                </Row>                                
                            </Col>
                        </Row>
                    </Grid>
                </div>

                <Modal
                  show   = {!!this.state.charge}
                  onHide = {this.hideChargeModal}>
                    <Modal.Header>
                        <Modal.Title>
                            <span style={{ float: 'right', display: 'inline-block', marginTop: '5px' }}>Charge / Split</span>
                            <span style={{ float: 'none' }} class='total-charge'>Total:<span style={{ display: 'inline-block', marginLeft: '1rem', fontSize: '1.5rem' }}>${orderTotal}</span></span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div>
                                <div>
                                    <Alert bsStyle='danger'>
                                        <i className='fa fa-info' /> Please select a payment option below.
                                    </Alert>
                                </div>

                                <form>
                                    <FormGroup>
                                        <i className='fa fa-money' /> <ControlLabel>Choose Payment Type</ControlLabel>
                                        <br />
                                    </FormGroup>
                                    
                                    <FormGroup>
                                        {this.renderPaymentOptions()}
                                        <input type='hidden' name='hid_cash' />
                                    </FormGroup>

                                    <hr />
                                    
                                    {this.state.paymentCode === 'cash' && (
                                    <FormGroup>
                                        {this.renderCashOptions()}
                                        <input type='hidden' name='hid_cash' />
                                    </FormGroup>
                                    )}
                                    
                                    {this.state.paymentCode === 'cash' && this.state.customPaymentAmount && (
                                    <FormGroup>
                                        <i className='fa fa-dollar' /> <ControlLabel>Custom Amount</ControlLabel>
                                        <FormControl type='text' name='custom_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
                                    </FormGroup>
                                    )}
                                    
                                    {this.state.paymentCode === 'credit' && (
                                    <FormGroup>
                                        <i className='fa fa-credit-card' /> <ControlLabel>Credit Card</ControlLabel>
                                        <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                        <input type='hidden' name='hid_card' />
                                    </FormGroup>
                                    )}
                                    
                                    {this.state.paymentCode === 'debit' && (
                                    <FormGroup>
                                        <i className='fa fa-credit-card' /> <ControlLabel>Debit Card</ControlLabel>
                                        <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                        <input type='hidden' name='hid_debit' />
                                    </FormGroup>
                                    )}
                                    
                                    {this.state.paymentCode === 'cheque' && (
                                    <FormGroup>
                                        <i className='fa fa-money' /> <ControlLabel>Cheque / Money Order</ControlLabel>
                                        <FormControl type='text' name='cheque' placeholder='Reference Number' />
                                        <input type='hidden' name='hid_cheque' />
                                    </FormGroup>
                                    )}
                                    
                                    {this.state.paymentCode === 'cheque' && this.customerPaymentAmount && (
                                    <FormGroup>
                                        <i className='fa fa-dollar' /> <ControlLabel>Amount</ControlLabel>
                                        <FormControl type='text' name='cheque_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
                                    </FormGroup>
                                    )}
                                    
                                    {this.state.paymentCode === 'giftcard' && (
                                    <FormGroup>
                                        <i className='fa fa-gift' /> <ControlLabel>Gift Card</ControlLabel>
                                        <FormControl type='text' name='gift' placeholder='Card Number or Swipe' />
                                        <input type='hidden' name='hid_gift' />
                                    </FormGroup>
                                    )}
                                    
                                    {/* TODO: Check if is a valid method */}
                                    {this.state.paymentCode !== null && (
                                    <hr />
                                    )}

                                    <FormGroup>
                                        <Button bsStyle='success' block onClick={this.completeOrder}><h4><i className='fa fa-money' /> Process Payment</h4></Button>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button bsStyle='default' block onClick={this.hideChargeModal}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                    </FormGroup>
                                </form>
                                
                                <div className='receipt'
                                    style={{
                                        margin: '0 auto',
                                        maxWidth: '570px',
                                        boxSizing: 'border-box',
                                        padding: '18px',
                                        border: '1px solid black'
                                    }}>
                                    {this.renderReceipt()}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal
                  show   = {!!this.state.complete}
                  onHide = {this.hideCompleteModal}>
                    <Modal.Header>
                        <Modal.Title>
                            Transaction Complete!
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div>
                                <div>
                                    <Alert bsStyle='default'>
                                        <h2 style={{ textAlign: 'center', display: 'block' }}>${this.state.changeAmount} change</h2>
                                        <hr />
                                        <span style={{ textAlign: 'center', display: 'block' }}><b>Out of ${this.state.cashAmount} received</b></span>
                                        {/*<span style={{ textAlign: 'center', display: 'block' }}>How would you like your receipt?</span>*/}
                                    </Alert>
                                </div>


                                <form>
                                    <FormGroup>
                                        <Button block bsStyle='default' onClick={this.showReceiptModal}><h4><i className='fa fa-eye' /> View Receipt</h4></Button>
                                    </FormGroup>

                                    <FormGroup>
                                        <Button block bsStyle='default' onClick={this.printReceipt}><h4><i className='fa fa-print' /> Print Receipt</h4></Button>
                                    </FormGroup>

                                    <FormGroup>
                                        <Button block bsStyle='default' onClick={this.printOrder}><h4><i className='fa fa-clipboard' /> Re-print Order</h4></Button>
                                    </FormGroup>

                                    <FormGroup>
                                        <Button
                                          block
                                          style     = {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick = {this.openDrawer}
                                          bsStyle = 'default'>
                                            <h4><i className='fa fa-external-link-square' /> Open Drawer</h4>
                                        </Button>
                                    </FormGroup>

                                    <FormGroup>
                                        <Button block bsStyle='success' onClick={this.onSaleComplete}><h4><i className='fa fa-check' /> Done (New Sale)</h4></Button>
                                    </FormGroup>

                                    <hr />

                                    {/*
                                    <h4>Other Options</h4>

                                    <hr />

                                    <FormGroup>
                                        <i className='fa fa-envelope-o' /> <ControlLabel>E-mail Receipt</ControlLabel>
                                        <FormControl type='text' name='email' placeholder='youraddress@domain.com' />
                                        <input type='hidden' name='send_email' />
                                    </FormGroup>

                                    <FormGroup>
                                        <Button block bsStyle='default' onClick={this.hideCompleteModal}><h4><i className='fa fa-envelope-o' /> Send E-mail</h4></Button>
                                    </FormGroup>

                                    <hr />

                                    <FormGroup>
                                        <i className='fa fa-comment' /> <ControlLabel>Text Receipt</ControlLabel>
                                        <FormControl type='text' name='text' placeholder='(123) 456 7890' />
                                        <input type='hidden' name='send_text' />
                                    </FormGroup>œ

                                    <FormGroup>
                                        <Button block bsStyle='default' onClick={this.hideCompleteModal}><h4><i className='fa fa-comment-o' /> Send Text</h4></Button>
                                    </FormGroup>

                                    <hr />

                                    <FormGroup>
                                        <i className='fa fa-ban' /> <ControlLabel>No Receipt</ControlLabel>
                                        <input type='hidden' name='send_nothing' />
                                    </FormGroup>
                                    */}
                                </form>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal
                  show   = {!!this.state.receipt}
                  onHide = {this.hideReceiptModal}>
                    <Modal.Header>
                        <Modal.Title>
                            ACE Coffee Roasters
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.hasOwnProperty('prevCheckout') &&
                        this.state.prevCheckout.hasOwnProperty('order') &&
                        typeof this.state.prevCheckout.order !== 'undefined' && (
                        <div className='receipt'
                            style={{
                                margin: '0 auto',
                                maxWidth: '300px',
                                boxSizing: 'border-box',
                                padding: '18px',
                                border: '1px solid black'
                            }}>
                            {this.renderCachedReceipt()}
                        </div>
                        )}
                    </Modal.Body>
                </Modal>
                
                <Modal
                  show   = {!!this.state.purchase}
                  onHide = {this.hideModal}>
                    <Modal.Header>
                        <Modal.Title>
                            Your order
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.purchase && (
                            <div>
                                <Alert bsStyle='warning'>
                                    This is a demo&mdash;orders are not processed. <i className='fa fa-smile-o' />
                                </Alert>
                                <Table>
                                    <tbody>
                                        {this.state.purchase.map(item => {
                                            return (
                                                <tr key={item._key}>
                                                    <td>{item.data['Brand']}</td>
                                                    <td>{item.data['Name']}</td>
                                                    <td>&times; {item.quantity}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                                <Button block onClick={this.hideModal}>Ok</Button>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal
                  show   = {!!this.state.code}
                  onHide = {this.hideCodeModal}>
                    <Modal.Header>
                        <Modal.Title>
                            Enter code
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.code && (
                            <div>
                                <Alert bsStyle='warning'>
                                    Please enter the item code. <i className='fa fa-smile-o' />
                                </Alert>
                                <Button block onClick={this.hideCodeModal}>Ok</Button>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
                <Modal
                  show   = {!!this.state.scan}
                  onHide = {this.hideScanModal}>
                    <Modal.Header>
                        <Modal.Title>
                            Scan item
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.scan && (
                            <div>
                                <Alert bsStyle='warning'>
                                    Please scan your item. <i className='fa fa-barcode' />
                                </Alert>
                                <Button block onClick={this.hideScanModal}>Ok</Button>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>

                <Modal
                  show   = {!!this.state.chooseQuantity}
                  onHide = {this.hideQuantity}>
                    <Modal.Header>
                        <Modal.Title>
                            Enter Quantity
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/*<Keyboard
                            keyboardType='decimal-pad'
                            onClear={this._handleClear.bind(this)}
                            onDelete={this._handleDelete.bind(this)}
                            onKeyPress={this._handleKeyPress.bind(this)}
                        />*/}
                    </Modal.Body>
                </Modal>

            </div>
        )
    }
})
