import React, { Component } from 'react';
import StarRating from 'react-star-rating'

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Card from 'grommet/components/Card';
import Chart, { Area, Axis, Base, Layers } from 'grommet/components/chart/Chart';
import Menu from 'grommet/components/Menu';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import NumberInput from 'grommet/components/NumberInput';
import Select from 'grommet/components/Select';
import Heading from 'grommet/components/Heading';
import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Label from 'grommet/components/Label';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Paragraph from 'grommet/components/Paragraph';
import Quote from 'grommet/components/Quote';
import Section from 'grommet/components/Section';
import SocialShare from 'grommet/components/SocialShare';
import Video from 'grommet/components/Video';
import CirclePlayIcon from 'grommet/components/icons/base/CirclePlay';
//import Header from './Header';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio, } from 'react-bootstrap';

import Griddle from 'griddle-react'

import ProductSummary from '../components/summary/ProductSummary.jsx'

import ProductOptionSlide from '../components/catalog/ProductOptionSlide.jsx'

//import ProductActions from '../actions/ProductActions.jsx'
import ProductStore from '../stores/ProductStore.jsx'
import InternalCartStore from '../modules/CartStore.jsx'

import Parallax from 'react-springy-parallax'

// Dirty global hack to maintain store instance until I refactor 
// this component to use context or switch from flux to redux
window.CartStore = (typeof window.CartStore === 'undefined') ? InternalCartStore : window.CartStore

let CartStore = window.CartStore

