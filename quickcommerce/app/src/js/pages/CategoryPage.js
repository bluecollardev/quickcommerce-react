import React, { Component } from 'react';

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
//import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Label from 'grommet/components/Label';
import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Paragraph from 'grommet/components/Paragraph';
import Quote from 'grommet/components/Quote';
import Columns from 'grommet/components/Columns';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Section from 'grommet/components/Section';
import SocialShare from 'grommet/components/SocialShare';
import Video from 'grommet/components/Video';
import CirclePlayIcon from 'grommet/components/icons/base/CirclePlay';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio } from 'react-bootstrap';
import { Jumbotron } from 'react-bootstrap';

import CategorySummary from '../components/summary/CategorySummary.jsx'

export default class CategoryPage extends Component {
    constructor(props) {
        super(props)
        
        this.fetchCategories = this.fetchCategories.bind(this)
    }
    
    fetchCategories() {        
        let cards = []
        for (var category in categories) {
            let item = categories[category]
            cards.push(
                <Card
                    colorIndex='grey-1'
                    margin='small'
                    contentPad='medium'
                    //onClick={this._onClickCard.bind(this, grommetPath)}
                    thumbnail={item['thumbnail']}
                    direction='row'
                    label={item['Type']}
                    heading={
                        <Heading tag='h2'>
                            {item['Brand']}
                        </Heading>
                    }
                    description={item['Description']}
                    link={
                        <Anchor href='#/product' label={'Browse ' + item['Brand']} />
                    }>
                    
                </Card>
            )
        }
        
        return cards
    }
    
