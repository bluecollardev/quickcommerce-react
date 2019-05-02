import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Button } from 'react-bootstrap'

import ProductDetail from '../catalog/ProductDetail.jsx'

import HtmlHelper from 'quickcommerce-react/helpers/HTML.js'

class Product extends Component {    
    constructor(props) {
        super(props)
        
        this.getDescription = this.getDescription.bind(this)
        this.onAddToCartClicked = this.onAddToCartClicked.bind(this)
        this.toggleOptions = this.toggleOptions.bind(this)
        this.configureRow = this.configureRow.bind(this)
        
        let product = sessionStorage.getItem('selectedProduct')
        if (typeof product === 'string' && product !== '') {
            this.state = {
                showOptions: false,
                product: JSON.parse(product)
            }
        } else {
            console.log('no product to show')
            this.state = {
                showOptions: false,
                product: null
            }
        }
    }
    
    componentDidUpdate() {
        let product = sessionStorage.getItem('selectedProduct')
        if (this.state.product === null) {
            // If there's a product in session grab it (we probably triggered it from another page)
            if (typeof product === 'string' && product !== '') {
                this.setState({
                    product: JSON.parse(product)
                })
            }
        }
    }
    
    onClick(e) {
        // onClick handler for CartDragItem
        if (typeof this.props.onItemClicked === 'function') {
            let fn = this.props.onItemClicked
            fn(e, this.props.item)
        }
    }
    
    /**
     * This handler is different from other onAddToCartClicked handlers. Trigger addToCart directly.
     */
    onAddToCartClicked(e) {
        // QuickCommerce theme Product component's onAddToCartClicked handler
        // onAddToCartClicked handler for Product
        let input = document.querySelectorAll('#product-form input.quantity')[0]
        let quantity = parseInt(input.value)
        console.log('adding ' + quantity + ' items to cart')
        
        let item = this.state.product
        
        if (typeof this.props.addToCart === 'function') {
            let fn = this.props.addToCart
            fn(e, item, quantity)
        }
    }
    
    toggleOptions() {
        this.setState({
            showOptions: (this.state.showOptions) ? false : true
        })
    }
    
    getDescription() {
        let product = this.state.product || null
        if (product !== null) {
            if (typeof this.state.product.description === 'string') {
                const html = HtmlHelper.decodeHtmlSpecialChars(this.state.product.description)
                return { __html: html }
            }            
        }
        
        return { __html: '' }
    }
    
    /*addToCart(e) {
        e.preventDefault()
        
        if (typeof this.refs.parallax !== 'undefined') {
            this.refs.parallax.scrollTo(0) // Scroll subscription up
        }
        
        let input = document.querySelectorAll('#product-form input[type=number]')[0]
        let quantity = parseInt(input.value)
        console.log('adding ' + quantity + ' items to cart')
        
        let item = this.state.product
        CartStore.addItem(item.id, quantity, item)
        
        window.location.hash = '/category'
        
        let scrollDuration = 111
        let scrollStep = -window.scrollY / (scrollDuration / 15),
            scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep)
            } else clearInterval(scrollInterval)
        }, 15)
    }*/
    
    configureRow(rowComponent) {
        let that = this
        let fn = null

        if (this.props.hasOwnProperty('onItemClicked') &&
            typeof this.props.onItemClicked === 'function') {

            // Wrap the function in a generic handler so we can pass in custom args
            let callback = fn = this.props.onItemClicked
            fn = function () {
                // What's the current step?
                let step = BrowserActions.getCurrentStep()

                // Make sure there's a next step before calling it into action
                // Also, subtract a step to account for zero index
                if (that.props.stepper.currentStep < (that.props.stepper.steps.length - 1)) {
                    that.props.stepper.next()
                }

                // Execute our handler
                callback(arguments[0])
            }
        } else {
            fn = this.props.onItemClicked
        }

        rowComponent.defaultProps.onItemClicked = fn

        return rowComponent
    }
    
