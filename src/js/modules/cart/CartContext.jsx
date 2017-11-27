import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

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
        getSelection() {
            return this.props.cartStore.getSelection()
        }
        
        hasItems() {
            let selection = this.getSelection() || null
            return (selection instanceof Array && selection.length > 0)
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
                
                // TODO: Callback
                /*this.stepper.start()
                
                let settings = this.props.settingStore.getSettings().posSettings
                if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
                    console.log('pinned category, auto select category : ' + settings['pinned_category'])
                    this.categoryClicked(null, {
                        category_id: settings['pinned_category_id']
                    })
                } else {
                    this.setStep('shop')
                }*/
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
        
        render() {
            let props = Object.assign({}, this.props, {
                getSelection: this.getSelection.bind(this),
                addToCart: this.addToCart.bind(this),
                quickAddToCart: this.quickAddToCart.bind(this)
            })
            
            return (
                <ComposedComponent
                    {...props}
                    />
            )
        }
    }
    
    return CartContext
}