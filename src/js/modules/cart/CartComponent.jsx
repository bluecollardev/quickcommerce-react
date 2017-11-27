import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import DragDropCartTable from './DragDropCartTable.jsx'
import DragDropCartRow from './DragDropCartRow.jsx'
import CartDropTarget from './CartDropTarget.jsx'
import CartDragItem from './CartDragItem.jsx'

import Keypad from '../components/common/Keypad.jsx'

import Cart from './Cart.jsx'
//import CartStore from './CartStore.jsx' // TODO: Create internally if not provided

import StringHelper from '../../helpers/String.js'
import ArrayHelper from '../../helpers/Array.js'
import ObjectHelper from '../../helpers/Object.js'
import JSONHelper from '../../helpers/JSON.js'
import UrlHelper from '../../helpers/URL.js'

@inject(deps => ({
    actions: deps.actions,
	settingService: deps.authService,
	checkoutService: deps.checkoutService,
	cartStore: deps.cartStore,
    checkoutStore: deps.checkoutStore,
    settingStore: deps.settingStore,
	mappings: deps.mappings, // Per component or global scope?
	translations: deps.translations, // i8ln transations
	roles: deps.roles, // App level roles, general authenticated user (not customer!)
	userRoles: deps.userRoles, // Shortcut or implement via HoC?
	user: deps.user // Shortcut or implement via HoC?
}))
@observer
class CartComponent extends Component {
    constructor(props) {
        super(props)
        
        this.getCart = this.getCart.bind(this)
        this.getSelection = this.getSelection.bind(this)
        this.hasItems = this.hasItems.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
        this.itemDropped = this.itemDropped.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.quickAddToCart = this.quickAddToCart.bind(this)
        this.refresh = this.refresh.bind(this)
        this.reset = this.reset.bind(this)
        this.renderOptions = this.renderOptions.bind(this)
        
        let actions = this.props.actions
        
        actions.setting.fetchStore(8)
        
        props.settingStore.on('store-info-loaded', (id, payload) => {
            props.checkoutStore.stores[id] = payload
        }) // Load ACE bar store data so we don't have to later
        
        actions.setting.fetchSettings()
        
        props.settingStore.on('settings-loaded', (payload) => {
            props.checkoutStore.settings = payload

            // We only wanna do this once, so stick 'er right up top
           props.checkoutService.createOrder({
                action: 'insert'
                //orderTaxRates: this.orderTaxRates
            })
        })
        
        
        // We call this data because it's not a complete item, just a POJO
        props.cartStore.on('item-added', () => {})
        
        props.cartStore.on('item-changed', () => {})
        
        props.cartStore.on('product-options-changed', () => {})

        props.cartStore.on('item-removed', () => {})

        props.cartStore.on('cart-reset', () => {
            props.checkoutService.clearOrder()
        })

        props.cartStore.on('cart-cleared', () => {
            console.log('clearing checkout store - cart was checked-out') // TODO: Have clear and reset, they aren't really the same thing

            // Don't reset, which deletes order, just create a new order
            props.checkoutService.createOrder({
                action: 'insert'
            })
        })

        this.state = {
            chooseQuantity: false,
            initialSelection: props.cartStore.getSelection(),
            canSubmit: false,
            settings: {}
        }
    }
    
    componentDidMount() {
        let settings = this.props.settingStore.getSettings().posSettings
    }
    
    getCart() {
        if (typeof this.cart.getDecoratedComponentInstance === 'function') {
            return this.cart.getDecoratedComponentInstance()
        }
        
        return this.cart
    }
    
    getSelection() {
        return this.props.cartStore.getSelection()
    }
    
    hasItems() {
        let selection = this.props.cartStore.getSelection() || null
        return (selection instanceof Array && selection.length > 0)
    }
    
    itemClicked(e, item) {
        //let cart = this.getCart()
    }
    
    itemDropped(item) {
        //let cart = this.getCart()
    }
    
    optionClicked(item) {
        //let cart = this.getCart()
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
            let cart = this.getCart()
            //let item = this.stepper.getItem(0) // Hardcoded to zero indexed item, should be fine because we explicitly clear the stepper selection
            
            //alert('Adding ' + quantity + 'x ' + item.data.name + '(s) to the order.')
            cart.addItem(item.id, quantity, item)
            this.keypad.component.clear()
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
    
    refresh() {
        this.keypad.setField('value', 0)
        
        let cart = this.getCart()
        
        this.setState({ canSubmit : !cart.isEmpty() })
    }
    
    reset() {
        this.keypad.setField('value', 0)
        
        let cart = this.getCart()
        cart.emptyCart()
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
        
        const containerComponent = this.props.containerComponent || DragDropCartTable
        const rowComponent = this.props.rowComponent || DragDropCartRow
        
        return (
            <Grid>
                <Row className='checkout-parts'>
                    <Col xs={12}>
                        <div>
                            <Cart
                                ref = {(cart) => this.cart = cart}
                                tableClassName = 'table cart'
                                onChange = {this.refresh}
                                columns = {['price']}
                                iterator = {this.rowIterator}
                                containerComponent = {containerComponent}
                                rowComponent = {rowComponent}
                                onItemDropped = {this.itemDropped} />
                        </div>
                    </Col>
                    <Col className='cart-buttons' xs={12}>
                        {/*this.state.canSubmit && (
                        <Button
                          style     = {{
                              width: '100%',
                              marginTop: '2rem'
                          }}
                          onClick = {this.showChargeModal}
                          bsStyle = 'success'>
                            <h4><i className='fa fa-money' /> Charge</h4>
                        </Button>
                        )*/}

                        {this.state.canSubmit && (
                        <Button
                          style = {{
                              width: '100%',
                              marginTop: '2rem'
                          }}
                          className = 'pull-right'
                          onClick = {this.reset}
                          bsStyle= 'danger'>
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
                    </Col>
                </Row>
                <Modal
                  show = {!!this.state.chooseQuantity}
                  onHide = {() => { /*this.hideQuantity*/ }}>
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
            </Grid>
        )
    }
}

export { CartComponent }