//TODO: Also implement a route based approach for later
export default class ProductPage extends Component {
    constructor() {
        super()
        
        this.getDescription = this.getDescription.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.toggleOptions = this.toggleOptions.bind(this)
        this.configureRow = this.configureRow.bind(this)
        
        let product = sessionStorage.getItem('selectedProduct')
        if (typeof product === 'string' && product !== '') {
            this.state = {
                showOptions: false,
                product: JSON.parse(product)
            }
        } else {
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
        return { __html: this.state.product.description }
    }
    
    addToCart(e) {
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
        let rowComponent = this.configureRow(ProductOptionSlide)
        
        if (typeof this.state.product !== 'undefined ' && 
            this.state.product !== null) {
        
            let price = (parseFloat(this.state.product.price)).toFixed(2)
            let options = false
            if (typeof this.state.product.options !== 'undefined' && 
            this.state.product.options instanceof Array && 
            this.state.product.options.length > 0) {
               options = this.state.product.options
            }
            
            return (
                <div className='container-fluid subscription-product-page'>
                    <Section 
                        pad='none' align='stretch'>
                        <Row className='page-row-wrapper'>
                            <Col className='page-wrapper' md={8} lg={9}>
                                <Row>
                                    <Col sm={12}>
                                        <Tabs id='product-tabs'>
                                            <Tab title='Overview' eventKey={1}>
                                            
                                                <ProductSummary product={this.state.product} />
                                                
                                                <Row className='pinned-offset-top'>
                                                    <Col className='page' md={12} lg={9} lgPush={3}>
                                                        {/*<Table style={{ marginTop: '1.5rem' }}>
                                                            <tbody>
                                                                <TableRow>
                                                                  <td>
                                                                    <Heading tag='h4'>Tasting Notes</Heading>
                                                                  </td>
                                                                  <td>
                                                                    Lemon & dark cocoa
                                                                  </td>
                                                                </TableRow>
                                                                <TableRow>
                                                                  <td>
                                                                    <Heading tag='h4'>Roast</Heading>
                                                                  </td>
                                                                  <td>
                                                                    Medium roast, balanced with smooth and rich flavors
                                                                  </td>
                                                                </TableRow>
                                                                <TableRow>
                                                                  <td>
                                                                    <Heading tag='h4'>Origin</Heading>
                                                                  </td>
                                                                  <td>
                                                                    Latin America
                                                                  </td>
                                                                </TableRow>
                                                                <TableRow>
                                                                  <td>
                                                                    <Heading tag='h4'>Certifications</Heading>
                                                                  </td>
                                                                  <td>
                                                                    Fair Trade, Organic
                                                                  </td>
                                                                </TableRow>
                                                            </tbody>
                                                        </Table>*/}
                                                        
                                                        <section
                                                            className='product-card entryModule triggrParallx'>
                                                            <div 
                                                                className='entryModule__tile slideDown--slow' 
                                                                style={{
                                                                    transform: 'matrix(1, 0, 0, 1, 0, 11)',
                                                                    border: '3px solid #564F22',
                                                                    borderRadius: '50%',
                                                                    backgroundPosition: 'center center',
                                                                    overflow: 'hidden',
                                                                    position: 'absolute',
                                                                    'left': '-20%',
                                                                }}>
                                                                <div 
                                                                    className='tileBg animateInView animateInView--pix isInView' 
                                                                    style={{
                                                                        margin: '0px auto',
                                                                        background: 'url(image/ace/ace-no-01-1kg_white.jpg)',
                                                                        backgroundSize: 'cover',
                                                                        transform: 'rotate(0)'
                                                                    }}>
                                                                </div>
                                                            </div>
                                                            <div 
                                                                className='entryModule__text slideUp--slow' 
                                                                style={{
                                                                    maxWidth: '58%',
                                                                    transform: 'matrix(1, 0, 0, 1, 0, -6.55)',
                                                                    position: 'relative',
                                                                    right: '-30%'
                                                                }}>
                                                                
                                                                {/*
                                                                <h3>
                                                                    <div className='animateInView animateInView--text isInView'>
                                                                        <h5>{this.state.product.manufacturer} {this.state.product.name}</h5>
                                                                    </div>
                                                                </h3>
                                                                */}
                                                                <div
                                                                    className='product-description'
                                                                    dangerouslySetInnerHTML={this.getDescription()}>
                                                                </div>
                                                                {/*
                                                                <div className='btn animateInView isInView'>
                                                                    <span className='btn__bg'></span>
                                                                    <a className='btn__link' data-type='page-transition' href=''>
                                                                        <span className='buttonText'>SHOW DETAILS</span>
                                                                    </a>
                                                                </div>
                                                                */}
                                                            </div>
                                                        </section>
                                                        
                                                    </Col>
                                                </Row>
                                            </Tab>
                                            <Tab title='Specifications' eventKey={2}>
                                                <Table>
                                                  <tbody>
                                                    <TableRow>
                                                      <td>
                                                        Tasting Notes
                                                      </td>
                                                      <td>
                                                        Lemon & Dark Cocoa
                                                      </td>
                                                    </TableRow>
                                                    <TableRow>
                                                      <td>
                                                        Medium Roast
                                                      </td>
                                                      <td>
                                                        Balanced with smooth and rich flavors
                                                      </td>
                                                    </TableRow>
                                                    <TableRow>
                                                      <td>
                                                        Origin
                                                      </td>
                                                      <td>
                                                        Latin America
                                                      </td>
                                                    </TableRow>
                                                  </tbody>
                                                </Table>
                                                
                                            </Tab>
                                            <Tab title='Resources' eventKey={3}></Tab>
                                        </Tabs>
                                        
                                    </Col>
                                </Row>
                            </Col>
                            
                            <Col md={4} lg={3} className='product-form-component dark'>
                                <div className='product-form row'>
                                    <Box margin={{top: 'medium'}}>
                                        <Label size='small' uppercase>
                                            <h4>{this.state.product.manufacturer}</h4>
                                        </Label>
                                        
                                        <Paragraph size='large' margin='none'>
                                            <h3>{this.state.product.name}</h3>
                                        </Paragraph>
                                        
                                        <hr />
                                        
                                        <Box
                                        direction='row'
                                        justify='between'
                                        separator='top'
                                        >
                                            <Label size='small' uppercase>Our Price</Label>
                                            <Paragraph size='large' margin='none'>
                                              <strong style={{ fontSize: '2.7rem' }}>${price}</strong> <small>(CAD)</small>
                                            </Paragraph>
                                        </Box>
                                        
                                        <Box
                                        direction='row'
                                        justify='between'
                                        separator='top'
                                        >
                                            <Label size='small' uppercase>Average Review</Label>
                                            <StarRating name='react-star-rating' size={20} totalStars={5} rating={4.5} />
                                        </Box>
                                    </Box>
                                    
                                    <Box
                                    direction='column'
                                    justify='between'
                                    separator='top'
                                    >
                                        
                                        <form id='product-form'>
                                            <FormGroup></FormGroup>
                                            <FormGroup>
                                                <NumberInput 
                                                    value={1} />
                                            </FormGroup>
                                            
                                            {options === false && (
                                            <FormGroup
                                                style={{
                                                        display: 'block',
                                                        width: '80%'
                                                    }}>
                                                <Button block bsStyle='danger' onClick={this.addToCart}>
                                                    <h4><i className='fa fa-shopping-cart' /> Add to Cart</h4>
                                                </Button>
                                            </FormGroup>
                                            )}
                                            
                                            {!this.state.showOptions && options !== false && (
                                            <FormGroup
                                                style={{
                                                        display: 'block',
                                                        width: '80%'
                                                    }}>                                            
                                                <Button
                                                  style = {{
                                                      width: '100%'
                                                      //marginTop: '2rem'
                                                  }}
                                                  onClick = {this.toggleOptions}
                                                  bsStyle = 'danger'>
                                                    <h4><i className='fa fa-truck' /> Subscribe!</h4>
                                                </Button>
                                            </FormGroup>
                                            )}
                                        </form>
                                    </Box>
                                </div>
                                
                                <div 
                                    className='product-extended'
                                    style={{
                                        marginTop: '2rem'
                                    }}>
                                    
                                    <Box
                                    direction='column'
                                    justify='between'
                                    separator='top'
                                    >
                                        
                                        <form id='wishlist-form'>
                                            <FormGroup></FormGroup>
                                            <FormGroup
                                                style={{
                                                        display: 'block',
                                                        width: '80%'
                                                    }}>
                                                <Button block bsStyle='danger' onClick={this.addToCart}>
                                                    <h4><i className='fa fa-star' /> Add to Wishlist</h4>
                                                </Button>
                                            </FormGroup>
                                        </form>
                                    </Box>
                                    
                                    <Box
                                    direction='row'
                                    justify='between'
                                    separator='top'
                                    >
                                        <Label margin='small' size='small' uppercase={true}>
                                          <strong>Share</strong>
                                        </Label>
                                        
                                        <Box
                                          align='center'
                                          direction='row'
                                          responsive={false}
                                        >
                                            <SocialShare
                                                type='email'
                                                link='http://www.grommet.io/docs/'
                                                colorIndex='grey-4'
                                            />
                                            <SocialShare
                                                type='twitter'
                                                link='http://www.grommet.io/docs/'
                                                colorIndex='grey-4'
                                            />
                                            <SocialShare
                                                type='facebook'
                                                link='http://www.grommet.io/docs/'
                                                colorIndex='grey-4'
                                            />
                                            <SocialShare
                                                type='linkedin'
                                                link='http://www.grommet.io/docs/'
                                                colorIndex='grey-4'
                                            />
                                        </Box>
                                    </Box>
                                </div>
                            </Col>
                        </Row>
                        {this.state.showOptions && options !== false && (
                        <Row className='page-row-wrapper subscription-wrapper'>
                            <Col sm={12} className='bg-ace-red subscription-component'>
                                <Row>
                                    <Parallax ref="parallax" pages={4} scrolling={false}>

                                        <Parallax.Layer offset={0} speed={1} />
                                        <Parallax.Layer offset={1} speed={1} />
                                        <Parallax.Layer offset={2} speed={1} />
                                        <Parallax.Layer offset={3} speed={1} />

                                        <Parallax.Layer
                                            offset={0}
                                            speed={0.5}>
                                            {this.state.showOptions && options !== false && (
                                            <section
                                                className="entryModule colorChanger dark triggrParallx">
                                              <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -9.95)'}}>
                                                  {/*<div
                                                    className='' style={{'top': '300px'}}>
                                                    <img style={{ margin: '0 auto', maxHeight: '25rem' }} src="image/ace/ace-no-01-1kg_white.jpg" />
                                                  </div>*/}
                                                <h3>
                                                  <span className="small">
                                                    <div className="animateInView animateInView--text isInView" data-delay="medium">
                                                      <span>Choose how many</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* small */}
                                                  <span className="big">
                                                    <div className="animateInView animateInView--text isInView">
                                                      <span>PACKS PER SHIPMENT.</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* big */}
                                                </h3>
                                                <div className='browser-content'>
                                                    <Grid fluid={true}>
                                                        <Griddle
                                                            showFilter              = {false}
                                                            columns                 = {[
                                                                'manufacturer',
                                                                'name',
                                                                'model',
                                                                'price'
                                                            ]}
                                                            useGriddleStyles        = {false}
                                                            useCustomPagerComponent = {false}
                                                            useCustomRowComponent   = {true}
                                                            resultsPerPage          = {6}
                                                            customRowComponent      = {rowComponent}
                                                            results                 = {options[0].option_value}
                                                        />
                                                    </Grid>
                                                </div>
                                                <Button
                                                  style   = {{
                                                      width: '100%'
                                                      //marginTop: '2rem'
                                                  }}
                                                  onClick={() => this.refs.parallax.scrollTo(1)}
                                                  bsStyle = 'danger'>
                                                    <h4><i className='fa fa-truck' /> Next</h4>
                                                </Button>
                                              </div>
                                              {/* entryModule__text */}
                                            </section>
                                            )}
                                        </Parallax.Layer>

                                        <Parallax.Layer
                                            offset={1}
                                            speed={0.5}>
                                            {this.state.showOptions && options !== false && (
                                            <section className="entryModule colorChanger dark triggrParallx">
                                              <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -9.95)'}}>
                                                {/*<div
                                                    className='' style={{'top': '300px'}}>
                                                    <img style={{ margin: '0 auto', maxHeight: '25rem' }} src="image/ace/ace-no-01-1kg_white.jpg" />
                                                  </div>*/}
                                                <h3>
                                                  <span className="small">
                                                    <div className="animateInView animateInView--text isInView" data-delay="medium">
                                                      <span>Choose the size of</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* small */}
                                                  <span className="big">
                                                    <div className="animateInView animateInView--text isInView">
                                                      <span>YOUR COFFEE PACKS.</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* big */}
                                                </h3>
                                                <div className='browser-content'>
                                                    <Grid fluid={true}>
                                                        <Griddle
                                                            showFilter              = {false}
                                                            columns                 = {[
                                                                'manufacturer',
                                                                'name',
                                                                'model',
                                                                'price'
                                                            ]}
                                                            useGriddleStyles        = {false}
                                                            useCustomPagerComponent = {false}
                                                            useCustomRowComponent   = {true}
                                                            resultsPerPage          = {6}
                                                            customRowComponent      = {rowComponent}
                                                            results                 = {options[1].option_value}
                                                        />
                                                    </Grid>
                                                </div>
                                                <Button
                                                  style   = {{
                                                      width: '100%'
                                                      //marginTop: '2rem'
                                                  }}
                                                  onClick={() => this.refs.parallax.scrollTo(2)}
                                                  bsStyle = 'danger'>
                                                    <h4><i className='fa fa-truck' /> Next</h4>
                                                </Button>
                                              </div>
                                              {/* entryModule__text */}
                                            </section>
                                            )}
                                        </Parallax.Layer>

