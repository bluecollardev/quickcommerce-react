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

//import ArrayHelper from '../../helpers/Array.js'
import ObjectHelper from '../../helpers/Object.js'
//import StringHelper from '../../helpers/String.js'

import Stepper from '../../components/stepper/BrowserStepper.jsx'

/*import ProductBrowser from './browser/ProductBrowser.jsx'
import BrowserMenu from './browser/BrowserMenu.jsx'
import CustomerPicker from './customer/CustomerPicker.jsx'
import SignInForm from './account/SignInForm.jsx'
import CreditCardForm from './payment/CreditCardForm.jsx'
import CustomerProfile from './customer/AuthenticatedCustomerProfile.jsx'*/

import Notes from '../../components/common/Notes.jsx'

import StringHelper from '../../helpers/String.js'
import ArrayHelper from '../../helpers/Array.js'
import JSONHelper from '../../helpers/JSON.js'
import UrlHelper from '../../helpers/URL.js'

// Pre-configured step types
import CategoryStep from '../../steps/Category.jsx'
import ProductStep from '../../steps/Product.jsx'
import ProductOptionStep from '../../steps/ProductOption.jsx'

import CURRENCY from './Currency.jsx'
import CASH_IN_DRAWER from './CashInDrawer.jsx'

export default (ComposedComponent) => {
    @inject(deps => ({
        steps: deps.steps,
        actions: deps.actions,
        authService: deps.authService,
        customerService: deps.customerService,
        checkoutService: deps.checkoutService,
        settingService: deps.authService,
        loginStore: deps.loginStore,
        userStore: deps.userStore,
        customerStore: deps.customerStore,
        catalogStore: deps.catalogStore,
        cartStore: deps.cartStore,
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
    class PosContext extends Component {
        constructor(props) {
            super(props)
            
            //this.getSelection = this.getSelection.bind(this)
            //this.hasItems = this.hasItems.bind(this)
            this.configureSteps = this.configureSteps.bind(this)
            this.setStep = this.setStep.bind(this)
            //this.addToCart = this.addToCart.bind(this)
            //this.quickAddToCart = this.quickAddToCart.bind(this)
            this.onComplete = this.onComplete.bind(this)
            this.updateNotes = this.updateNotes.bind(this)
            this.updatePaymentMethod = this.updatePaymentMethod.bind(this)
            this.updateShippingMethod = this.updateShippingMethod.bind(this)
            this.continueShopping = this.continueShopping.bind(this)
            //this.refresh = this.refresh.bind(this)
            this.showNewCustomerForm = this.showNewCustomerForm.bind(this)
            this.hideNewCustomerForm = this.hideNewCustomerForm.bind(this)
            this.showEditCustomerForm = this.showEditCustomerForm.bind(this)
            this.hideEditCustomerForm = this.hideEditCustomerForm.bind(this)
            this.changeCustomer = this.changeCustomer.bind(this)
            //this.showLoginForm = this.showLoginForm.bind(this)
            //this.hideLoginForm = this.hideLoginForm.bind(this)
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
            //this.reset = this.reset.bind(this)
            this.categoryClicked = this.categoryClicked.bind(this)
            this.itemClicked = this.itemClicked.bind(this)
            //this.addToCartClicked = this.addToCartClicked.bind(this)
            this.optionClicked = this.optionClicked.bind(this)
            this.itemDropped = this.itemDropped.bind(this)
            this.stepClicked = this.stepClicked.bind(this)
            this.selectPaymentMethod = this.selectPaymentMethod.bind(this)
            this.toggleCustomPaymentAmount = this.toggleCustomPaymentAmount.bind(this)
            this.getChangeAmounts = this.getChangeAmounts.bind(this)
            //this.getTotal = this.getTotal.bind(this)
            this.categoryFilterSelected = this.categoryFilterSelected.bind(this)
            this.openDrawer = this.openDrawer.bind(this)
            this.calculateChange = this.calculateChange.bind(this)
            this.selectChangePreset = this.selectChangePreset.bind(this)
            //this.renderOptions = this.renderOptions.bind(this)
            this.renderPlainTxtOptions = this.renderPlainTxtOptions.bind(this)
            this.renderCashOptions = this.renderCashOptions.bind(this)
            this.renderPaymentOptions = this.renderPaymentOptions.bind(this)
            this.renderEndOfDayReport = this.renderEndOfDayReport.bind(this)
            this.renderPlainTxtOrder = this.renderPlainTxtOrder.bind(this)
            this.renderPlainTxtReceipt = this.renderPlainTxtReceipt.bind(this)
            
            this.getDefaultSettings = this.getDefaultSettings.bind(this)
            
            props.settingStore.on('store-info-loaded', this.onStoreInfoLoaded.bind(this))
            props.settingStore.on('settings-loaded', this.onSettingsLoaded.bind(this))
            
            props.checkoutStore.on('block-ui', this.onBlockUI.bind(this))
            props.checkoutStore.on('unblock-ui', this.onUnblockUI.bind(this))
            props.checkoutStore.on('set-customer', this.onSetCustomer.bind(this))
            props.checkoutStore.on('set-order-status', this.onSetOrderStatus.bind(this))
            props.checkoutStore.on('set-payment-method', this.onSetPaymentMethod.bind(this))
            props.checkoutStore.on('set-shipping-method', this.onSetShippingMethod.bind(this))
            props.checkoutStore.on('set-notes', this.onSetNotes.bind(this))  
            
            props.checkoutStore.on('set-order', this.onSetOrder.bind(this))
            
            // We call this data because it's not a complete item, just a POJO
            props.cartStore.on('item-added', this.onItemAdded.bind(this))
            props.cartStore.on('item-changed', this.onItemChanged.bind(this))
            props.cartStore.on('product-options-changed', this.onProductOptionsChanged.bind(this))
            props.cartStore.on('item-removed', this.onItemRemoved.bind(this))
            props.cartStore.on('cart-reset', this.onCartReset.bind(this))
            props.cartStore.on('cart-cleared', this.onCartCleared.bind(this))
            
            // Store our stepper instance
            // Stepper maintains its own state and store
            this.stepper = new Stepper()
            
            // TODO: For now this code block must be executed in the component wrapped by PosContext
            /*console.log('PosContext is loading settings...')
            props.settingStore.on('settings-loaded', (payload) => {
                console.log('PosContext SETTINGS LOADED')
                props.checkoutStore.settings = payload

                // We only wanna do this once, so stick 'er right up top
               props.checkoutService.createOrder({
                    action: 'insert'
                    //orderTaxRates: this.orderTaxRates
                })
            })*/
            
            /*let categoryData = []
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
            }*/

            this.state = {
                blockUi: false,
                chooseQuantity: false,
                data: { categories: [], products: [] },
                initialSelection: props.cartStore.getSelection(),
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
        
        componentWillUnmount() {
            this.props.settingStore.removeEventListener('store-info-loaded', this.onStoreInfoLoaded)
            this.props.settingStore.removeEventListener('settings-loaded', this.onSettingsLoaded)
            
            this.props.checkoutStore.removeEventListener('block-ui', this.onBlockUI)
            this.props.checkoutStore.removeEventListener('unblock-ui', this.onUnblockUI)
            this.props.checkoutStore.removeEventListener('set-customer', this.onSetCustomer)
            this.props.checkoutStore.removeEventListener('set-order-status', this.onSetOrderStatus)
            this.props.checkoutStore.removeEventListener('set-payment-method', this.onSetPaymentMethod)
            this.props.checkoutStore.removeEventListener('set-shipping-method', this.onSetShippingMethod)
            this.props.checkoutStore.removeEventListener('set-notes', this.onSetNotes)  
            
            // TODO: This is commented out - I forget why...
            //this.props.checkoutStore.removeEventListener('set-order', this.onSetOrder)
            
            // We call this data because it's not a complete item, just a POJO
            this.props.cartStore.removeEventListener('item-added', this.onItemAdded)
            this.props.cartStore.removeEventListener('item-changed', this.onItemChanged)
            this.props.cartStore.removeEventListener('product-options-changed', this.onProductOptionsChanged)
            this.props.cartStore.removeEventListener('item-removed', this.onItemRemoved)
            this.props.cartStore.removeEventListener('cart-reset', this.onCartReset)
            this.props.cartStore.removeEventListener('cart-cleared', this.onCartCleared)
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
    
        configureSteps() {
            // An array of step functions
            let steps = [/*{
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
                    this.categoryBrowser.actions.loadCategories()

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
            },*/
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
                    if (data !== null &&
                        data.hasOwnProperty('category_id') &&
                        !Number.isNaN(data.category_id)) {

                        //this.productBrowser.actions.loadProducts(data.category_id) // TODO: CONST for prop name?
                    } else {
                        //this.productBrowser.actions.loadProducts()
                    }

                    if (done) {
                        // Process checkout if done
                        this.onComplete()
                    }
                },
                validate: (stepId, stepDescriptor, data) => {
                    console.log('validating current step: ' + stepId)
                    console.log(data)
                    
                    // TODO: Replace with mapping!
                    let productId = data['product_id'] || null
                    
                    if (productId === null) {
                        alert('Please select a product to continue')
                        return false
                    }
                    
                    return true
                }
            }/*,
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
                    
                    // TODO: Replace with mapping!
                    if (data !== null && data.hasOwnProperty('product_id') && !Number.isNaN(data['product_id'])) {
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
            },*/
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
            
            return steps
        }
        
        changeCustomer(item) {
            //this.props.customerService.setCustomer(item)
            this.props.actions.checkout.setExistingCustomer({ customer: item })
        }
        
        updateNotes(notes) {
            this.setState({
                notes: notes
            }, () => {
                this.props.checkoutStore.setNotes(notes)
            })
        }
        
        updatePaymentMethod(code, method) {
            this.props.checkoutStore.setPaymentMethod(code, method)
        }
        
        updateShippingMethod(code, method) {
            this.props.checkoutStore.setShippingMethod(code, method)
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
        
        showChargeModal(onComplete) {
            this.setState({ 
                charge: 1,
                checkout: {
                    system: {
                        currency: CURRENCY,
                        drawer: CASH_IN_DRAWER
                    },
                    store: this.props.settingStore.getStoreData(),
                    order: this.props.checkoutStore.getOrderDetails(),
                    items: this.props.cartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                    totals: this.props.checkoutStore.getTotals(),
                    total: this.props.checkoutStore.getTotal()
                }
            }, () => {
                onComplete()
            })
        }
        
        hideChargeModal() {
            this.setState({ charge: null })
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
            this.props.starMicronicsStore.printReceipt(this.renderPlainTxtReceipt())
        }
        
        printOrder() {
            // Send output as plain text string
            this.props.starMicronicsStore.printOrder(this.renderPlainTxtOrder())
        }
        
        debugReceipt() {
            // Send output as plain text string
            alert(JSON.stringify(this.renderPlainTxtReceipt()))
        }
        
        debugOrder() {
            // Send output as plain text string
            alert(JSON.stringify(this.renderPlainTxtOrder()))
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
                this.props.starMicronicsStore.printReport(this.renderEndOfDayReport(payload))

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
                    store: this.props.settingStore.getStoreData(),
                    order: this.props.checkoutStore.getOrderDetails(),
                    items: this.props.cartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                    totals: this.props.checkoutStore.getTotals(),
                    total: this.props.checkoutStore.getTotal()
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
        changeCustomer(item) {
            //this.props.customerService.setCustomer(item)
            this.props.actions.checkout.setExistingCustomer({ customer: item })
        }
        
        updateNotes(notes) {
            this.setState({
                notes: notes
            }, () => {
                this.props.checkoutStore.setNotes(notes)
            })
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
        
        updatePaymentMethod(code, method) {
            this.props.checkoutStore.setPaymentMethod(code, method)
        }
        
        toggleCustomPaymentAmount() {
            this.setState({
                customPaymentAmount: !this.state.customPaymentAmount
            })
        }
        
        updateShippingMethod(code, method) {
            this.props.checkoutStore.setShippingMethod(code, method)
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
            let orderTotal = parseFloat(this.props.checkoutStore.getTotal().value)
            
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
            let orderTotal = parseFloat(this.props.checkoutStore.getTotal().value)
            
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
            let total = parseFloat(this.props.checkoutStore.getTotal().value)
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

            let headerLines = []
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Tel. 780.244.0ACE</span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>info@acecoffeeroasters.com</span>)
            
            let local = new Date().toISOString()
            let date = local.slice(0, 10)
            let time = local.slice(11).split('.')[0]
            
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{[date, time].join(', ')}</span>)

            output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

            output.push(<hr />)
            output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{[this.state.paymentMethod, 'Sale'].join(' ')}</h4></span>)
            output.push(<br />)
            //output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

            // We need a max line chars algo so we can make stuff line up

            // Items
            let items = this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
            for (let idx = 0; idx < items.length; idx++) {
                let item = items[idx]
                let data = item.data
                let price = 0.00
                let optionTotal = 0.00
                let lineTotal = 0.00
                
                price = (typeof data['price'] !== 'undefined' && !isNaN(data.price)) ? Number(data.price) : 0.00
                lineTotal = price * item.quantity
                
                // Don't include option prices in receipt, we want to detail the options line by line as well
                lineTotal = (lineTotal).toFixed(2)
                
                //lineTotal = (lineTotal + optionTotal).toFixed(2)
                
                let model = data['model']
                if (typeof item.options !== 'undefined' && 
                    item.options instanceof Array && 
                    item.options.length > 0) {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            <span>{item.quantity} x {model}</span>
                            <span style={{'float': 'right'}}>${lineTotal}</span>
                            {this.renderOptions(items[idx].options, item.quantity)}
                        </span>
                    )
                } else {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            <span>{item.quantity} x {model}</span>
                            <span style={{'float': 'right'}}>${lineTotal}</span>
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

            let headerLines = []
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>{store.name}</h4></span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>10055 - 80 Ave NW</span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Edmonton, Alberta T6E 1T4</span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>Tel. 780.244.0ACE</span>)
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>info@acecoffeeroasters.com</span>)
            
            let local = new Date().toISOString()
            let date = local.slice(0, 10)
            let time = local.slice(11).split('.')[0]
            
            headerLines.push(<span style={{'display': 'block'}} className='receipt-line-item'>{[date, time].join(', ')}</span>)

            output.push(<div className='receipt-header' style={{'text-align': 'center'}}>{headerLines}</div>)

            output.push(<hr />)
            output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Sale</h4></span>)
            output.push(<br />)
            output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

            // We need a max line chars algo so we can make stuff line up

            // Items - TODO: this code below is also repeated in renderReceipt
            let items = this.state.prevCheckout.items // Annoying that this returns an object but below in totals we get an array...
            for (let idx = 0; idx < items.length; idx++) {
                let item = items[idx]
                let data = item.data
                let price = 0.00
                let optionTotal = 0.00
                let lineTotal = 0.00
                
                price = (typeof data['price'] !== 'undefined' && !isNaN(data.price)) ? Number(data.price) : 0.00
                lineTotal = price * item.quantity
                
                // Don't include option prices in receipt, we want to detail the options line by line as well
                lineTotal = (lineTotal).toFixed(2)
                
                //lineTotal = (lineTotal + optionTotal).toFixed(2)
                
                let model = data['model']
                if (typeof item.options !== 'undefined' && 
                    item.options instanceof Array && 
                    item.options.length > 0) {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            <span>{item.quantity} x {model}</span>
                            <span style={{'float': 'right'}}>${lineTotal}</span>
                            {this.renderOptions(items[idx].options, item.quantity)}
                        </span>
                    )
                } else {
                    output.push(
                        <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                            <span>{item.quantity} x {model}</span>
                            <span style={{'float': 'right'}}>${lineTotal}</span>
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

            let headerLines = []
            headerLines.push('ACE Coffee Roasters')
            headerLines.push('10055 - 80 Ave NW')
            headerLines.push('Edmonton, Alberta T6E 1T4')
            headerLines.push('Tel. 780.244.0ACE')
            headerLines.push('info@acecoffeeroasters.com')
            
            let local = new Date().toISOString()
            let date = local.slice(0, 10)
            let time = local.slice(11).split('.')[0]
            
            headerLines.push([date, time].join(', '))

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
            
            let headerLines = []
            headerLines.push('ORDER')
            
            let local = new Date().toISOString()
            let date = local.slice(0, 10)
            let time = local.slice(11).split('.')[0]
            
            headerLines.push([date, time].join(', '))
            
            output.push(...headerLines) // ES6 extend array

            output.push('\n')
            output.push('ITEMS')
            output.push('\n')

            // We need a max line chars algo so we can make stuff line up

            let prev = this.state.prevCheckout || null
            // Items
            let items = (prev !== null) ? prev.items : this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
            for (let idx = 0; idx < items.length; idx++) {
                let line = [
                    items[idx].quantity + ' x ',
                    items[idx].data['model']
                ].join('  ')

                output.push(line)
                
                if (typeof items[idx].options !== 'undefined' && 
                    items[idx].options instanceof Array && 
                    items[idx].options.length > 0) {
                    output = output.concat(this.renderPlainTxtOptions(items[idx].options, null, false))
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

            let headerLines = []
            headerLines.push('ACE Coffee Roasters')
            headerLines.push('10055 - 80 Ave NW')
            headerLines.push('Edmonton, Alberta T6E 1T4')
            headerLines.push('Tel. 780.244.0ACE')
            headerLines.push('info@acecoffeeroasters.com')
            
            let local = new Date().toISOString()
            let date = local.slice(0, 10)
            let time = local.slice(11).split('.')[0]
            
            headerLines.push([date, time].join(', '))

            output.push(...headerLines) // ES6 extend array

            output.push('\n')
            output.push('Sale')
            output.push('\n')
            output.push('Qty        Item        Total')

            // We need a max line chars algo so we can make stuff line up
            
            let prev = this.state.prevCheckout || null
            // Items
            let items = (prev !== null) ? prev.items : this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
            for (let idx = 0; idx < items.length; idx++) {
                let item = items[idx]
                
                let line = [
                    item.quantity + ' x ',
                    item.data['model'],
                    '$' + (parseFloat(item.data['price']) * item.quantity).toFixed(2)
                ].join('  ')

                output.push(line)
                
                if (typeof item.options !== 'undefined' && 
                    item.options instanceof Array && 
                    item.options.length > 0) {
                    
                    let options = items[idx].options
                    options = options.filter(option => {
                        // Only render options that have a price for the receipt
                        return option.data['price'] !== false
                    })
                    
                    output = output.concat(this.renderPlainTxtOptions(options, items[idx].quantity, true))
                }
            }

            output.push('\n')
            
            // Totals
            let totals = []
            let total = null
            
            if (prev !== null) {
                // Totals
                totals = this.state.prevCheckout.totals || []
                total = this.state.prevCheckout.total || null
            } else {
                // Totals
                totals = this.state.checkout.totals || []
                total = this.state.checkout.total || null
            }    

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
        
        renderPlainTxtOptions(selectedOptions, itemQuantity, displayPrice) {
            itemQuantity = itemQuantity || null
            displayPrice = displayPrice || false
            
            let options = []
            
            for (let idx in selectedOptions) {
                let selectedOption = selectedOptions[idx]
                let data = selectedOption.data
                let price = Number(data['price'])
                let lineTotal = price * itemQuantity
                
                let line = []
                
                if (itemQuantity !== null && !isNaN(itemQuantity)) {
                    line.push(itemQuantity + ' x ')
                } else {
                    line.push(selectedOption.quantity + ' x ')
                }
                
                line.push(data.option.name + ' (' + data.name + ')')
                
                if (price > 0 && displayPrice) {
                    line.push('     ' + ['$', lineTotal.toFixed(2)].join(''))
                }
                
                options.push(line.join(''))
            }
            
            return options
        }
        
        // Simply triggers this.props.checkoutStore method
        openDrawer() {
            this.props.starMicronicsStore.openDrawer()
        }
        
        // Event listeners
        onBlockUI() {
            this.setState({
                blockUi: true
            })
        }
        
        onUnblockUI() {
            this.setState({
                blockUi: true
            })
        }
        
        onStoreInfoLoaded(id, payload) {
            this.props.checkoutStore.stores[id] = payload
        }
        
        onSettingsLoaded(payload) {
            // PosContext.onSettingsLoaded
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            checkoutStore.settings = payload
            // We only wanna do this once, so stick 'er right up top
            checkoutService.createOrder({
                action: 'insert'
                //orderTaxRates: this.orderTaxRates
            })
        }
        
        onSetCustomer() {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            console.log('checkout customer change detected')
            console.log(props.customerStore.customer)
            //console.log(props.customerStore.billingAddress)
            //console.log(props.customerStore.shippingAddress)
            
            if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
                // Just handle, customer should be set to checkoutStore
                checkoutStore.setExistingCustomer(customerStore.customer)
                
                // Payloard order exists
                if (checkoutStore.payload.hasOwnProperty('order') && 
                    checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(checkoutStore.payload.order.orderId) &&
                        checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        checkoutService.updateOrder(checkoutStore.payload.order.orderId, assign({}, checkoutStore.payload.order, {
                            action: 'update',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            checkoutStore.setOrder(payload)
                            //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    } else {
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        checkoutService.createOrder(assign({}, checkoutStore.payload.order, {
                            action: 'insert',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            checkoutStore.setOrder(payload)
                            //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                        })
                    }
                // Payload order doesn't exist, we're gonna have to create it
                } else {
                    // TODO: Fix me! I'm hardcoded
                    // Change country and zone to customer default address
                    checkoutService.createOrder(assign({}, {
                        action: 'insert',
                        defaultSettings: this.getDefaultSettings()
                    }), (payload) => {
                        checkoutStore.setOrder(payload)
                        //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                    })
                }
            }
        }
        
        onSetOrderStatus() {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
                // Just handle, customer should be set to checkoutStore
                checkoutStore.setExistingCustomer(customerStore.customer)
                
                // Payloard order exists
                if (checkoutStore.payload.hasOwnProperty('order') && checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(checkoutStore.payload.order.orderId) &&
                        checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        checkoutService.updateOrder(checkoutStore.payload.order.orderId, assign({}, checkoutStore.payload.order, {
                            action: 'updateOrderStatus',
                            defaultSettings: this.getDefaultSettings(),
                        }), (payload) => {
                            checkoutStore.setOrder(payload)
                            //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        }
        
        onSetPaymentMethod() {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            if (typeof props.customerStore.customer !== 'undefined' && props.customerStore.customer !== null) {
                // Just handle, customer should be set to checkoutStore
                checkoutStore.setExistingCustomer(customerStore.customer)
                
                // Payloard order exists
                if (checkoutStore.payload.hasOwnProperty('order') && checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(checkoutStore.payload.order.orderId) &&
                        checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        checkoutService.updateOrder(checkoutStore.payload.order.orderId, assign({}, checkoutStore.payload.order, {
                            action: 'updatePaymentMethod',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            checkoutStore.setOrder(payload)
                            //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        }
        
        onSetShippingMethod() {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
                // Just handle, customer should be set to checkoutStore
                checkoutStore.setExistingCustomer(customerStore.customer)
                
                // Payloard order exists
                if (checkoutStore.payload.hasOwnProperty('order') && checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(checkoutStore.payload.order.orderId) &&
                        checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        checkoutService.updateOrder(checkoutStore.payload.order.orderId, assign({}, checkoutStore.payload.order, {
                            action: 'updateShippingMethod',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            checkoutStore.setOrder(payload)
                            //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        }
        
        onSetNotes() {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
                // Just handle, customer should be set to checkoutStore
                checkoutStore.setExistingCustomer(customerStore.customer)
                
                // Payloard order exists
                if (checkoutStore.payload.hasOwnProperty('order') && checkoutStore.payload.order !== null) {
                    // Do we update?
                    if (checkoutStore.payload.order.hasOwnProperty('orderId') && 
                        !isNaN(checkoutStore.payload.order.orderId) &&
                        checkoutStore.payload.order.orderId > 0) {
                        
                        // TODO: Fix me! I'm hardcoded
                        // Change country and zone to customer default address
                        checkoutService.updateOrder(checkoutStore.payload.order.orderId, assign({}, checkoutStore.payload.order, {
                            action: 'updateNotes',
                            defaultSettings: this.getDefaultSettings()
                        }), (payload) => {
                            checkoutStore.setOrder(payload)
                            //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                        })
                        // No orderId detected in the payload order, let's try create instead
                    }
                }
            }
        }
        
        // TODO: This was commented out - I forget why...
        onSetOrder() {
            /*let { customerStore, checkoutStore, checkoutService } = this.props
            
            console.log('checkout change detected')
            console.log(customerStore.customer)
            console.log(customerStore.billingAddress)
            console.log(customerStore.shippingAddress)
            
            if (typeof customerStore.customer !== 'undefined' && customerStore.customer !== null) {
                // Just handle, customer should be set to checkoutStore
                checkoutStore.setExistingCustomer(customerStore.customer)
                
                if (checkoutStore.orderIsSet()) {
                    checkoutService.updateOrder(checkoutStore.payload.order.orderId, assign({}, checkoutStore.payload.order, {
                        action: 'update',
                        defaultSettings: this.getDefaultSettings()
                    }), (payload) => {
                        checkoutStore.setOrder(payload)
                        //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                    })
                }
            }*/
        }
        
        onItemAdded(itemId, quantity, item) {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            console.log('item added to order')
            console.log(item)
            
            if (checkoutStore.orderIsSet()) {
                let orderProduct = assign({}, item.data, {
                    product_id: parseInt(itemId),
                    quantity: quantity
                })
                
                let optionTotal = 0.00 
                // Get the prices off of the selected options and add them to the product price
                let orderOptions = checkoutStore.getOrderOptions(parseInt(itemId)) || null
                
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
                                let optionPrice = this.cartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                                optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
                            }
                        }
                    }                        
                }
                
                let orderProductPrice = parseFloat(item.data['price']) + optionTotal
                
                let orderTaxRates = checkoutStore.getOrderTaxRates()
                
                let lineTotal = orderProductPrice * quantity
                let lineTotalWithTax = checkoutStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
                let lineTax = checkoutStore.calculateTaxes(lineTotal, item.data['tax_class_id'])

                // We're mutating the supplied data object by design
                orderProduct = assign(orderProduct, {
                    price: orderProductPrice,
                    total: lineTotal,
                    tax: lineTax
                })

                checkoutService.updateOrder(checkoutStore.payload.order.orderId, {
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
                        
                        // Update our this.cartStore
                        //this.cartStore.updateItem()
                    }
                    
                    checkoutStore.setOrder(payload)
                    //checkoutService.fetchOrder(checkoutStore.payload.order.orderId, onSuccess)
                })
            } else {
                // Create a new order
            }
        }
        
        onItemChanged(item, quantity, oldQuantity) {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            console.log('item quantity changed')
            console.log(item)
            console.log('qty: ' + quantity)
            console.log('old qty: ' + oldQuantity)
            
            // TODO: Move this whole chunk of logic to the CartAction, or a Cart ActionCreator
            if (checkoutStore.orderIsSet()) {
                let orderProductId = 0
                for (let idx = 0; idx < checkoutStore.payload.orderProducts.length; idx++) {
                    // TODO: Use mappings!
                    if (parseInt(checkoutStore.payload.orderProducts[idx].productId) === parseInt(item.data['product_id'])) {
                        orderProductId = checkoutStore.payload.orderProducts[idx].orderProductId
                    }
                }
                
                // TODO: Use mappings!
                let orderProduct = assign({}, item.data, {
                    product_id: parseInt(item.data['product_id']),
                    quantity: quantity
                })
                
                let optionTotal = 0.00 
                // Get the prices off of the selected options and add them to the product price
                // TODO: Use mappings!
                let orderOptions = checkoutStore.getOrderOptions(parseInt(item.data['product_id'])) || null
                
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
                                let optionPrice = this.cartStore.getOptionPrice(item.data, selectedOption, productOptionValueId)
                                optionTotal += (!isNaN(optionPrice)) ? Number(optionPrice) : 0
                            }
                        }
                    }                        
                }
                
                let orderProductPrice = parseFloat(item.data['price']) + optionTotal
                
                let lineTotal = orderProductPrice * quantity
                let lineTotalWithTax = checkoutStore.calculateWithTaxes(lineTotal, item.data['tax_class_id'])
                let lineTax = checkoutStore.calculateTaxes(lineTotal, item.data['tax_class_id'])
                
                orderProduct = assign(orderProduct, item.data, {
                    total: lineTotal,
                    tax: lineTax
                })

                let orderTaxRates = checkoutStore.getOrderTaxRates()
                //let orderOptions = checkoutStore.getOrderOptions()

                checkoutService.updateOrder(checkoutStore.payload.order.orderId, {
                    action: 'modifyQuantity',
                    orderProduct: orderProduct,
                    orderProductId: orderProductId,
                    //orderOptions: orderOptions,
                    quantityBefore: oldQuantity,
                    quantityAfter: quantity,
                    orderTaxRates: orderTaxRates
                }, (payload) => {
                    checkoutStore.setOrder(payload)
                    //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                })
            }
        }
        
        onProductOptionsChanged(item, quantity, product) {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            console.log('product options changed')
            console.log(item)
            console.log('qty: ' + quantity)

            if (checkoutStore.orderIsSet()) {
                let lineTotal = item['price'] * quantity
                let lineTotalWithTax = checkoutStore.calculateWithTaxes(lineTotal, item['tax_class_id'])
                let lineTax = checkoutStore.calculateTaxes(lineTotal, item['tax_class_id'])
                
                let orderProductId = 0
                // Grab associated orderProduct
                let orderProduct = checkoutStore.payload.orderProducts.filter(orderProduct => {
                    // TODO: Use mappings
                    return orderProduct.productId === parseInt(product['product_id'])
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
                let orderTaxRates = checkoutStore.getOrderTaxRates()
                // TODO: Use mappings!
                let orderOptions = checkoutStore.getOrderOptions(parseInt(product['product_id']), orderProductId)

                checkoutService.updateOrder(checkoutStore.payload.order.orderId, {
                    action: 'update',
                    //orderProduct: orderProduct,
                    orderProductId: orderProductId,
                    orderOptions: orderOptions,
                    //quantityBefore: oldQuantity,
                    //quantityAfter: quantity,
                    orderTaxRates: orderTaxRates,
                    defaultSettings: this.getDefaultSettings()
                }, (payload) => {
                    checkoutStore.setOrder(payload)
                    //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                })
            }
        }
        
        onItemRemoved(item) {
            let { customerStore, checkoutStore, checkoutService } = this.props
            
            console.log('item removed')
            console.log(item)

            if (checkoutStore.orderIsSet()) {
                let orderProductId = 0
                for (let idx = 0; idx < checkoutStore.payload.orderProducts.length; idx++) {
                    if (parseInt(checkoutStore.payload.orderProducts[idx].productId) === parseInt(item['id'])) {
                        orderProductId = checkoutStore.payload.orderProducts[idx].orderProductId
                    }
                }

                let data = assign({}, item, {
                    product_id: parseInt(item['id']),
                    quantity: 0
                })

                let orderTaxRates = checkoutStore.getOrderTaxRates()
                //let orderOptions = checkoutStore.getOrderOptions()

                checkoutService.updateOrder(checkoutStore.payload.order.orderId, {
                    action: 'modifyQuantity',
                    orderProduct: data,
                    orderProductId: orderProductId,
                    quantityAfter: 0,
                    orderTaxRates: orderTaxRates,
                    //orderOptions: orderOptions
                }, (payload) => {
                    checkoutStore.setOrder(payload)
                    //checkoutService.fetchOrder(checkoutStore.payload.order.orderId)
                })
            }
        }
        
        onCartReset() {
            console.log('reset checkout store - cart was reset') // TODO: Have clear and reset, they aren't really the same thing

            this.props.checkoutService.clearOrder()
        }
        
        onCartCleared() {
            console.log('clearing checkout store - cart was checked-out') // TODO: Have clear and reset, they aren't really the same thing

            // Don't reset, which deletes order, just create a new order
            this.props.checkoutService.createOrder({
                action: 'insert'
            })
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
                this.props.checkoutStore.setExistingCustomer(customerStore.customer)
                
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
        
        render() {
            let props = Object.assign({}, this.props, {
                //getSelection: this.getSelection,
                //hasItems: this.hasItems,
                setStep: this.setStep,
                configureSteps: this.componentConfigureSteps,
                //addToCart: this.addToCart,
                //quickAddToCart: this.quickAddToCart,
                onComplete: this.onComplete,
                updateNotes: this.updateNotes,
                updatePaymentMethod: this.updatePaymentMethod,
                updateShippingMethod: this.updateShippingMethod,
                continueShopping: this.continueShopping,
                //refresh: this.refresh,
                showNewCustomerForm: this.showNewCustomerForm,
                hideNewCustomerForm: this.hideNewCustomerForm,
                showEditCustomerForm: this.showEditCustomerForm,
                hideEditCustomerForm: this.hideEditCustomerForm,
                changeCustomer: this.changeCustomer,
                //showLoginForm: this.showLoginForm,
                //hideLoginForm: this.hideLoginForm,
                showOrder: this.showOrder,
                hideModal: this.hideModal,
                showScanModal: this.showScanModal,
                hideScanModal: this.hideScanModal,
                showCodeModal: this.showCodeModal,
                showChargeModal: this.showChargeModal,
                hideChargeModal: this.hideChargeModal,
                completeOrder: this.completeOrder,
                showReceiptModal: this.showReceiptModal,
                hideReceiptModal: this.hideReceiptModal,
                debugReceipt: this.debugReceipt,
                debugOrder: this.debugOrder,
                printReceipt: this.printReceipt,
                printOrder: this.printOrder,
                printReport: this.printReport,
                showCompleteModal: this.showCompleteModal,
                hideCompleteModal: this.hideCompleteModal,
                onSaleComplete: this.onSaleComplete,
                //reset: this.reset,
                categoryClicked: this.categoryClicked,
                itemClicked: this.itemClicked,
                //addToCartClicked: this.addToCartClicked,
                optionClicked: this.optionClicked,
                itemDropped: this.itemDropped,
                stepClicked: this.stepClicked,
                selectPaymentMethod: this.selectPaymentMethod,
                toggleCustomPaymentAmount: this.toggleCustomPaymentAmount,
                getChangeAmounts: this.getChangeAmounts,
                //getTotal: this.getTotal,
                categoryFilterSelected: this.categoryFilterSelected,
                openDrawer: this.openDrawer,
                calculateChange: this.calculateChange,
                selectChangePreset: this.selectChangePreset,
                renderReceipt: this.renderReceipt,
                renderCachedReceipt: this.renderCachedReceipt,
                renderPlainTxtOptions: this.renderPlainTxtOptions,
                renderCashOptions: this.renderCashOptions,
                renderPaymentOptions: this.renderPaymentOptions,
                renderEndOfDayReport: this.renderEndOfDayReport,
                renderPlainTxtOrder: this.renderPlainTxtOrder,
                renderPlainTxtReceipt: this.renderPlainTxtReceipt,
            })
            
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
            
            return (
                <ComposedComponent
                    {...props}
                    steps = {steps}
                    state = {this.state}
                    stepper = {this.stepper}
                    ref = {(component) => this.component = component}>
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
                                    
                                    <br />
                                    
                                    <FormGroup>
                                        <Button bsStyle='warning' block onClick={this.debugReceipt}>
                                            <h4><i className='fa fa-bug' /> Debug Receipt</h4>
                                        </Button>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button bsStyle='warning' block onClick={this.debugOrder}>
                                            <h4><i className='fa fa-bug' /> Debug Order</h4>
                                        </Button>
                                    </FormGroup>
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
                                        <Alert>
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

                    {/*<Modal
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
                    </Modal>*/}
                </ComposedComponent>
            )
        }
    }
    
    return PosContext
}