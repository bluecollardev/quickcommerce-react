import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

export default class CategorySummary extends Component {
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
                                            <Image style={{ margin: '0 auto', maxHeight: '25rem' }} src="image/banners/categories/coffee.jpg" />
                                        </div>
                                    </Col>
                                    <Col md={9}>
                                        {/*<Row>
                                            <Col sm={12}>
                                                <Tabs id='product-tabs-switcher'>
                                                    <Tab title='Overview' eventKey={1}></Tab>
                                                    <Tab title='Specifications' eventKey={2}></Tab>
                                                    <Tab title='Resources' eventKey={3}></Tab>
                                                </Tabs>
                                            </Col>
                                        </Row>*/}
                                        
                                        <Row>
                                            <Col sm={12}>
                                                <Heading id='listing_name' 
                                                    tag='h1' 
                                                    align='center' 
                                                    style={{ marginTop: '2.5rem' }} 
                                                    strong>
                                                    Products & Merchandise
                                                </Heading>
                                                <div id='display-address'>
                                                </div>
                                            </Col>
                                        </Row>
                                        
                                        {/*<Row>
                                            <Col sm={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-asterisk'/>
                                            </Col>
                                            <Col sm={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-fire'/>
                                            </Col>
                                            <Col sm={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-bolt'/>
                                            </Col>
                                            <Col sm={3}
                                                className='summary-icon'>
                                                <i className='fa fa-large fa-cog'/>
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col sm={3}
                                            className='summary-heading'>
                                                Format
                                            </Col>
                                            <Col sm={3}
                                            className='summary-heading'>
                                                Roast
                                            </Col>
                                            <Col sm={3}
                                            className='summary-heading'>
                                                Caffeine Level
                                            </Col>
                                            <Col sm={3}
                                            className='summary-heading'>
                                                Grind
                                            </Col>
                                        </Row>*/}
                                        
                                        
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