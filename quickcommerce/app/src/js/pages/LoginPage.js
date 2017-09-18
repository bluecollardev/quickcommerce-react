import React, { Component } from 'react';
import StarRating from 'react-star-rating'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap';
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap';
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Button, Checkbox, Radio, } from 'react-bootstrap';

import Griddle from 'griddle-react'

import SignInForm from '../components/account/SignInForm.jsx' // TODO: Might be a good idea later to wrap this

//TODO: Also implement a route based approach for later
export default class LoginPage extends Component {
    constructor(props) {
        super(props)
        
        /*this.showBillingAddressModal = this.showBillingAddressModal.bind(this)
        this.hideBillingAddressModal = this.hideBillingAddressModal.bind(this)
        this.showShippingAddressModal = this.showShippingAddressModal.bind(this)
        this.hideShippingAddressModal = this.hideShippingAddressModal.bind(this)*/
        this.hideLoginModal = this.hideLoginModal.bind(this)
        this.delayHideLoginModal = this.delayHideLoginModal.bind(this)
        this.onLoginSuccess = this.onLoginSuccess.bind(this)
        this.onLoginResponse = this.onLoginResponse.bind(this)
        this.setCustomer = this.setCustomer.bind(this)
        
        this.getInitialState = this.getInitialState.bind(this)

        let state = this.getInitialState()

        this.state = state
        console.log('state data')
        console.log(this.state)

    }
    
    getInitialState() {
        return {
            logged: false,
            customer: null
        }
    }  
    
    hideLoginModal(e) {
        console.log('event')
        console.log(e)
        console.log('hiding modal')
        this.setState({ logged: true })
        
        
    }

    onLoginSuccess(customer) {
        this.setCustomer(customer)
        this.delayHideLoginModal()
    }

    onLoginResponse(customer) {
        this.delayHideLoginModal()
    }

    setCustomer(customer) {
        if (typeof customer === 'undefined' || customer === null) {
            return this.state.logged
        }

        if (customer !== false) {
            this.setState({
                logged: true,
                customer: customer
            })
        } else {
            this.setState({
                logged: false,
                customer: null
            })
        }
    }

    delayHideLoginModal() {
        this.setState({ logged: true })

        setTimeout(function () {
            console.log('hiding modal')
            window.location.hash = '/retail'
        }, 666)
    }

    showLoginModal() {
        this.setState({ logged: false })
    }
    

    render() {
        return (
            <div className='container-fluid login-page'>
                <Modal
                    show     = {true}
                    backdrop = {false}>
                    <Modal.Body>
                        <Row>
                            <Col sm={12}>
                                <SignInForm
                                    onCreate = {this.hideLoginModal}
                                    onLoginSuccess = {this.onLoginSuccess}
                                    onLoginResponse = {this.onLoginResponse} />
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}