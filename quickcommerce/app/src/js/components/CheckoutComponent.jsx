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

import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import AuthenticatedComponent from './AuthenticatedComponent.jsx'

import DragDropContainer   from './cart/DragDropContainer.jsx'
import DragDropCartRow     from './cart/DragDropCartRow.jsx'
import CartDropTarget      from './cart/CartDropTarget.jsx'
import CartDragItem        from './cart/CartDragItem.jsx'
import CatalogRow          from './catalog/CatalogRow.jsx'

import Stepper from './stepper/BrowserStepper.jsx'
import BrowserActions from '../actions/BrowserActions.jsx'
import BrowserStore from '../stores/BrowserStore.jsx'

import ProductActions from '../actions/ProductActions.jsx'

import ProductBrowser      from './browser/ProductBrowser.jsx'
import BrowserMenu         from './browser/BrowserMenu.jsx'
import CustomerPicker      from './customer/CustomerPicker.jsx'
import NewAccountForm      from './account/NewAccountForm.jsx'
import EditAccountForm     from './account/EditAccountForm.jsx'
import SignInForm          from './account/SignInForm.jsx'
import CreditCardForm      from './payment/CreditCardForm.jsx'
import CustomerProfile     from './customer/AuthenticatedCustomerFullProfile.jsx'

//import Keyboard            from '../modules/Keyboard.jsx'
import Cart                from '../modules/Cart.jsx'
import InternalCartStore   from '../modules/CartStore.jsx'

// Dirty global hack to maintain store instance until I refactor 
// this component to use context or switch from flux to redux
window.CartStore = (typeof window.CartStore === 'undefined') ? InternalCartStore : window.CartStore

let CartStore = window.CartStore

import CheckoutStore       from '../stores/CheckoutStore.jsx' // Will need for totals and stuff
import ProductStore       from '../stores/ProductStore.jsx' // Will need for totals and stuff
import SettingStore        from '../stores/SettingStore.jsx'

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

