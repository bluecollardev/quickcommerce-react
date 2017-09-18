import assign              from 'object-assign'

import React, { Component } from 'react';
import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';

import Meter from 'grommet/components/Meter';

import Card from 'grommet/components/Card';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Hero from 'grommet/components/Hero';
import Paragraph from 'grommet/components/Paragraph';
import Title from 'grommet/components/Title';

import TableHeader from 'grommet/components/TableHeader';
import TableRow from 'grommet/components/TableRow';
import Search from 'grommet/components/Search';
import Section from 'grommet/components/Section';
import Menu from 'grommet/components/Menu';

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio } from 'react-bootstrap';;

import ProductBrowser from '../components/browser/ProductBrowser.jsx'
import CatalogRow from '../components/catalog/CatalogRow.jsx'
import SignInForm from '../components/account/SignInForm.jsx'

export default class BrowserPage extends Component {
    
    constructor(props) {
        super(props)
        
        this.showBillingAddressModal = this.showBillingAddressModal.bind(this)
        this.hideBillingAddressModal = this.hideBillingAddressModal.bind(this)
        this.showShippingAddressModal = this.showShippingAddressModal.bind(this)
        this.hideShippingAddressModal = this.hideShippingAddressModal.bind(this)
        
        this.getInitialState = this.getInitialState.bind(this)
        let state = this.getInitialState(SampleItems)
        
        this.state = state
        console.log('state data')
        console.log(this.state)
    }
    
    getInitialState(items = []) {
        let state = {}
        
        let data = []
        for (var key in items) {
            let item = items[key]
            if (item.thumbnail) {
                item.id = key
                data.push(item)
            }
        }
        
        state = assign({}, state, { data: data })
        
        return state
    }
    
    showBillingAddressModal() {
        this.setState({billingAddress: 1})
    }
    hideBillingAddressModal() {
        this.setState({billingAddress: null})
    }
    showShippingAddressModal() {
        this.setState({shippingAddress: 1})
    }
    hideShippingAddressModal() {
        this.setState({shippingAddress: null})
    }
    render() {
        return (
          <Box>
            <Section>
                <Row>
                    <Col sm={3}>
                        <SignInForm />
                    </Col>
                    <Col sm={9}>
                        <ProductBrowser 
                            customRowComponent = {CatalogRow}
                            results = {this.state.data}
                            />
                    </Col>
                </Row>
            </Section>
          </Box>
        );
    }
};