                                        <Parallax.Layer
                                            offset={2}
                                            speed={0.5}>
                                            {this.state.showOptions && options !== false && (
                                            <section className="entryModule colorChanger dark triggrParallx">
                                              <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -9.95)'}}>
                                                {/*<div
                                                    className='' style={{'top': '300px'}}>
                                                    <img style={{ margin: '0 auto', maxHeight: '25rem' }} src="image/ace/ace-no-01-1kg_white.jpg" />
                                                  </div>*/}
                                                <h3>
                                                  <span className="small">
                                                    <div className="animateInView animateInView--text isInView" data-delay="medium">
                                                      <span>How often do you</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* small */}
                                                  <span className="big">
                                                    <div className="animateInView animateInView--text isInView">
                                                      <span>WANT YOUR DELIVERY?</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* big */}
                                                </h3>
                                                <div className='browser-content'>
                                                    <Grid fluid={true}>
                                                        <Griddle
                                                            showFilter              = {false}
                                                            columns                 = {[
                                                                'manufacturer',
                                                                'name',
                                                                'model',
                                                                'price'
                                                            ]}
                                                            useGriddleStyles        = {false}
                                                            useCustomPagerComponent = {false}
                                                            useCustomRowComponent   = {true}
                                                            resultsPerPage          = {6}
                                                            customRowComponent      = {rowComponent}
                                                            results                 = {options[3].option_value}
                                                        />
                                                    </Grid>
                                                </div>
                                                <Button
                                                  style   = {{
                                                      width: '100%'
                                                      //marginTop: '2rem'
                                                  }}
                                                  onClick={() => this.refs.parallax.scrollTo(3)}
                                                  bsStyle = 'danger'>
                                                    <h4><i className='fa fa-truck' /> Next</h4>
                                                </Button>
                                              </div>
                                              {/* entryModule__text */}
                                            </section>
                                            )}
                                        </Parallax.Layer>
                                        
                                        <Parallax.Layer
                                            offset={3}
                                            speed={0.5}>
                                            {this.state.showOptions && options !== false && (
                                            <section className="entryModule colorChanger dark triggrParallx">
                                              <div className="entryModule__text slideUp--slow" style={{transform: 'matrix(1, 0, 0, 1, 0, -9.95)'}}>
                                                {/*<div
                                                    className='' style={{'top': '300px'}}>
                                                    <img style={{ margin: '0 auto', maxHeight: '25rem' }} src="image/ace/ace-no-01-1kg_white.jpg" />
                                                  </div>*/}
                                                <h3>
                                                  <span className="small">
                                                    <div className="animateInView animateInView--text isInView" data-delay="medium">
                                                      <span>How long do you</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* small */}
                                                  <span className="big">
                                                    <div className="animateInView animateInView--text isInView">
                                                      <span>WANT TO SUBSCRIBE FOR?</span>
                                                    </div> {/* fieldEntry-text */}
                                                  </span>{/* big */}
                                                </h3>
                                                <div className='browser-content'>
                                                    <Grid fluid={true}>
                                                        <Griddle
                                                            showFilter              = {false}
                                                            columns                 = {[
                                                                'manufacturer',
                                                                'name',
                                                                'model',
                                                                'price'
                                                            ]}
                                                            useGriddleStyles        = {false}
                                                            useCustomPagerComponent = {false}
                                                            useCustomRowComponent   = {true}
                                                            resultsPerPage          = {6}
                                                            customRowComponent      = {rowComponent}
                                                            results                 = {options[2].option_value}
                                                        />
                                                    </Grid>
                                                </div>
                                                <Button
                                                  style   = {{
                                                      width: '100%'
                                                      //marginTop: '2rem'
                                                  }}
                                                  onClick={this.addToCart}
                                                  bsStyle = 'danger'>
                                                    <h4><i className='fa fa-truck' /> Add to Cart</h4>
                                                </Button>
                                              </div>
                                              {/* entryModule__text */}
                                            </section>
                                            )}
                                        </Parallax.Layer>

                                    </Parallax>
                                </Row>
                            </Col>
                        </Row>
                        )}
                    </Section>
                </div>
            )
        } else {
            return null
        }
    }
}