import assign from 'object-assign'
import axios from 'axios' // Move me out! Just using in here for temp report processing

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

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
import CategoryRow from './catalog/CategoryRow.jsx'
import ProductRow from './catalog/ProductRow.jsx'
import ProductOptionRow from '../components/catalog/ProductOptionRow.jsx'

import Stepper from './stepper/BrowserStepper.jsx'

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

@inject(deps => ({
    actions: deps.actions,
	authService: deps.authService,
	customerService: deps.customerService,
    checkoutService: deps.checkoutService,
    settingService: deps.authService,
	loginStore: deps.loginStore,
    userStore: deps.userStore,
    customerStore: deps.customerStore,
    checkoutStore: deps.checkoutStore,
    starMicronicsStore: deps.starMicronicsStore,
    productStore: deps.productStore,
	settingStore: deps.settingStore,
	mappings: deps.mappings, // Per component or global scope?
	translations: deps.translations, // i8ln transations
	roles: deps.roles, // App level roles, general authenticated user (not customer!)
	userRoles: deps.userRoles, // Shortcut or implement via HoC?
	user: deps.user // Shortcut or implement via HoC?
}))
@observer
class PosComponent extends Component {
    constructor(props) {
        super(props)
        
        this.getSelection = this.getSelection.bind(this)
        this.hasItems = this.hasItems.bind(this)
        this.configureSteps = this.configureSteps.bind(this)
        this.setStep = this.setStep.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.quickAddToCart = this.quickAddToCart.bind(this)
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
        this.debugReceipt = this.debugReceipt.bind(this)
        this.debugOrder = this.debugOrder.bind(this)
        this.printReceipt = this.printReceipt.bind(this)
        this.printOrder = this.printOrder.bind(this)
        this.printReport = this.printReport.bind(this)
        this.showCompleteModal = this.showCompleteModal.bind(this)
        this.hideCompleteModal = this.hideCompleteModal.bind(this)
        this.onSaleComplete = this.onSaleComplete.bind(this)
        this.reset = this.reset.bind(this)
        this.categoryClicked = this.categoryClicked.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.addToCartClicked = this.addToCartClicked.bind(this)
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
        
        // Store our stepper instance
        // Stepper maintains its own state and store
        this.stepper = new Stepper()
        
        this.props.actions.setting.fetchStore(8)
        
        props.settingStore.on('store-info-loaded', (id, payload) => {
            props.checkoutStore.stores[id] = payload
        }) // Load ACE bar store data so we don't have to later
        
        this.props.actions.setting.fetchSettings()
        
        props.settingStore.on('settings-loaded', (payload) => {
            props.checkoutStore.settings = payload

            // We only wanna do this once, so stick 'er right up top
           props.checkoutService.createOrder({
                action: 'insert'
                //orderTaxRates: this.orderTaxRates
            })
        })
        
        // Subscribe to checkout block ui events
        props.checkoutStore.on('block-ui', () => {
            this.setState({
                blockUi: true
            })
        })

        props.checkoutStore.on('unblock-ui', () => {
            this.setState({
                blockUi: false
            })
        })
        
        props.checkoutStore.on('set-customer', () => {
            console.log('checkout customer change detected')
            console.log(props.customerStore.customer)
            console.log(props.customerStore.billingAddress)
            console.log(props.customerStore.shippingAddress)
            
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to props.checkoutStore
                props.checkoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (props.checkoutStore.payload.hasOwnProperty('order') && 
                    props.checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(props.checkoutStore.payload.order.orderId) &&
                        props.checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, assign({}, props.checkoutStore.payload.order, {
                            action: 'update',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    } else {
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        props.checkoutService.createOrder(assign({}, props.checkoutStore.payload.order, {
                            action: 'insert',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                    }
                // Payload order doesn't exist, we're gonna have to create it
                } else {
                    // TODO: Fix me! I'm hardcoded
                    // Change country and zone to customer default address
                    props.checkoutService.createOrder(assign({}, {
                        action: 'insert',
                        defaultSettings: this.getDefaultSettings()
                    }), (payload) => {
                        props.checkoutStore.setOrder(payload)
                        //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                    })
                }
            }
        })

        props.checkoutStore.on('set-order-status', () => {
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to props.checkoutStore
                props.checkoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(props.checkoutStore.payload.order.orderId) &&
                        props.checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, assign({}, props.checkoutStore.payload.order, {
                            action: 'updateOrderStatus',
                            defaultSettings: this.getDefaultSettings(),
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })
        
        props.checkoutStore.on('set-payment-method', () => {
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to props.checkoutStore
                props.checkoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(props.checkoutStore.payload.order.orderId) &&
                        props.checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, assign({}, props.checkoutStore.payload.order, {
                            action: 'updatePaymentMethod',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })
        
        props.checkoutStore.on('set-shipping-method', () => {
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to props.checkoutStore
                props.checkoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(props.checkoutStore.payload.order.orderId) &&
                        props.checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, assign({}, props.checkoutStore.payload.order, {
                            action: 'updateShippingMethod',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })
        
        props.checkoutStore.on('set-notes', () => {
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to props.checkoutStore
                props.checkoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(props.checkoutStore.payload.order.orderId) &&
                        props.checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, assign({}, props.checkoutStore.payload.order, {
                            action: 'updateNotes',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        })  
        
        /*props.checkoutStore.on('set-order', () => {
            console.log('checkout change detected')
            console.log(props.customerStore.customer)
            console.log(props.customerStore.billingAddress)
            console.log(props.customerStore.shippingAddress)
            
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to props.checkoutStore
                props.checkoutStore.setExistingCustomer()
                
                // Payloard order exists
                if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(props.checkoutStore.payload.order.orderId) &&
                        props.checkoutStore.payload.order.orderId > 0) {
                        props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, assign({}, props.checkoutStore.payload.order, {
                            action: 'update',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            props.checkoutStore.setOrder(payload)
                            //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                        })
                    }
                }
            }
        })*/
        
        // We call this data because it's not a complete item, just a POJO
        CartStore.on('item-added', (itemId, quantity, item) => {
            console.log('item added to order')
            console.log(item)
            
            // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator
            if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(props.checkoutStore.payload.order.orderId)) {
                    let orderProduct = assign({}, item.data, {
                        product_id: parseInt(itemId),
                        quantity: quantity
                    })
                    
                    let optionTotal = 0.00 
                    // Get the prices off of the selected options and add them to the product price
                    let orderOptions = props.checkoutStore.getOrderOptions(parseInt(itemId)) || null
                    
                    if (typeof orderOptions !== 'undefined' && orderOptions !== null) {
                        // Not sure if I want to finalize this as an array or an object so I'm accounting for either
                        if (Object.keys(orderOptions).length > 0) {
                            //for (let idx = 0; idx < orderOptions.length; idx++) {
                            for (let key in Object.keys(orderOptions)) {
                                let orderOption = orderOptions[key]
                                
                                // Get the product option value using the selected option's productOptionValueId
                                let productOptionId = Number(orderOption.productOptionId)
                                let productOptionValueId = Number(orderOption.productOptionValueId)
                                
                                let productOptions = item.data['options']
                                let selectedOptions = productOptions.filter(option => { return Number(option['product_option_id']) === productOptionId })
                                
                                if (selectedOptions instanceof Array && selectedOptions.length > 0) {
                                    let selectedOption = selectedOptions[0]
                                    // TODO: Make this method static
                                    let optionPrice = CartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                                    optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
                                }
                            }
                        }                        
                    }
                    
                    let orderProductPrice = parseFloat(item.data['price']) + optionTotal
                    
                    let orderTaxRates = props.checkoutStore.getOrderTaxRates()
                    
                    let lineTotal = orderProductPrice * quantity
                    let lineTotalWithTax = props.checkoutStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
                    let lineTax = props.checkoutStore.calculateTaxes(lineTotal, item.data['tax_class_id'])

                    // We're mutating the supplied data object by design
                    orderProduct = assign(orderProduct, {
                        price: orderProductPrice,
                        total: lineTotal,
                        tax: lineTax
                    })

                    props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                        action: 'insert',
                        orderProduct: orderProduct,
                        orderProductId: 0,
                        orderOptions: orderOptions, // TODO: If we fix the UI glitch (when tapping first option, item is created) we need to re-enable this
                        productId: parseInt(itemId),
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
                            
                            /*orderProducts.reduce((list, item, index) => {
                                
                            })*/
                            
                            // Update our CartStore
                            //CartStore.updateItem()
                        }
                        
                        props.checkoutStore.setOrder(payload)
                        //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId, onSuccess)
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
            if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(props.checkoutStore.payload.order.orderId)) {
                    let orderProductId = 0
                    for (let idx = 0; idx < props.checkoutStore.payload.orderProducts.length; idx++) {
                        if (parseInt(props.checkoutStore.payload.orderProducts[idx].productId) === parseInt(item.data['id'])) {
                            orderProductId = props.checkoutStore.payload.orderProducts[idx].orderProductId
                        }
                    }
                    
                    let orderProduct = assign({}, item.data, {
                        product_id: parseInt(item.data['id']),
                        quantity: quantity
                    })
                    
                    let optionTotal = 0.00 
                    // Get the prices off of the selected options and add them to the product price
                    let orderOptions = props.checkoutStore.getOrderOptions(parseInt(item.data['id'])) || null
                    
                    if (typeof orderOptions !== 'undefined' && orderOptions !== null) {
                        // Not sure if I want to finalize this as an array or an object so I'm accounting for either
                        if (Object.keys(orderOptions).length > 0) {
                            //for (let idx = 0; idx < orderOptions.length; idx++) {
                            for (let key in Object.keys(orderOptions)) {
                                let orderOption = orderOptions[key]
                                
                                // Get the product option value using the selected option's productOptionValueId
                                let productOptionId = Number(orderOption.productOptionId)
                                let productOptionValueId = Number(orderOption.productOptionValueId)
                                
                                let productOptions = item.data['options']
                                let selectedOptions = productOptions.filter(option => { return Number(option['product_option_id']) === productOptionId })
                                
                                if (selectedOptions instanceof Array && selectedOptions.length > 0) {
                                    let selectedOption = selectedOptions[0]
                                    
                                    // TODO: Make this method static
                                    let optionPrice = CartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                                    optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
                                }
                            }
                        }                        
                    }
                    
                    let orderProductPrice = parseFloat(item.data['price']) + optionTotal
                    
                    let lineTotal = orderProductPrice * quantity
                    let lineTotalWithTax = props.checkoutStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
                    let lineTax = props.checkoutStore.calculateTaxes(lineTotal, item.data['tax_class_id'])
                    
                    orderProduct = assign(orderProduct, item.data, {
                        total: lineTotal,
                        tax: lineTax
                    })

                    let orderTaxRates = props.checkoutStore.getOrderTaxRates()
                    //let orderOptions = props.checkoutStore.getOrderOptions()

                    props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                        action: 'modifyQuantity',
                        orderProduct: orderProduct,
                        orderProductId: orderProductId,
                        //orderOptions: orderOptions,
                        quantityBefore: oldQuantity,
                        quantityAfter: quantity,
                        orderTaxRates: orderTaxRates
                    }, (payload) => {
                        props.checkoutStore.setOrder(payload)
                        //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                    })
                }
            }
        })
        
        CartStore.on('product-options-changed', (item, quantity, product) => {
            console.log('product options changed')
            console.log(item)
            console.log('qty: ' + quantity)

            if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(props.checkoutStore.payload.order.orderId)) {
                    let lineTotal = item['price'] * quantity
                    let lineTotalWithTax = props.checkoutStore.calculateWithTaxes(lineTotal, item['tax_class_id'])
                    let lineTax = props.checkoutStore.calculateTaxes(lineTotal, item['tax_class_id'])
                    
                    let orderProductId = 0
                    // Grab associated orderProduct
                    let orderProduct = props.checkoutStore.payload.orderProducts.filter(orderProduct => {
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
                    let orderTaxRates = props.checkoutStore.getOrderTaxRates()
                    let orderOptions = props.checkoutStore.getOrderOptions(parseInt(product['id']), orderProductId)

                    props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                        action: 'update',
                        //orderProduct: orderProduct,
                        orderProductId: orderProductId,
                        orderOptions: orderOptions,
                        //quantityBefore: oldQuantity,
                        //quantityAfter: quantity,
                        orderTaxRates: orderTaxRates,
                        defaultSettings: this.getDefaultSettings()
                    }, (payload) => {
                        props.checkoutStore.setOrder(payload)
                        //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('item-removed', (item) => {
            console.log('item removed')
            console.log(item)

            if (props.checkoutStore.payload.hasOwnProperty('order') && props.checkoutStore.payload.order !== null) {
                if (props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(props.checkoutStore.payload.order.orderId)) {
                    let orderProductId = 0
                    for (let idx = 0; idx < props.checkoutStore.payload.orderProducts.length; idx++) {
                        if (parseInt(props.checkoutStore.payload.orderProducts[idx].productId) === parseInt(item['id'])) {
                            orderProductId = props.checkoutStore.payload.orderProducts[idx].orderProductId
                        }
                    }

                    let data = assign({}, item, {
                        product_id: parseInt(item['id']),
                        quantity: 0
                    })

                    let orderTaxRates = props.checkoutStore.getOrderTaxRates()
                    //let orderOptions = props.checkoutStore.getOrderOptions()

                    props.checkoutService.updateOrder(props.checkoutStore.payload.order.orderId, {
                        action: 'modifyQuantity',
                        orderProduct: data,
                        orderProductId: orderProductId,
                        quantityAfter: 0,
                        orderTaxRates: orderTaxRates,
                        //orderOptions: orderOptions
                    }, (payload) => {
                        props.checkoutStore.setOrder(payload)
                        //props.checkoutService.fetchOrder(props.checkoutStore.payload.order.orderId)
                    })
                }
            }
        })

        CartStore.on('cart-reset', () => {
            console.log('reset checkout store - cart was reset') // TODO: Have clear and reset, they aren't really the same thing

            props.checkoutService.clearOrder()
        })

        CartStore.on('cart-cleared', () => {
            console.log('clearing checkout store - cart was checked-out') // TODO: Have clear and reset, they aren't really the same thing

            // Don't reset, which deletes order, just create a new order
            props.checkoutService.createOrder({
                action: 'insert'
            })
        })
        
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
            blockUi: false,
            chooseQuantity: false,
            data: { categories: categoryData, products: productData },
            initialSelection: CartStore.getSelection(),
            canSubmit: false,
            createAccount: false,
            editAccount: false,
            showLogin: (typeof props.loggedIn !== 'undefined' && props.loggedIn === true) ? true : false,
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
        if (this.props.customerStore.customer.hasOwnProperty('customer_id') && !isNaN(this.props.customerStore.customer['customer_id'])) {
            let storeCustomerId = parseInt(this.props.customerStore.customer['customer_id'])
            if (storeCustomerId > 0) {
                customerId = storeCustomerId
            }
        }
        
        return {
            config_country_id: 38, // Hard-code to Canada
            config_zone_id: 602, // Hard-code to Alberta
            config_customer_id: customerId,
            config_customer_type: (customerId > 0) ? 3 : 1,
            POS_a_country_id: this.props.checkoutStore.payload.order.paymentCountryId,
            POS_a_zone_id: this.props.checkoutStore.payload.order.paymentZoneId,
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
        
        // Store our stepper instance
        // Stepper maintains its own state and store
        this.stepper.setSteps(this.configureSteps())
        this.stepper.start()
        
        let settings = this.props.settingStore.getSettings().posSettings
        let categoryId = null
        
        if (typeof this.props.match !== 'undefined' && 
            typeof this.props.match.params !== 'undefined' && 
            typeof this.props.match.params.cat !== 'undefined' && !isNaN(this.props.match.params.cat)) {
            console.log('load category id: ' + this.props.match.params.cat)
            categoryId = parseInt(this.props.match.params.cat)
            this.categoryClicked({
                category_id: categoryId
            })
        } else if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
            console.log('pinned category, auto select category : ' + settings['pinned_category'])
            this.categoryClicked(null, {
                category_id: settings['pinned_category_id']
            })
        }
        
        this.stepper.on('item-added', (item, quantity, oldQuantity) => {
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
        })
        
        
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
    
    updateNotes(notes) {
        this.setState({
            notes: notes
        }, () => {
            this.props.checkoutStore.setNotes(notes)
        })
    }
    
    onSaleComplete() {
        // Make sure all modals are closed
        // Set state directly to avoid triggering any actions or processes associated with the show/hide modal methods
        this.setState({
            complete: null,
            charge: null
        })
        
        let settings = this.props.settingStore.getSettings().posSettings
        if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
            console.log('pinned category, auto select category : ' + settings['pinned_category'])
            this.categoryClicked(null, {
                category_id: settings['pinned_category_id']
            })
        } else {
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
        
        console.log('checkout change detected')
        console.log(this.props.customerStore.customer)
        console.log(this.props.customerStore.billingAddress)
        console.log(this.props.customerStore.shippingAddress)
        
        if (typeof this.props.customerStore.customer !== 'undefined' && this.props.customerStore.customer !== null) {
            // Just handle, customer should be set to this.props.checkoutStore
            this.props.checkoutStore.setExistingCustomer()
            
            // Payloard order exists
            if (this.props.checkoutStore.payload.hasOwnProperty('order') && this.props.checkoutStore.payload.order !== null) {
                // Do we update?
                if (this.props.checkoutStore.payload.order.hasOwnProperty('orderId') && 
                    !isNaN(this.props.checkoutStore.payload.order.orderId) &&
                    this.props.checkoutStore.payload.order.orderId > 0) {
                    // No orderId detected in the payload order, let's try create instead
                } else {
                    // TODO: Fix me! I'm hardcoded
                    this.props.checkoutService.createOrder(assign({}, this.props.checkoutStore.payload.order, {
                        action: 'insert',
                        defaultSettings: this.getDefaultSettings()
                    }), (payload) => {
                        this.props.checkoutStore.setOrder(payload)
                        //this.props.checkoutService.fetchOrder(this.props.checkoutStore.payload.order.orderId)
                    })
                }
            // Payload order doesn't exist, we're gonna have to create it
            } else {
                this.props.checkoutService.createOrder(assign({}, {
                    action: 'insert',
                    defaultSettings: this.getDefaultSettings()
                }), (payload) => {
                    this.props.checkoutStore.setOrder(payload)
                    //this.props.checkoutService.fetchOrder(this.props.checkoutStore.payload.order.orderId)
                })
            }
        }
    }
    
    continueShopping() {
        this.setStep('shop')
        
        window.location.hash = '/category'
    }
    
    completeOrder() {
        // Grab the total, by completing the order we're gonna wipe out the totals
        let orderTotal = parseFloat(this.props.checkoutStore.getTotal().value)
        // Create the order
        this.props.checkoutService.doCheckout(
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
    
    itemClicked(e, item) {
        // If the Quick Add button was clicked
        if (e.target.type === 'button') {
            this.addToCartClicked(e, item)
            
            return
        }
        
        let stepId = 'options'
        let stepDescriptor = this.stepper.getStepById(stepId) || null

        if (stepDescriptor !== null) {
            let data = item
            
            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
            // TODO: Replace with mapping!
            this.stepper.addItem(item['product_id'], 1, item)
        }
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
    
    refresh() {
        this.keypad.setField('value', 0)
        
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        this.setState({ canSubmit : !cart.isEmpty() })
    }
    
    reset() {
        this.keypad.setField('value', 0)
        
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.emptyCart()
        
        this.checkoutNotes.component.clear()

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
    
    renderOptions(selectedOptions, itemQty) {
        itemQty = itemQty || 0
        
        let options = []
        
        for (let idx in selectedOptions) {
            let selectedOption = selectedOptions[idx]
            let data = selectedOption.data
            let price = Number(data['price'])
            let lineTotal = price * itemQty
            
            if (price > 0) {
                options.push(<li>{itemQty} x {data.option.name}: <b>{data.name}</b><span style={{'float': 'right'}}>${lineTotal.toFixed(2)}</span></li>)
            } else {
                options.push(<li>{data.option.name}: <b>{data.name}</b><span style={{'float': 'right'}}></span></li>)
            }
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
        if (this.props.checkoutStore.payload.orderTotals instanceof Array && this.props.checkoutStore.payload.orderTotals.length > 0) {
            let orderTotalValue = parseFloat(this.props.checkoutStore.getTotal().value)
            if (!isNaN(orderTotalValue)) {
                orderTotal = orderTotalValue.toFixed(2) 
            }
        }
        // Render PosComponent return
        return (
            <div className='cart-ui'>

                <div id='checkout'>
                    <Grid>
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
                            </Col>
                        </Row>
                    </Grid>
                </div>
                
                <Modal
                  show   = {!!this.state.chooseQuantity}
                  onHide = {this.hideQuantity}>
                    <Modal.Header>
                        <Modal.Title>
                            Enter Item Quantity
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Keypad 
                            ref = {(keypad) => this.popupKeypad = keypad} 
                            displayLabel = {false} />
                        <FormGroup style={{ display: 'block' }}>
                            <Button block bsStyle='success' onClick={this.quickAddToCart}>
                                <h4><i className='fa fa-shopping-cart' /> Add to Order</h4>
                            </Button>
                            <Button block bsStyle='danger' onClick={() => this.setState({ chooseQuantity: false }, () => this.popupKeypad.component.clear())}>
                                <h4><i className='fa fa-ban' /> Cancel</h4>
                            </Button>
                        </FormGroup>
                    </Modal.Body>
                </Modal>

            </div>
        )
    }
}

export default AuthenticatedComponent(PosComponent)
export { PosComponent }