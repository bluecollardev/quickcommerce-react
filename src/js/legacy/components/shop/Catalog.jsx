import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { DragDropContext } from 'react-dnd'
import { HashRouter, Switch, Route } from 'react-router-dom'
import HTML5Backend from 'react-dnd-html5-backend'

import Stepper from 'quickcommerce-react/components/stepper/BrowserStepper.jsx'

import ProductActions from 'quickcommerce-react/actions/ProductActions.jsx'
import ProductBrowser from 'quickcommerce-react/components/browser/ProductBrowser.jsx'
import BrowserMenu from 'quickcommerce-react/components/browser/BrowserMenu.jsx'

import CatalogFilterBar from 'quickcommerce-react/components/common/CatalogFilterBar.jsx'
import Products from 'quickcommerce-react/components/shop/Products.jsx'
import ProductRow4x from 'quickcommerce-react/components/catalog/ProductRow4x.jsx'

import Keypad from 'quickcommerce-react/components/common/Keypad.jsx'
import Notes from 'quickcommerce-react/components/common/Notes.jsx'

import { bubble as MainMenu, fallDown as CustomerMenu } from 'react-burger-menu'

import Factory from 'quickcommerce-react/factory/Factory.jsx'

import StringHelper from 'quickcommerce-react/helpers/String.js'
import ArrayHelper from 'quickcommerce-react/helpers/Array.js'
import JSONHelper from 'quickcommerce-react/helpers/JSON.js'
import UrlHelper from 'quickcommerce-react/helpers/URL.js'

let categories = [] // Empty init containers
let products = [] // Empty init containers

// Pre-configured step types
import CategoryStep from 'quickcommerce-react/steps/Category.jsx'
import ProductStep from 'quickcommerce-react/steps/Product.jsx'
import ProductOptionStep from 'quickcommerce-react/steps/ProductOption.jsx'

export default class Catalog extends Component {    
    constructor(props) {
        super(props)
        
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
    
    componentDidMount() {        
        let settings = this.props.settingStore.getSettings().posSettings

        settings['pinned_category_id'] = null // 'New' category
        let categoryId = null
        
        // Load categories
        this.props.actions.catalog.loadTopCategories()
        
        /*if (typeof this.topCategoryBrowser !== 'undefined') {
            console.log('TOP CATEGORY BROWSER')
            console.log(this.topCategoryBrowser)
            this.topCategoryBrowser.actions.loadTopCategories() // Browser load categories via refs
        }*/
        
        if (typeof this.props.match !== 'undefined' && 
            typeof this.props.match.params !== 'undefined' && 
            typeof this.props.match.params.cat !== 'undefined' && !isNaN(this.props.match.params.cat)) {
            console.log('load category id: ' + this.props.match.params.cat)
            categoryId = parseInt(this.props.match.params.cat)
        } else if (settings.hasOwnProperty('pinned_category_id') && !isNaN(settings['pinned_category_id'])) {
            categoryId = parseInt(settings['pinned_category_id'])
        }
        
        // Just load browser products, don't trigger any steps
        this.catalogBrowser.actions.loadProducts(categoryId)
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
                //this.topCategoryBrowser.actions.loadCategories()

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
                if (data !== null &&
                    data.hasOwnProperty('category_id') &&
                    !Number.isNaN(data.category_id)) {

                    this.catalogBrowser.actions.loadProducts(data.category_id) // TODO: CONST for prop name?
                } else {
                    this.catalogBrowser.actions.loadProducts()
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
        
        console.log(item);
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
            let data = {
                category_id: categoryId
            }

            let isEnded = false
            // Execute the step handler
            this.stepper.load(stepDescriptor, data, isEnded, this.setStep.bind(this, stepId))
        }
    }
    
    render() {
        let steps = this.stepper.getSteps() // Stepper extends store, we're good
        let categories = this.props.catalogStore.getCategories()
        
        return (
            <main className="content-wrapper">
                {/* Main Content Wrapper */}
                <CatalogFilterBar
                    items = {categories}
                    onFilterSelected = {this.props.onFilterSelected}
                    />
                
                {/* Shop Catalog */}
                <section className="container main-content padding-bottom-3x">
                    <div className="row padding-top">
                        <Products
                            ref = {(browser) => this.catalogBrowser = browser}
                            settings = {this.props.settingStore}
                            //items = {settings.config.catalog.items}
                            activeStep = 'cart'
                            displayTitle = {false}
                            title = {this.props.title}
                            showPager = {false}
                            displayProductFilter = {false}
                            displayCategoryFilter = {false}
                            displayTextFilter = {false}
                            stepper = {this.stepper}
                            steps = {steps}
                            resultsPerPage = {15}
                            customRowComponent = {ProductRow4x}
                            onItemClicked = {this.itemClicked}
                            onAddToCartClicked = {this.props.addToCartClicked}
                            onFilterSelected = {this.categoryFilterSelected}
                            onStepClicked = {this.stepClicked} 
                            />
                    </div>
                    <hr />
                    {/* Pagination */}
                    <div className="pagination padding-bottom">
                        <div className="page-numbers">
                          <a href="#">1</a>
                          <a href="#">2</a>
                          <span className="active">3</span>
                          <a href="#">4</a>
                          <span>...</span>
                          <a href="#">10</a>
                        </div>
                        <div className="pager">
                          <a href="#">Prev</a>
                          <span>|</span>
                          <a href="#">Next</a>
                        </div>
                    </div>{/* .pagination */}
                </section>{/* .container */}
            </main>
        )
    }
}