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
import Hero from 'grommet/components/Hero';
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
//import { Jumbotron } from 'react-bootstrap';

//import Header from './Header';
import NewsFeed from './NewsFeed';

export default class HomePage extends Component {
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
                    direction='column'
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
            <Box>
                <Box>
                    <Hero size="large" backgroundImage="image/danesi/IMG_7980.jpg" colorIndex="grey-1"
                      justify="start">
                      <Card
                        heading={
                          <Heading strong={true}>
                            ACE. Italian inspired espresso.
                          </Heading>
                        }
                        description="Brew your espresso the traditional Italian way." 
                        label="Introducing..." 
                        size="large"
                        link={
                          <Anchor href="#" primary={true} label="Learn More" />
                        } />
                    </Hero>
                </Box>

                <Box align="center">
                  <Box pad="large" align="center" textAlign="center"
                    size={{"width": {"max": "xxlarge"}}}>
                    <Heading tag="h1" strong={true} margin="none">
                      Your catchy heading here.
                    </Heading>
                    <Paragraph size="xlarge" width="large">
                      Lorem ipsum dolor sit amet, dicat sonet congue ei mei, est summo 
                      copiosae facilisi an. Sumo accumsan mel ea, eu ignota hendrerit 
                      consequuntur me.
                    </Paragraph>
                  </Box>
                </Box>

                <Box colorIndex="light-2" pad={{vertical: "large"}} align="center">
                  <Box align="center"
                    size={{"width": "xxlarge"}} pad={{horizontal: "large"}}>
                    <Heading tag="h2" strong={true}>
                      Explore
                    </Heading>
                  </Box>
                  <NewsFeed />
                </Box>

                <Box colorIndex="light-2" pad={{vertical: "large"}} align="center">
                  <Box align="center"
                    size={{"width": "xxlarge"}} pad={{horizontal: "large"}}>
                    <Heading tag="h2" strong={true}>
                      Shop
                    </Heading>
                  </Box>
                  <Section>
                    {/*<Tiles
                      selectable={true} onMore={this.fetchCategories}>*/}
                      <Columns size="small" justify="center" masonry={true}
                        maxCount={3} responsive={true}>
                          {categories}
                      </Columns>
                      {/*</Tiles>*/}
                  </Section>
                </Box>
            </Box>
        );
    }
};