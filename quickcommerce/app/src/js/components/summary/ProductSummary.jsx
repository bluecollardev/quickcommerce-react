import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

export default class ProductSummary extends Component {
    render() {
        return (
            <Row>
                <Col sm={12}>
                    <section 
                        className='summary-component'>
                        <Row>
                            <Col md={12} className='col-pinned-9'>
                                <Row>
                                    <Col md={3}>
                                        <div 
                                            className='media-photo-badge'>
                                            <Image style={{ margin: '0 auto', maxHeight: '25rem' }} src={this.props.product.image} />
                                        </div>
                                        {/*<div
                                            className='media-photo-badge main-image' style={{'top': '300px'}}>
                                            <Image style={{ margin: '0 auto', maxHeight: '25rem' }} src="image/ace/ace-no-01-1kg_white.jpg" />
                                        </div>*/}
                                    </Col>
                                    <Col md={9}>
                                        <Row>
                                            <Col sm={12}>
                                                <Tabs id='product-tabs-switcher'>
                                                    <Tab title='Overview' eventKey={1}></Tab>
                                                    <Tab title='Specifications' eventKey={2}></Tab>
                                                    <Tab title='Resources' eventKey={3}></Tab>
                                                </Tabs>
                                            </Col>
                                        </Row>
                                        
                                        {/*<Row style={{ marginTop: '2.5rem' }}>
                                            <Col xs={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-asterisk'/>
                                            </Col>
                                            <Col xs={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-fire'/>
                                            </Col>
                                            <Col xs={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-bolt'/>
                                            </Col>
                                            <Col xs={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-cog'/>
                                            </Col>
                                        </Row>*/}
                                        
                                        {/*<Row>
                                            <Col xs={3}
                                            className='summary-heading'>
                                                Format
                                            </Col>
                                            <Col xs={3}
                                            className='summary-heading'>
                                                Roast
                                            </Col>
                                            <Col xs={3}
                                            className='summary-heading'>
                                                Caffeine Level
                                            </Col>
                                            <Col xs={3}
                                            className='summary-heading'>
                                                Grind
                                            </Col>
                                        </Row>*/}
                                        
                                        <Row>
                                            <Col sm={12}>
                                                <Heading 
                                                    align='center'
                                                    strong>
                                                    <h3 id='listing_name'>
                                                        <span className='small'>
                                                            <div 
                                                                className='animateInView animateInView--text isInView' 
                                                                dataDelay='medium'>
                                                                <span>{this.props.product.manufacturer}</span>
                                                            </div>
                                                        </span>
                                                        <span className='big'>
                                                            <div className='animateInView animateInView--text isInView'>
                                                                <span>{this.props.product.name}</span>
                                                            </div>
                                                        </span>
                                                    </h3>
                                                </Heading>
                                            </Col>
                                        </Row>
                                        
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </section>
                </Col>
            </Row>
        )
    }
}