    render() {
        // Render Product component
        let description = this.getDescription()
        let price = (parseFloat(this.state.product.price)).toFixed(2)
        let options = false
        if (typeof this.state.product.options !== 'undefined' && 
        this.state.product.options instanceof Array && 
        this.state.product.options.length > 0) {
           options = this.state.product.options
        }
            
        return (
            <main className='content-wrapper'>{/* Main Content Wrapper */}
                {/*<section className='fw-section bg-gray padding-top-3x'>*/}
                <section className='fw-section bg-gray'>
                    <a href='#' className='page-nav page-prev'>
                        <span className='page-preview'>
                            <img src='img/pager/01.jpg' alt='Page' />
                        </span>
                        — Prev
                    </a>
                    <a href='#' className='page-nav page-next'>
                        <span className='page-preview'>
                            <img src='img/pager/02.jpg' alt='Page' />
                        </span>
                        Next —
                    </a>
                    {/*<div className='container-fluid padding-top'>*/}
                    <div>
                      <div className='product-gallery'>
                        <ul className='product-gallery-preview'>
                            <li id='preview01' className='current'>
                                <div className='fullpage-slide' style={{ backgroundImage: 'url(img/template/acecoffeeroasters/prd-fhd/ACE-8.jpg)' }}></div>
                            </li>
                            <li id='preview02'>
                                <div className='fullpage-slide' style={{ backgroundImage: 'url(img/template/acecoffeeroasters/prd-fhd/ACE-8.jpg)' }}></div>
                            </li>
                            <li id='preview03'>
                                <div className='fullpage-slide' style={{ backgroundImage: 'url(img/template/acecoffeeroasters/prd-fhd/ACE-8.jpg)' }}></div>
                            </li>
                        </ul>
                        
                        <ul className='product-gallery-thumblist'>
                            <li><a href='#preview01'>
                                <img src='img/shop/product-gallery/thumb01.jpg' alt='Product' />
                            </a></li>
                            <li className='active'><a href='#preview02'>
                                <img src='img/shop/product-gallery/thumb02.jpg' alt='Product' />
                            </a></li>
                            <li><a href='#preview03'>
                                <img src='img/shop/product-gallery/thumb03.jpg' alt='Product' />
                            </a></li>
                        </ul>
                      </div>
                    </div>
                </section>
                {/*<section className='fw-section bg-gray padding-bottom-3x'>*/}
                <section className='fw-section padding-bottom-3x'>
                    <div className='container-fluid'>
                      <form id='product-form'>
                      <div className='product-info padding-top-2x text-center'>
                        <h1 className='h2 space-bottom-half'>{this.state.product.name}</h1>
                        <div className='product-meta'>
                          <div className='product-sku'>
                            <strong>SKU: </strong>
                            <span>146950023</span>
                          </div>
                          <div className='product-category'>
                            <strong>Category: </strong>
                            <a href='#'>Single Origin</a>
                          </div>
                          <span className='product-rating text-warning'>
                            <i className='material-icons star' />
                            <i className='material-icons star' />
                            <i className='material-icons star' />
                            <i className='material-icons star' />
                            <i className='material-icons star_border' />
                          </span>
                        </div>
                        <h2>${price}</h2>
                        {/*<div className='text-sm text-gray' dangerouslySetInnerHTML={description}></div>*/}
                        <div className='text-gray' dangerouslySetInnerHTML={description}></div>
                        <div className='product-tools shop-item'>
                          <div className='count-input'>
                            <a className='incr-btn' data-action='decrease' href='#'>–</a>
                            <input className='quantity' type='text' defaultValue={1} />
                            <a className='incr-btn' data-action='increase' href='#'>+</a>
                          </div>
                          <div className='form-element'>
                            <select className='form-control form-control-sm color-select'>
                              <option value='blue' data-image='preview02'>Blue</option>
                              <option value='creme' data-image='preview01'>Creme</option>
                              <option value='red' data-image='preview03'>Red</option>
                            </select>
                          </div>
                          <Button className='add-to-cart' onClick={this.props.onAddToCartClicked}>
                            <em>Add to Order</em>
                            <svg x='0px' y='0px' width='32px' height='32px' viewBox='0 0 32 32'>
                                <path strokeDasharray='19.79 19.79' strokeDashoffset='19.79' fill='none' stroke='#FFFFFF' strokeWidth={2} strokeLinecap='square' strokeMiterlimit={10} d='M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11' />
                            </svg>
                          </Button>
                        </div>
                        <div className='product-share'>
                          <span>Share this product: </span>
                          <div className='social-bar'>
                            <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                              <i className='socicon-facebook' />
                            </a>
                            <a href='#' className='sb-twitter' data-toggle='tooltip' data-placement='top' title='Twitter'>
                              <i className='socicon-twitter' />
                            </a>
                            <a href='#' className='sb-instagram' data-toggle='tooltip' data-placement='top' title data-original-title='Instagram'>
                              <i className='socicon-instagram' />
                            </a>
                          </div>
                        </div>
                      </div>
                      </form>
                      
                      <div className='row product-section'>
                        <div className='col-xs-12'>
                          <ProductDetail />
                        </div>
                      </div>
                    </div>
                </section>
            </main>
        )
    }
}

Product.defaultProps = {
    item: {},
    onItemClicked: () => {},
    onAddToCartClicked: () => {}
}

export default Product