const CheckoutComponent = React.createClass({
    getInitialState() {
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

        return {
            blockUi: false,
            chooseQuantity: false,
            data: { categories: categoryData, products: productData },
            initialSelection : CartStore.getSelection(),
            cartIntro: true,
            canSubmit: false,
            createAccount: false,
            editAccount: false,
            showLogin: (typeof this.props.logged !== 'undefined' && this.props.logged === true) ? true : false,
            checkoutMode: 'pos', // [cart|pos]
            step: 'shop', // [shop|cart|checkout|shipping|confirm] Not finalized, subject to change!
            purchase: null,
            cart: 0,
            changeAmount: 0.00,
            cashAmount: 0.00,
            settings: {}
        }
    },
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
            showLogin: (typeof this.props.logged !== 'undefined' && this.props.logged === true) ? true : false,
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
    },    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {   
        let categoryId = null
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
    },
    getSelection() {
        return CartStore.getSelection()
    },
    hasItems() {
        let selection = CartStore.getSelection() || null
        return (selection instanceof Array && selection.length > 0)
    },
    configureSteps() {
        // An array of step functions
        return [{
            config: assign({}, CategoryStep, {
                stepId: 'shop',
                indicator: '1',
                title: 'Choose Category'
            }),
            action: (step, data, done) => {
                // Execute action
                BrowserActions.loadCategories()

                if (done) {
                    // Process checkout if done
                    this.onComplete()
                }
            }
        },
        {
            config: assign({}, ProductStep, {
                stepId: 'cart',
                indicator: '2',
                title: 'Choose Product'
            }),
            action: (step, data, done) => {
                data = data || null
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
            }
        },
        {
            config: assign({}, ProductOptionStep, {
                stepId: 'options',
                indicator: '3',
                title: 'Choose Options'
            }),
            action: (step, data, done) => {
                data = data || null
                console.log('option step')
                if (data !== null &&
                    data.hasOwnProperty('id') &&
                    !Number.isNaN(data.id)) {

                    BrowserActions.loadOptions(data) // TODO: CONST for prop name?
                } else {
                    BrowserActions.loadOptions()
                }

                if (done) {
                    // Process checkout if done
                    this.onComplete()
                }
            }
        },
        {
            config: {
                stepId: 'checkout',
                indicator: '4',
                title: 'Review Your Order'
            },
            // 'action' must be defined, even if empty
            action: (step, data, done) => {
            }
        },
        {
            config: {
                stepId: 'confirm',
                indicator: '5',
                title: 'Confirm Order'
            },
            // 'action' must be defined, even if empty
            action: (step, data, done) => {
            }
        }]
    },
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
    },
    setStep(step) {
        //this.props.stepper.setStep(this.props.stepper.getIndex(arguments[0]))

        this.setState({ step: step })
    },
    continueShopping() {
        this.setStep('shop')
        
        window.location.hash = '/category'
    },
    refresh() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart

        this.setState({ canSubmit : !cart.isEmpty() })
    },
    showNewAccountForm() {
        this.hideLoginForm()
        this.setState({ createAccount: true })
    },
    hideNewAccountForm() {
        this.showLoginForm()
        this.setState({ createAccount: false })
    },
    showEditAccountForm() {
        this.hideLoginForm()
        this.setState({ editAccount: true })
    },
    hideEditAccountForm() {
        this.showLoginForm()
        this.setState({ editAccount: false })
    },
    showLoginForm() {
        this.setState({ showLogin: true })
    },
    hideLoginForm() {
        this.setState({ showLogin: false })
    },
    showOrder() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        this.setState({ purchase: cart.getSelection() })
    },
    /*showCartModal() {
        this.setState({ cart: 1 })
    },
    hideCartModal() {
        this.setState({ cart: null })
    },*/
    showChargeModal() {
        this.setState({ charge: 1 })
    },
    hideChargeModal() {
        // Create the order
        CheckoutStore.doCheckout(
        (data) => {
            // onSuccess handl
            this.setState({ charge: null })
            //this.showCompleteModal()
        },
        (data) => {
            // onError handler

            this.setState({ charge: null })
            //this.showCompleteModal()
        })
    },
    showReceiptModal() {
        // Hide the current modal
        this.hideCompleteModal()

        // Trigger receipt display
        this.setState({ receipt: 1 })
    },
    hideReceiptModal() {
        // Hide the receipt
        this.setState({ receipt: null })

        this.showCompleteModal()
    },
    showCompleteModal() {
        // Hide the charge modal, if for any reason it is visible
        this.hideChargeModal()

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
        })
    },
    hideCompleteModal() {
        this.setState({
            complete: null
        })
    },
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
        let instance = this.stepper.getStepById(stepId)

        if (typeof instance !== 'undefined' && instance !== 'null') {
            let data = {}
            let isEnded = false

            // Execute the step handler
            instance.execute(data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
        
        window.location.hash = '/category'
    },
    reset() {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        cart.emptyCart()

        let stepId = 'shop'
        let instance = this.stepper.getStepById(stepId)

        if (typeof instance !== 'undefined' && instance !== 'null') {
            let data = {}
            let isEnded = false

            // Execute the step handler
            instance.execute(data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
    },
    categoryClicked(item) {
        let stepId = 'cart'
        let instance = this.stepper.getStepById(stepId)

        if (typeof instance !== 'undefined' && instance !== 'null') {
            let data = item
            let isEnded = false

            // Execute the step handler
            instance.execute(data, isEnded)

            // Update our component state
            this.setStep(stepId)
            
            let scrollDuration = 111
            let scrollStep = -window.scrollY / (scrollDuration / 15),
                scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep)
                } else clearInterval(scrollInterval)
            }, 15)
        }
    },
    itemClicked(item) {
        // Block the UI to prevent double click, which we don't want!
        /*this.setState({
            blockUi: true
        })*/

        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        
        // TODO: If POS mode... add switch
        //cart.addItem(item.id, 1, item)
        ProductActions.setProduct(item)
        
        window.location.hash = '/product'
        
        let scrollDuration = 111
        let scrollStep = -window.scrollY / (scrollDuration / 15),
            scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep)
            } else clearInterval(scrollInterval)
        }, 15)
    },
    optionClicked(item) {
        let stepId = 'checkout'
        let instance = this.stepper.getStepById(stepId)

        if (typeof instance !== 'undefined' && instance !== 'null') {
            let data = item
            let isEnded = false

            // Execute the step handler
            instance.execute(data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }

        //let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        //cart.addItem(item.id, 1, item)
    },
    itemDropped(item) {
        let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart

        cart.addItem(item, 1, products[item])
    },
    stepClicked(stepProps) {
        // Get the BrowserStepDescriptor instance by stepId (shop|cart|checkout|etc).
        // We can't get it by index because the Step argument for this method is the config prop
        // provided to the Step component, not an instance of BrowserStepDescriptor.
        // Maybe I'll change this later...
        if (this.stepper.getSteps() instanceof Array) {
            let instance = this.stepper.getStepById(stepProps.stepId)

            if (typeof instance !== 'undefined' && instance !== 'null') {
                let data = {}
                let isEnded = false

                // Execute the step handler
                instance.execute(data, isEnded)

                // Update our component state
                this.setStep(stepProps.stepId)
            }
        }
    },
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
    },
    getTotal() {
        let total = 0

        if (typeof this.refs.cart !== 'undefined' && this.refs.cart !== null) {
            let cart = (typeof this.refs.cart.getDecoratedComponentInstance === 'function') ? this.refs.cart.getDecoratedComponentInstance() : this.refs.cart
        }

        return total
    },
    categoryFilterSelected(categoryId, e) {
        categoryId = (!Number.isNaN(parseInt(categoryId))) ? parseInt(categoryId) : null // Ensure conversion

        let stepId = 'cart'
        let instance = this.stepper.getStepById(stepId)

        if (typeof instance !== 'undefined' && instance !== 'null') {
            let data = {
                category_id: categoryId
            }

            let isEnded = false

            // Execute the step handler
            instance.execute(data, isEnded)

            // Update our component state
            this.setStep(stepId)
        }
    },
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
    },
    renderCashOptions() {
        let total = parseFloat(CheckoutStore.getTotal().value)
        let min = Math.ceil(total/5)*5 // 5 dollars is the lowest bill denomination
        let options = []

        for (let idx = 0; idx < 5; idx++) {
            options.push(min * (idx + 1))
        }

        return (
            <div className='cash-options'>
                <Button bsStyle='default' data-amount={total} onClick={this.calculateChange}>${total.toFixed(2)}</Button>&nbsp;
                <Button bsStyle='default' data-amount={options[0]} onClick={this.calculateChange}>${options[0].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='default' data-amount={options[1]} onClick={this.calculateChange}>${options[1].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='default' data-amount={options[2]} onClick={this.calculateChange}>${options[2].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='default' data-amount={options[3]} onClick={this.calculateChange}>${options[3].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='default' data-amount={options[4]} onClick={this.calculateChange}>${options[4].toFixed(2)}</Button>&nbsp;
                <Button bsStyle='disabled' onClick={this.calculateChange}>Custom</Button>&nbsp;
            </div>
        )
    },
    calculateChange(e) {
        console.log(e)
        let orderTotal = parseFloat(CheckoutStore.getTotal().value)
        let cashAmount = parseFloat(e.target.getAttribute('data-amount'))

        this.setState({
            cashAmount: (cashAmount).toFixed(2),
            changeAmount: (cashAmount - orderTotal).toFixed(2)
        })

        this.showCompleteModal()
    },
    renderOptions() {
        let options = []
        let selected = this.props.item.options
        
        for (let idx in selected) {
            options.push(<li>{selected[idx].data.option.name}: <b>{selected[idx].data.name}</b></li>)
        }
        
        return (
            <ul style={{
                paddingLeft: '1.5rem',
                marginLeft: '0'
            }}>
                {options}
            </ul>
        )
    },
    renderReceipt() {
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
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'><h4>Sale</h4></span>)
        output.push(<br />)
        output.push(<span style={{'display': 'block'}} className='receipt-line-item'>SKU      Description      Total</span>)

        // We need a max line chars algo so we can make stuff line up

        // Items
        let items = this.state.checkout.items // Annoying that this returns an object but below in totals we get an array...
        for (let idx = 0; idx < items.length; idx++) {
            let price = parseFloat(items[idx].data['price']).toFixed(2)
            let model = items[idx].data['model']
            output.push(
                <span style={{'display': 'block', clear: 'both'}} className='receipt-line-item'>
                    <strong>{model}</strong>
                    <span style={{'float': 'right'}}>${price}</span>
                    <strong>{data['name']}</strong><br />
                    {/*<div style={{maxWidth: '220px'}}><pre>{JSON.stringify(this.props.item.options)}</pre></div>*/}
                    {this.renderOptions()}
                </span>
            )
        }

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
                    {total.title}
                    <span style={{'float': 'right', 'font-size': '18px', 'font-weight': 'bold'}}>${parseFloat(total.value).toFixed(2)}</span>
                </span>
            )
        }

        return output
    },
    render() {
        let steps = this.stepper.getSteps() // Stepper extends store, we're good

        return (
            <div>
                <BlockUi tag='div' blocking={this.state.blockUi}>
                    <Modal
                      show   = {!!this.state.chooseQuantity}
                      onHide = {this.hideQuantity}>
                        <Modal.Header>
                            <Modal.Title>

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
                    
                    <main id='page-wrap'>
                        <div className='cart-ui'>
                            {this.state.step !== 'checkout' && (
                            <div className='section_wrapper mcb-section-inner'>
                                <div className='wrap mcb-wrap one valign-top clearfix'>
                                    <div className='mcb-wrap-inner'>
                                        <div className='column mcb-column one-sixth column_placeholder'>
                                            <div className='placeholder'>&nbsp;</div>
                                        </div>
                                        <div className='column mcb-column two-third column_column'>
                                            <div className='column_attr clearfix align_center'>
                                                <h2 className='heading-with-border'>The ACE Shop</h2>
                                                <h3>Awesome coffee. Amazing accessories.</h3>
                                                <h5>Find just about everything you need to ensure your best possible coffee loving experience!</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                            <Tabs activeKey={this.state.step} id='dev-tabs'>
                                <Tab eventKey={'shop'} title='Browser'>
                                    <Row>
                                        <Col sm={12}>
                                            <ProductBrowser
                                                displayProductFilter = {false}
                                                displayCategoryFilter = {false}
                                                stepper = {this.stepper}
                                                steps = {steps}
                                                activeStep = {this.state.step}
                                                customRowComponent = {CatalogRow}
                                                results = {this.state.data.categories}
                                                fluxFactory = {fluxFactory}
                                                onItemClicked = {this.categoryClicked}
                                                onFilterSelected = {this.categoryFilterSelected}
                                                onStepClicked = {this.stepClicked}
                                                />
                                        </Col>
                                    </Row>
                                </Tab>

                                <Tab eventKey={'cart'} title='Cart'>
                                    <Row>
                                        <Col sm={12}>
                                            <ProductBrowser
                                                displayProductFilter = {false}
                                                displayCategoryFilter = {false}
                                                stepper = {this.stepper}
                                                steps = {steps}
                                                activeStep = {this.state.step}
                                                customRowComponent = {CatalogRow}
                                                results = {this.state.data.products}
                                                fluxFactory = {fluxFactory}
                                                onItemClicked = {this.itemClicked}
                                                onFilterSelected = {this.categoryFilterSelected}
                                                onStepClicked = {this.stepClicked}
                                                />
                                        </Col>
                                    </Row>
                                </Tab>
                                
                                <Tab eventKey={'options'} title='Options'>
                                    <Row>
                                        <Col sm={12}>
                                            {this.state.checkoutMode === 'pos' && (
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
                                            )}


                                            {this.state.checkoutMode === 'cart' && (
                                            <BlockUi tag='div' blocking={this.state.blockUi}>
                                                <ProductBrowser
                                                    displayProductFilter = {false}
                                                    displayCategoryFilter = {true}
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
                                            )}
                                        </Col>
                                    </Row>
                                </Tab>

                                <Tab eventKey={'checkout'} title='Checkout'>
                                    <Row>
                                        <Col sm={12}>
                                            <div className='browser-container'>
                                                <div className='browser-menu-container'>
                                                    <BrowserMenu
                                                        steps = {steps}
                                                        activeStep = {this.state.step}
                                                        onStepClicked = {this.stepClicked}
                                                        />
                                                </div>
                                                <div className='browser-content'>
                                                    <div className='container-fluid'>
                                                        <div className='section_wrapper mcb-section-inner'>
                                                            <div className='wrap mcb-wrap one valign-top clearfix'>
                                                                <div className='mcb-wrap-inner'>
                                                                    <div className='column mcb-column one-sixth column_placeholder'>
                                                                        <div className='placeholder'>&nbsp;</div>
                                                                    </div>
                                                                    <div className='column mcb-column two-third column_column'>
                                                                        <div className='column_attr clearfix align_center'>
                                                                            <h2 className='heading-with-border'>Checkout Your Order</h2>
                                                                            <h3>Step 1. Billing and shipping information.</h3>
                                                                            <h5>If the information below is not correct, please update it before ordering.</h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <Row>
                                                            <CustomerProfile
                                                                customer = {CheckoutStore.customer}
                                                                billingAddress = {CheckoutStore.billingAddress}
                                                                shippingAddress = {CheckoutStore.shippingAddress}
                                                                displayProfile = {true}
                                                                displayBillingAddress = {true}
                                                                displayShippingAddress = {true}>
                                                                {!this.props.loggedIn && (
                                                                <SignInForm 
                                                                    onLoginSuccess = {this.props.onLoginSuccess}
                                                                    />
                                                                )}
                                                            </CustomerProfile>
                                                            
                                                            {/* POS Only 
                                                            {this.props.logged && (
                                                            <CustomerPicker
                                                                logged = {this.props.logged}
                                                                customer = {this.props.customer}
                                                                onCreate = {this.showNewAccountForm}
                                                                onEdit = {this.showEditAccountForm}
                                                                />
                                                            )}
                                                            */}
                                                        </Row>
                                                        <Row>
                                                            <Col md={12}>
                                                                <Row>
                                                                    <CreditCardForm />
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                            
                                                        <Row>
                                                            <Col md={5} style={{
                                                                marginLeft: 'auto',
                                                                marginRight: 'auto',
                                                                marginTop: '3.5em',
                                                                marginBottom: '2.5em',
                                                                float: 'none'
                                                                }}>
                                                                <FormGroup className='col-sm-6'>
                                                                    <Button 
                                                                        block
                                                                        bsStyle='success' 
                                                                        onClick={this.onSaleComplete}>
                                                                        <h4><i className='fa fa-check' /> Confirm Purchase</h4>
                                                                    </Button>
                                                                </FormGroup>
                                                                
                                                                <FormGroup className='col-sm-6'>
                                                                    <Button
                                                                        block
                                                                        bsStyle = 'danger'
                                                                        onClick = {this.reset}>
                                                                        <h4><i className='fa fa-times' /> Cancel Order</h4>
                                                                    </Button>
                                                                </FormGroup>
                                                                
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab>
                            </Tabs>
                        </div>
                    </main>
                    
                    <MainMenu 
                        right
                        isOpen={this.state.cart}
                        id='main-menu'
                        pageWrapId={'page-wrap'}
                        outerContainerId={'outer-container'}
                        customBurgerIcon={false}
                        customCrossIcon={false}
                        width={600}>
                        <div className='checkout dark'>
                            <Grid>
                                <Row className='checkout-parts'>
                                    <Col md={12}>
                                        <div>
                                            <Cart
                                              ref                     = 'cart'
                                              tableClassName          = 'table cart'
                                              onChange                = {this.refresh}
                                              columns                 = {['name', 'price']}
                                              selection               = {this.state.initialSelection}
                                              iterator                = {this.rowIterator}
                                              containerComponent      = {DragDropContainer}
                                              rowComponent            = {DragDropCartRow}
                                              onItemDropped           = {this.itemDropped} />
                                        </div>
                                    </Col>
                                    <Col className='cart-buttons' md={12}>
                                        {this.hasItems() && (
                                        <Button
                                          style   = {{
                                              width: '100%'
                                              //marginTop: '2rem'
                                          }}
                                          onClick = {this.setStep.bind(this, 'checkout')}
                                          bsStyle = 'success'>
                                            <h4><i className='fa fa-shopping-cart' /> Check Out</h4>
                                        </Button>
                                        )}

                                        {this.hasItems() && (
                                        <Button
                                          onClick   =   {this.reset}
                                          style     =   {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          bsStyle   =   'danger'>
                                            <h4><i className='fa fa-refresh' /> Empty</h4>
                                        </Button>
                                        )}
                                        
                                        {/* POS Mode */}
                                        {/*{this.hasItems() && (
                                        <Button
                                          style     = {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          className = 'pull-right'
                                          onClick   = {this.reset}
                                          bsStyle   = 'default'>
                                            <h4><i className='fa fa-times' /> Reset</h4>
                                        </Button>
                                        )}*/}

                                        {/* POS Mode */}
                                        {/*{this.state.step !== 'cart' && (
                                        <Button
                                          style     =   {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick   =   {this.setStep.bind(this, 'shop')}
                                          bsStyle   =   'default'>
                                            <h4><i className='fa fa-clipboard' /> Change Order</h4>
                                        </Button>
                                        )}*/}
                                        
                                        <Button
                                          style     =   {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick   =   {this.continueShopping}
                                          bsStyle   =   'default'>
                                            <h4><i className='fa fa-shopping-cart' /> Continue Shopping</h4>
                                        </Button>

                                        {this.state.step !== 'cart' && this.state.step !== 'shop' && (
                                        <Button
                                          style     = {{
                                              width: '100%',
                                              marginTop: '2rem'
                                          }}
                                          onClick = {this.showChargeModal}
                                          bsStyle = 'success'>
                                            <h4><i className='fa fa-money' /> Confirm</h4>
                                        </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Grid>
                        </div>

                    </MainMenu>

                    <Modal
                      show   = {!!this.state.charge}
                      onHide = {this.hideChargeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                <span style={{ float: 'right' }}>Charge / Split</span>
                                <span style={{ float: 'none' }} class='total-charge'>${parseFloat(CheckoutStore.getTotal().value).toFixed(2)}</span>
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
                                            <i className='fa fa-money' /> <ControlLabel>Cash Received</ControlLabel>
                                            <br />
                                            {this.renderCashOptions()}
                                            <input type='hidden' name='hid_cash' />
                                        </FormGroup>

                                        <hr />

                                        {/*
                                        <FormGroup>
                                            <i className='fa fa-credit-card' /> <ControlLabel>Card</ControlLabel>
                                            <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                            <input type='hidden' name='hid_card' />
                                        </FormGroup>

                                        <hr />

                                        <FormGroup>
                                            <i className='fa fa-gift' /> <ControlLabel>Gift Card</ControlLabel>
                                            <FormControl type='text' name='gift' placeholder='Card Number or Swipe' />
                                            <input type='hidden' name='hid_gift' />
                                        </FormGroup>

                                        <hr />

                                        <FormGroup>
                                            <i className='fa fa-ellipsis-h' /> <ControlLabel>Other (Processed using QuickCommerce)</ControlLabel>
                                            <a style={{ display: 'block' }} href='#' name='other'>Other Payment Method</a>
                                            <input type='hidden' name='hid_other' />
                                        </FormGroup>

                                        <hr />
                                        */}

                                        <FormGroup>
                                            <Button bsStyle='success' block onClick={this.showCompleteModal}><h4><i className='fa fa-money' /> Process Payment</h4></Button>
                                        </FormGroup>
                                        <FormGroup>
                                            <Button bsStyle='default' block onClick={this.showCompleteModal}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                        </FormGroup>
                                    </form>
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
                            {this.state.hasOwnProperty('checkout') &&
                            this.state.checkout.hasOwnProperty('order') &&
                            typeof this.state.checkout.order !== 'undefined' && (
                            <div className='receipt'
                                style={{
                                    margin: '0 auto',
                                    maxWidth: '300px',
                                    boxSizing: 'border-box',
                                    padding: '18px',
                                    border: '1px solid black'
                                }}>
                                {this.renderReceipt()}
                            </div>
                            )}
                        </Modal.Body>
                    </Modal>
                </BlockUi>
            </div>
        )
    }
})

module.exports = CheckoutComponent
