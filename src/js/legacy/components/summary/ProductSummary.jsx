import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

import HtmlHelper from 'quickcommerce-react/helpers/HTML.js'

import ProductGalleryFullwidthWithGap from '../gallery/ProductGalleryFullwidthWithGap.jsx'
import GalleryFullwidthWithGap from '../gallery/GalleryFullwidthWithGap.jsx'
import GalleryFullwidthNoGap from '../gallery/GalleryFullwidthNoGap.jsx'
import GalleryBoxedWithGap from '../gallery/GalleryBoxedWithGap.jsx'
import GalleryBoxedNoGap from '../gallery/GalleryBoxedNoGap.jsx'

export default class ProductSummary extends Component {
    constructor(props) {
        super(props)
        
        this.getDescription = this.getDescription.bind(this)
        this.toggleOptions = this.toggleOptions.bind(this)
        this.updateImageDimensions = this.updateImageDimensions.bind(this)
        
		// TODO: Type-check props
        let item = sessionStorage.getItem('selectedProduct')
		
        if (typeof item === 'string' && item !== '') {
            this.state = {
                showOptions: false,
                item: JSON.parse(item)
            }
        } else {
            console.log('no item to show')
            this.state = {
                showOptions: false,
                item: null
            }
        }
    }
    
    componentDidMount() {
        // Equalize images, etc.
        window.addEventListener('resize', this.updateImageDimensions)
        this.updateImageDimensions()
    }
    
    componentDidUpdate() {
        let item = sessionStorage.getItem('selectedProduct')
        if (this.state.item === null) {
            // If there's a item in session grab it (we probably triggered it from another page)
            if (typeof item === 'string' && item !== '') {
                this.setState({
                    item: JSON.parse(item)
                })
            }
        }
    }
    
    componentWillUnmount() {
        // Equalize images, etc.
        window.removeEventListener('resize', this.updateImageDimensions)
    }
    
    updateImageDimensions() {
        // Keep it square
        console.log('updating featured image height')
        console.log(this.featuredImage.offsetWidth)
        this.featuredImage.style.height = this.featuredImage.offsetWidth + 'px'
    }
    
    toggleOptions() {
        this.setState({
            showOptions: (this.state.showOptions) ? false : true
        })
    }
    
    getDescription() {
        if (typeof this.state.item.description === 'string') {
            const html = HtmlHelper.decodeHtmlSpecialChars(this.state.item.description)
            return { __html: html }
        }
        
        return { __html: '' }
    }
    
    render() {
        // Render Product component
        let description = this.getDescription()
        let price = (parseFloat(this.state.item.price)).toFixed(2)
        let options = false
        if (typeof this.state.item.options !== 'undefined' && 
        this.state.item.options instanceof Array && 
        this.state.item.options.length > 0) {
           options = this.state.item.options
        }
        
        let images = []
        
        if (this.state.item) {
            // TODO: Use mappings!
            if (this.state.item.hasOwnProperty('images')) {
                images = this.state.item['images']
            }
        }
        
        return (
            <div className="summary entry-summary">
                {/* Microdata */}
                {/*<meta itemProp="priceCurrency" content="USD" />
                <link itemProp="availability" href="http://schema.org/InStock" />*/}
                <div className="product-details">
                    <div className="row">
                      <div className="product_images col-xs-12 col-sm-4 col-md-4">
                        <div 
                            ref={(image) => this.featuredImage = image}
                            className="row featured_image top_row" 
                            style={{
                                backgroundImage: 'url(' + QC_IMAGES_URI + this.state.item.image + ')',
                                backgroundSize: 'cover', 
                                height: 450
                            }} />
                        <ProductGalleryFullwidthWithGap 
                            dataSource={images}
                            {...this.props} />
                      </div>
                      <div className="col-sm-12 col-sm-8 col-md-8 top_row">
                        {/*<div className="row">
                          <div className="col-sm-12 columns">
                            <div className="product_section">
                              <span className="section_title"></span>
                              <span itemProp="name" className="description product_title entry-title">My Special Product</span>
                            </div>
                          </div>
                        </div>*/}
                        <div className="row">
                          <div className="col-sm-12 flavor">
                            <div className="product_section">
                              <span className="section_title">Roaster's Notes</span>
                              <span itemProp="name" className="tags">
                                <div dangerouslySetInnerHTML={description}></div>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-12 col-md-5 location mid_block" style={{height: 114}}>
                            <div className="product_section">
                              <span className="section_title">Origin / Blend</span>
                              <span itemProp="name" className="tags">
                                <span>Sau Paulo, Brazil</span>
                              </span>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-4 mid_block" style={{height: 114}}>
                            <div className="product_section">
                              <span className="section_title">Species</span>
                              <span itemProp="name" className="tags">
                                <span>Blue Mountain</span>
                              </span>
                            </div>
                          </div>
                          <div className="col-sm-12 col-md-3 type bottom_row" style={{height: 114}}>
                        <div className="product_section">
                          <span className="section_title">Elevation</span>
                          <span itemProp="name" className="tags">
                            <span>1,345ft</span>
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-4 type bottom_row" style={{height: 114}}>
                        <div className="product_section">
                          <span className="section_title">Variety</span>
                          <span itemProp="name" className="tags">
                            <span>Ipsum dolor</span>
                          </span>
                        </div>
                      </div>
                        </div>{/* .row .collapse */}
                      </div>
                      
                    </div>{/* .row */}
                </div>
            </div>
        )
    }
}