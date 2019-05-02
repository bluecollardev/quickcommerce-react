import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

import ProductSummary from '../summary/ProductSummary.jsx'
import CategorySummary from '../summary/CategorySummary.jsx'

import HtmlHelper from 'quickcommerce-react/helpers/HTML.js'

export default class ProductDetail extends Component {
    constructor(props) {
        super(props)
        
        this.getDescription = this.getDescription.bind(this)
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
    
    toggleOptions() {
        this.setState({
            showOptions: (this.state.showOptions) ? false : true
        })
    }
    
    getDescription() {
        if (typeof this.state.product.description === 'string') {
            const html = HtmlHelper.decodeHtmlSpecialChars(this.state.product.description)
            return { __html: html }
        }
        
        return { __html: '' }
    }
    
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
            <div>
              <section className="container-fluid padding-top-2x">
                <ul className="nav-tabs text-center" role="tablist">
                  <li className="active"><a href="#description" role="tab" data-toggle="tab">The Finer Details</a></li>
                  <li><a href="#additional" role="tab" data-toggle="tab">Packaging / Configurations</a></li>
                  <li><a href="#reviews" role="tab" data-toggle="tab">Reviews <sup>3</sup></a></li>
                </ul>
                
                <div className="tab-content">
                  <div role="tabpanel" className="tab-pane transition fade in active" id="description">
                    <div className="row space-top">
                      {/*<div className="col-md-6 space-bottom">
                        <div className="embed-responsive embed-responsive-16by9">
                          <iframe src="https://player.vimeo.com/video/105829213?color=77cde3&title=0&byline=0&portrait=0" allowFullScreen />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam hic totam, tempore quos dicta voluptate tempora ex voluptatum amet, veniam assumenda magnam eveniet eius reiciendis, ab necessitatibus quis iure libero.</p>
                        <p>Alias commodi aspernatur quo illo dolor voluptatem animi ipsum laudantium similique blanditiis, molestias facilis vitae harum minima obcaecati corrupti quibusdam minus modi.</p>
                      </div>*/}
                      <div className="col-xs-12">
                        <ProductSummary />
                      </div>
                    </div>
                  </div>
                  <div role="tabpanel" className="tab-pane transition fade" id="additional">
                    <div className="row">
                      <div className="col-md-6">
                        <table className="table-no-border">
                          <tbody><tr>
                              <th>Weight</th>
                              <td>2.65 kg</td>
                            </tr>
                            <tr>
                              <th>Dimensions</th>
                              <td>120 x 75 x 90 cm</td>
                            </tr>
                            <tr>
                              <th>Materials</th>
                              <td>40% wood, 37% cotton, 23% plastic</td>
                            </tr>
                          </tbody></table>
                      </div>
                      <div className="col-md-6">
                        <table className="table-no-border">
                          <tbody><tr>
                              <th>Colors</th>
                              <td>Blue, Creme, Orange, Red</td>
                            </tr>
                            <tr>
                              <th>Manufacturer</th>
                              <td>Norway</td>
                            </tr>
                            <tr>
                              <th>Other Info</th>
                              <td>Repellendus ea laudantium pariatur eum.</td>
                            </tr>
                          </tbody></table>
                      </div>
                    </div>
                  </div>
                  <div role="tabpanel" className="tab-pane transition fade" id="reviews">
                    
                    <div className="review">
                      <div className="review-author-ava">
                        <img src="img/shop/reviews/01.jpg" alt="Review Author" />
                      </div>
                      <div className="review-body">
                        <div className="review-meta">
                          <div className="column">
                            <h4 className="review-title">Very stylish. Great Deal!</h4>
                          </div>
                          <div className="column">
                            <span className="product-rating text-warning">
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                            </span>
                          </div>
                        </div>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.</p>
                        <cite>Jessie James</cite>
                      </div>
                    </div>
                    
                    <div className="review">
                      <div className="review-author-ava">
                        <img src="img/shop/reviews/02.jpg" alt="Review Author" />
                      </div>
                      <div className="review-body">
                        <div className="review-meta">
                          <div className="column">
                            <h4 className="review-title">Nice nordic design, afordable price.</h4>
                          </div>
                          <div className="column">
                            <span className="product-rating text-warning">
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star_border" />
                            </span>
                          </div>
                        </div>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae sequi ipsa fugit officia eos! Sapiente laboriosam molestiae praesentium ducimus culpa. Magnam, odit, optio. Possimus similique eligendi explicabo, dolore, beatae sequi.</p>
                        <cite>Susanna Davis</cite>
                      </div>
                    </div>
                    
                    <div className="review">
                      <div className="review-author-ava">
                        <img src="img/shop/reviews/03.jpg" alt="Review Author" />
                      </div>
                      <div className="review-body">
                        <div className="review-meta">
                          <div className="column">
                            <h4 className="review-title">Godd value for your money.</h4>
                          </div>
                          <div className="column">
                            <span className="product-rating text-warning">
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star" />
                              <i className="material-icons star_border" />
                            </span>
                          </div>
                        </div>
                        <p>Anuo ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.</p>
                        <cite>Donald Murphy</cite>
                      </div>
                    </div>
                    <h4 className="padding-top">Leave a review</h4>
                    <form method="post" className="row padding-top">
                      <div className="col-sm-4">
                        <div className="form-element">
                          <input type="text" className="form-control" placeholder="Name*" required />
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-element">
                          <input type="email" className="form-control" placeholder="Email*" required />
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="form-element form-select">
                          <select className="form-control">
                            <option>5 stars</option>
                            <option>4 stars</option>
                            <option>3 stars</option>
                            <option>2 stars</option>
                            <option>1 star</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="form-element">
                          <textarea rows={8} className="form-control" placeholder="Review*" required defaultValue={""} />
                        </div>
                        <div className="row">
                          <div className="col-lg-3 col-md-4 col-sm-6 col-lg-offset-9 col-md-offset-8 col-sm-offset-6">
                            <button type="submit" className="btn btn-block btn-primary waves-effect waves-light space-top-none space-bottom-none">Leave Review</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
              
              {/* TODO: This is a must have! */}
              {/*<section className="container-fluid padding-top padding-bottom">
                <hr />
                <h3 className="padding-top">You May Also Like</h3>
                <div className="row padding-top">
                  <div className="col-lg-3 col-sm-6">
                    <div className="shop-item">
                      <div className="shop-thumbnail">
                        <span className="shop-label text-danger">Sale</span>
                        <a href="#" className="item-link" />
                        <img src="img/shop/th05.jpg" alt="Shop item" />
                        <div className="shop-item-tools">
                          <a href="#" className="add-to-whishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
                            <i className="material-icons favorite_border" />
                          </a>
                          <a href="#" className="add-to-cart">
                            <em>Add to Cart</em>
                            <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
                              <path stroke-dasharray="19.79 19.79" stroke-dashoffset="19.79" fill="none" stroke="#FFFFFF" stroke-width={2} stroke-linecap="square" stroke-miterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className="shop-item-details">
                        <h3 className="shop-item-title"><a href="#">Wall Clock</a></h3>
                        <span className="shop-item-price">
                          <span className="old-price">$69.00</span>
                          $48.00
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="shop-item">
                      <div className="shop-thumbnail">
                        <a href="#" className="item-link" />
                        <img src="img/shop/th06.jpg" alt="Shop item" />
                        <div className="shop-item-tools">
                          <a href="#" className="add-to-whishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
                            <i className="material-icons favorite_border" />
                          </a>
                          <a href="#" className="add-to-cart">
                            <em>Add to Cart</em>
                            <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
                              <path stroke-dasharray="19.79 19.79" stroke-dashoffset="19.79" fill="none" stroke="#FFFFFF" stroke-width={2} stroke-linecap="square" stroke-miterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className="shop-item-details">
                        <h3 className="shop-item-title"><a href="#">LED Lighting</a></h3>
                        <span className="shop-item-price">
                          $130.00
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="shop-item">
                      <div className="shop-thumbnail">
                        <a href="#" className="item-link" />
                        <img src="img/shop/th04.jpg" alt="Shop item" />
                        <div className="shop-item-tools">
                          <a href="#" className="add-to-whishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
                            <i className="material-icons favorite_border" />
                          </a>
                          <a href="#" className="add-to-cart">
                            <em>Add to Cart</em>
                            <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
                              <path stroke-dasharray="19.79 19.79" stroke-dashoffset="19.79" fill="none" stroke="#FFFFFF" stroke-width={2} stroke-linecap="square" stroke-miterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className="shop-item-details">
                        <h3 className="shop-item-title"><a href="#">Alarm Clock</a></h3>
                        <span className="shop-item-price">
                          $178.00
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-6">
                    <div className="shop-item">
                      <div className="shop-thumbnail">
                        <a href="#" className="item-link" />
                        <img src="img/shop/th08.jpg" alt="Shop item" />
                        <div className="shop-item-tools">
                          <a href="#" className="add-to-whishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
                            <i className="material-icons favorite_border" />
                          </a>
                          <a href="#" className="add-to-cart">
                            <em>Add to Cart</em>
                            <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
                              <path stroke-dasharray="19.79 19.79" stroke-dashoffset="19.79" fill="none" stroke="#FFFFFF" stroke-width={2} stroke-linecap="square" stroke-miterlimit={10} d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11" />
                            </svg>
                          </a>
                        </div>
                      </div>
                      <div className="shop-item-details">
                        <h3 className="shop-item-title"><a href="#">Hook Basket</a></h3>
                        <span className="shop-item-price">
                          $112.35
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>*/}
            </div>
        )
    }
}