    render() {
        let categories = this.fetchCategories()
        
        return (
            <div className='container-fluid'>
            {/*<Section 
                    pad="none" align="stretch">
                    <Row>
                        <Col className='page-wrapper' md={8} lg={9}>
                            <Row>
                                <Col sm={12}>
                                    <Tabs id='category-tabs'>
                                        <Tab title='Overview' eventKey={1}>*/}
                                        
                                            {/*<CategorySummary/>*/}
                                            
                                            {/*<Row className='pinned-offset-top'>
                                                <Col className='page' md={12} lg={9} lgPush={3}>*/}
                                                    <div className='section_wrapper mcb-section-inner'>
                                                        <div className='wrap mcb-wrap one valign-top clearfix'>
                                                            <div className='mcb-wrap-inner'>
                                                                <div className='column mcb-column one-sixth column_placeholder'>
                                                                    <div className='placeholder'>&nbsp;</div>
                                                                </div>
                                                                <div className='column mcb-column two-third column_column'>
                                                                    <div className='column_attr clearfix align_center'>
                                                                        <h2 className='heading-with-border'>The ACE Shop</h2>
                                                                        <h3>Awesome coffee. Great accessories.</h3>
                                                                        <h5>Find just about everything you need to ensure your best possible coffee loving experience!</h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='section_wrapper mcb-section-inner'>
                                                        <div className='wrap mcb-wrap one valign-top clearfix'>
                                                            <div className='mcb-wrap-inner'>
                                                                <div className='column mcb-column one-sixth column_placeholder'>
                                                                    <div className='placeholder'>&nbsp;</div>
                                                                </div>

                                                                <div className='column mcb-column one column_divider column-margin-40px'>
                                                                    <hr className='no_line'/>
                                                                </div>
                                                                
                                                                <div className='column mcb-column one-fourth column_icon_box'>
                                                                    <div className='icon_box icon_position_top no_border'>
                                                                        <a className='load-checkout' href='#/checkout/category/204'>
                                                                            <div className='icon_wrapper'>
                                                                                <div className='icon'>
                                                                                    <i className='icon-cup-line'></i>
                                                                                </div>
                                                                            </div>
                                                                            <div className='desc_wrapper'>
                                                                                <h4 className='title'>Coffee</h4>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className='column mcb-column one-fourth column_icon_box'>
                                                                    <div className='icon_box icon_position_top no_border'>
                                                                        <a className='load-checkout' href='#/checkout/category/223'>
                                                                            <div className='icon_wrapper'>
                                                                                <div className='icon'>
                                                                                    <i className='icon-t-shirt-line'></i>
                                                                                </div>
                                                                            </div>
                                                                            <div className='desc_wrapper'>
                                                                                <h4 className='title'>Merchandise</h4>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className='column mcb-column one-fourth column_icon_box'>
                                                                    <div className='icon_box icon_position_top no_border'>
                                                                        <a className='load-checkout' href='#/checkout/category/88'>
                                                                            <div className='icon_wrapper'>
                                                                                <div className='icon'>
                                                                                    <i className='icon-tag-line'></i>
                                                                                </div>
                                                                            </div>
                                                                            <div className='desc_wrapper'>
                                                                                <h4 className='title'>Brewing</h4>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className='column mcb-column one-fourth column_icon_box'>
                                                                    <div className='icon_box icon_position_top no_border'>
                                                                        <a className='load-checkout' href='#/checkout/category/224'>
                                                                            <div className='icon_wrapper'>
                                                                                <div className='icon'>
                                                                                    <i className='icon-wallet-line'></i>
                                                                                </div>
                                                                            </div>
                                                                            <div className='desc_wrapper'>
                                                                                <h4 className='title'>Subscriptions</h4>
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className='column mcb-column one column_divider column-margin-40px'>
                                                                    <hr className='no_line'/>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/*<Section>
                                                        <Box pad='large' align='center' textAlign='center'
                                                            size={{'width': {'max': 'xxlarge'}}}
                                                            style={{
                                                                background: 'url(spa/media/banners/starbucks-coffee-banner.jpg) no-repeat cover'
                                                            }}>
                                                            <Heading tag='h1' strong={true} margin='none'>
                                                              Catchy heading that describes this category
                                                            </Heading>
                                                            <Paragraph size='xlarge' width='large'>
                                                              Lorem ipsum dolor sit amet, dicat sonet congue ei mei, est summo 
                                                              copiosae facilisi an. Sumo accumsan mel ea, eu ignota hendrerit 
                                                              consequuntur me.
                                                            </Paragraph>
                                                        </Box>
                                                    </Section>
                                                    
                                                    <Section>
                                                          <Columns size="small" justify="center" masonry={true}
                                                            maxCount={4} responsive={true}>
                                                              {categories}
                                                          </Columns>
                                                    </Section>*/}
                                                {/*</Col>
                                                </Row>*/}
                                            
                                        {/*</Tab>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Col>
                        
                        <Col md={4} lg={3} className='category-form-component'>
                            <div className='category-form'>
                                <Box
                                direction="column"
                                justify="between"
                                separator="top"
                                >
                                    <form id='wishlist-form'>
                                        <FormGroup></FormGroup>
                                        <FormGroup
                                            style={{
                                                    display: 'block',
                                                    width: '80%'
                                                }}>
                                            <Button 
                                                className='btn-default btn-block btn-lg'
                                                style={{
                                                    display: 'block'
                                                }}
                                                href='#'>Add to Wishlist
                                            </Button>
                                        </FormGroup>
                                    </form>
                                </Box>
                                
                                <Box
                                direction="row"
                                justify="between"
                                separator="top"
                                >
                                    <Label margin="small" size="small" uppercase={true}>
                                      <strong>Share</strong>
                                    </Label>
                                    
                                    <Box
                                      align="center"
                                      direction="row"
                                      responsive={false}
                                    >
                                        <SocialShare
                                            type="email"
                                            link="http://www.grommet.io/docs/"
                                            colorIndex="grey-4"
                                        />
                                        <SocialShare
                                            type="twitter"
                                            link="http://www.grommet.io/docs/"
                                            colorIndex="grey-4"
                                        />
                                        <SocialShare
                                            type="facebook"
                                            link="http://www.grommet.io/docs/"
                                            colorIndex="grey-4"
                                        />
                                        <SocialShare
                                            type="linkedin"
                                            link="http://www.grommet.io/docs/"
                                            colorIndex="grey-4"
                                        />
                                    </Box>
                                </Box>
                            </div>
                        </Col>
                    </Row>
                </Section>*/}
            </div>
        )
    }
};