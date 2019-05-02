import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

export default class CategorySummary extends Component {
    render() {
        return (
            <div className="summary entry-summary">
                {/* Microdata */}
                {/*<meta itemProp="priceCurrency" content="USD" />
                <link itemProp="availability" href="http://schema.org/InStock" />*/}
                <div className="product-details">
                    <div className="row">
                      <div className="col-sm-12 col-md-8 top_row" style={{height: 500}}>
                        <div className="row">
                          <div className="col-sm-12 columns">
                            <div className="product_section">
                              <span className="section_title"></span>
                              <span itemProp="name" className="description product_title entry-title">My Special Product</span>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 flavor">
                            <div className="product_section">
                              <span className="section_title">Description</span>
                              <span itemProp="name" className="tags">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus non mi mattis, maximus quam sit amet, posuere sapien. Vivamus aliquet ex sed turpis pellentesque tincidunt.</p>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 col-md-5 location mid_block" style={{height: 114}}>
                            <div className="product_section">
                              <span className="section_title">Location</span>
                              <span itemProp="name" className="tags">
                                <span>Sau Paulo, Brazil</span>
                              </span>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-7 mid_block" style={{height: 114}}>
                            <div className="product_section">
                              <span className="section_title">Attribute 1</span>
                              <span itemProp="name" className="tags">
                                <span>Ipsum lorem dolor</span>
                              </span>
                            </div>
                          </div>
                        </div>{/* .row .collapse */}
                      </div>
                      <div className="col-sm-12 col-md-4 featured_image top_row" style={{backgroundSize: 'contain', height: 399}}>
                        <div className="product_section">
                          &nbsp;
                        </div>
                      </div>
                    </div>{/* .row */}
                    <div className="row">
                      <div className="col-sm-12 col-md-3 type bottom_row" style={{height: 114}}>
                        <div className="product_section">
                          <span className="section_title">Attribute 2</span>
                          <span itemProp="name" className="tags">
                            <span>Ipsum lorem dolor</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-5 price bottom_row" style={{height: 114}}>
                        <div className="product_section">
                          <div className="options">
                            <div className="selector-wrapper" style={{display: 'none'}}><select className="single-option-selector" data-option="option1" id="productSelect-option-0"><option value="Default Title">Default Title</option></select></div><select name="id" id="productSelect" className="product-single__variants" style={{display: 'none'}}>
                              <option selected="selected" data-sku="" value={0}>Default Title - $20.00 USD</option>
                            </select>
                          </div>
                          <div className="price_amount">
                            <span className="section_title">Price / 12oz.</span>
                            <span className="visually-hidden">Regular price</span>
                            <span id="ProductPrice" className="h2" itemProp="name">$20.00</span>
                          </div>
                          <span className="section_title">Quantity</span>
                          <div className="quantity">
                            <span>
                              <div className="quantity">
                                <input type="number" id="Quantity" name="quantity" defaultValue={1} min={1} className="input-text qty text quantity-selector" />
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 purchase bottom_row" style={{height: 114}}>
                        <button className="btn button" style={{display: 'none'}}>ADD TO CART<div className="" /><a className="" data-toggle="modal" data-target="#myModal" style={{display: 'none'}}>Add to Cart</a></button><button type="submit" name="add" id="AddToCart" className="button">
                          <span id="AddToCartText">Add to Cart</span>
                        </button>
                      </div>
                    </div>{/* .row */}
                </div>
            </div>
        )
    }
}