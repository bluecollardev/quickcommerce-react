import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

/**
 * This higher-order component wraps an existing component, decorating it with methods needed to interact
 * with the shopping cart.
 */
export default (ComposedComponent) => {
    @inject(deps => ({
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
    class CartContext extends Component {
        constructor(props) {
            super(props)
            
            this.state = {
                blockUi: false,
                chooseQuantity: false,
                settings: {}
            }
            
            this.getSelection = this.getSelection.bind(this)
            this.isEmpty = this.isEmpty.bind(this)
            this.hasItems = this.hasItems.bind(this)
            this.addToCart = this.addToCart.bind(this)
            this.quickAddToCart = this.quickAddToCart.bind(this)
            this.addToCartClicked = this.addToCartClicked.bind(this)
            this.refresh = this.refresh.bind(this)
            this.reset = this.reset.bind(this)
            this.getTotal = this.getTotal.bind(this)
            this.doCheckout = this.doCheckout.bind(this)
            // TODO: rowIterator does not appear to be used
        }
        
        getSelection() {
            return this.props.cartStore.getSelection()
        }
        
        isEmpty() {
            return this.props.cartStore.isEmpty()
        }
        
        hasItems() {
            let selection = this.props.cartStore.getSelection() || null
            return (selection instanceof Array && selection.length > 0)
        }
        
        addToCart(e, item, quantity) {
            // CartContext.addToCart
            e.preventDefault()
            e.stopPropagation()
            
            quantity = (!isNaN(quantity)) ? Number(quantity) : null
            
            if (quantity === null) {
                quantity = 0
                
                switch (this.props.addToCartMode) {
                    case 'instant':
                        // Temporarily store the selected product's information
                        quantity = 1
                        
                        break
                    case 'popup':
                        if (!(this.state.chooseQuantity)) {
                            quantity = parseFloat(this.keypad.getForm().value)
                        }
                        
                        break
                    case 'normal':
                        if (this.state.chooseQuantity) {
                            // If the keypad popup modal is open, use its value
                            quantity = parseFloat(this.popupKeypad.getForm().value)
                        } else {
                            quantity = parseFloat(this.keypad.getForm().value)
                        }
                        
                        break
                    default:
                        if (this.state.chooseQuantity) {
                            // If the keypad popup modal is open, use its value
                            quantity = parseFloat(this.popupKeypad.getForm().value)
                        } else {
                            quantity = parseFloat(this.keypad.getForm().value)
                        }
                        
                        break
                }
            }
            
            if (!isNaN(quantity) && quantity > -1) {
                if (this.wrappedInstance.hasOwnProperty('stepper')) {
                    item = this.wrappedInstance.stepper.getItem(0) // Hardcoded to zero indexed item, should be fine because we explicitly clear the stepper selection
                }
                
                item = item || null
                
                if (item === null) throw new Error('Attempted to add non-item to cart!')
                
                this.props.actions.cart.addItem(item.id, quantity, item)
                
                if (this.wrappedInstance.hasOwnProperty('keypad')) {
                    this.wrappedInstance.keypad.component.clear()
                }
                
                if (this.wrappedInstance.hasOwnProperty('stepper')) {
                    this.wrappedInstance.stepper.start()
                }
                
                let settings = this.props.settingStore.getSettings().posSettings
                if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
                    console.log('pinned category, auto select category : ' + settings['pinned_category'])
                    this.categoryClicked(null, {
                        category_id: settings['pinned_category_id']
                    })
                } else {
                    //this.setStep('shop') // TODO: Uncomment
                }
            } else {
                alert('Please enter the desired quantity.')
            }
        }
        
        quickAddToCart(e) {
            // Home component quickAddToCart
            this.addToCart(e) // Add to cart
            if (this.wrappedInstance.hasOwnProperty('popupKeypad')) {
                this.wrappedInstance.popupKeypad.component.clear()
            }
            
            // Close quantity keypad popup modal
            this.setState({
                chooseQuantity: false
            })
        }
        
        addToCartClicked(e, item, quantity) {
            // Home component addToCartClicked
            e.preventDefault()
            e.stopPropagation()
            
            /*let stepId = 'options'
            let stepDescriptor = this.wrappedInstance.stepper.getStepById(stepId) || null

            if (stepDescriptor !== null) {
                let data = item
                
                let isEnded = false
                // Execute the step handler
                this.wrappedInstance.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
                this.wrappedInstance.stepper.addItem(item.id, 1, item)
            }*/
            
            switch (this.props.addToCartMode) {
                case 'instant':
                    // Temporarily store the selected product's information
                    if (this.wrappedInstance.hasOwnProperty('stepper')) {
                        this.wrappedInstance.stepper.addItem(item['product_id'], 1, item)
                    }
                    
                    this.addToCart(e, item, quantity) // Add the item to the cart
                    
                    break
                case 'popup':
                    // Temporarily store the selected product's information (yes, that's right, zero quantity)
                    if (this.wrappedInstance.hasOwnProperty('stepper')) {
                        this.wrappedInstance.stepper.addItem(item['product_id'], 0, item) // Don't set a quantity just register the item
                    }
                    
                    // And open the Keypad / Quantity selection modal
                    this.setState({
                        chooseQuantity: true
                    })
                    
                    break
                case 'normal':
                    // Go to the product detail page / component (unless we're there already?)
                    break
                default:
                    break
            }
        }
        
        refresh() {
            if (this.wrappedInstance.hasOwnProperty('keypad')) {
                this.wrappedInstance.keypad.setField('value', 0)
            }
            
            this.setState({ canSubmit: !this.props.cartStore.isEmpty() })
        }
        
        reset() {
            if (this.wrappedInstance.hasOwnProperty('keypad')) {
                this.keypad.setField('value', 0)
            }
            
            this.props.actions.cart.emptyCart()
            
            if (this.wrappedInstance.hasOwnProperty('checkoutNotes')) {
                this.wrappedInstance.checkoutNotes.component.clear()
            }

            if (this.wrappedInstance.hasOwnProperty('stepper')) {
                let stepId = 'shop'
                let stepDescriptor = this.wrappedInstance.stepper.getStepById(stepId) || null

                if (typeof stepDescriptor !== null) {
                    let data = {}
                    
                    let isEnded = false
                    // Execute the step handler
                    this.wrappedInstance.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
                }
            }
        }
        
        getTotal() {
            let total = 0
            return total
        }
        
        doCheckout() {
            this.props.showChargeModal(() => {
                window.location.href = '#/checkout'
            })
        }
        
        rowIterator(context, row) {
            if (!context) {
                return {
                    total: 0
                }
            } else {
                const price = Number(row.data['price'])
                return {
                    total: Number(context.total) + Number(row.quantity) * price
                }
            }
        }
        
        render() {
            let props = Object.assign({}, this.props, {
                getSelection: this.getSelection,
                addToCart: this.addToCart,
                quickAddToCart: this.quickAddToCart,
                addToCartClicked: this.addToCartClicked,
                getTotal: this.getTotal,
                doCheckout: this.doCheckout
            })
            
            return (
                <ComposedComponent
                    ref = {(instance) => this.wrappedInstance = instance}
                    {...props}
                    />
            )
        }
    }
    
    return CartContext
}