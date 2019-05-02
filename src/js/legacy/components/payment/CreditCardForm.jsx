import React, { Component } from 'react'
import Payment from 'payment'

import Cards from './CreditCards.jsx'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class CreditCardForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            number: '',
            name: '',
            exp: '',
            cvc: '',
            focused: '',
        }
        
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleInputFocus = this.handleInputFocus.bind(this)
        this.handleCallback = this.handleCallback.bind(this)
    }

    componentDidMount() {
        Payment.formatCardNumber(document.querySelector('[name="number"]'))
        Payment.formatCardExpiry(document.querySelector('[name="expiry"]'))
        Payment.formatCardCVC(document.querySelector('[name="cvc"]'))
    }

    handleInputFocus(e) {
        const target = e.target

        this.setState({
            focused: target.name,
        })
    }

    handleInputChange(e) {
        const target = e.target

        if (target.name === 'number') {
            this.setState({
                [target.name]: target.value.replace(/ /g, ''),
            })
        }
        else if (target.name === 'expiry') {
            this.setState({
                [target.name]: target.value.replace(/ |\//g, ''),
            })
        }
        else {
            this.setState({
                [target.name]: target.value,
            })
        }
    }

    handleCallback(type, isValid) {
        console.log(type, isValid) //eslint-disable-line no-console
    }

    render() {
        const { name, number, expiry, cvc, focused } = this.state
        return (
            <Col sm={12}>
                <Row className='rccs__demo'>
                    <div className='credit-card-info'>
                    <Col sm={12} md={6} 
                        className='rccs__demo__content customer-info full-width-inputs'>
                        <form>
                            <FormGroup className='col-sm-6'>
                                <ControlLabel>Card Number</ControlLabel>
                                <FormControl type='tel'
                                    name='number'
                                    placeholder='E.g.: 49..., 51..., 36..., 37...'
                                    onKeyUp={this.handleInputChange}
                                    onFocus={this.handleInputFocus} />
                            </FormGroup>
                            <FormGroup className='col-sm-6'>
                                <ControlLabel>Cardholder Name</ControlLabel>
                                <FormControl type='text'
                                    name='name'
                                    placeholder='Name'
                                    onKeyUp={this.handleInputChange}
                                    onFocus={this.handleInputFocus} />
                            </FormGroup>
                            <FormGroup className='col-sm-5'>
                                <ControlLabel>Valid Through</ControlLabel>
                                <FormControl type='tel'
                                    name='expiry'
                                    placeholder='05/17'
                                    onKeyUp={this.handleInputChange}
                                    onFocus={this.handleInputFocus} />
                            </FormGroup>
                                <FormGroup className='col-sm-4'>
                                <ControlLabel>CVC / CVV</ControlLabel>
                                <FormControl type='tel'
                                name='cvc'
                                placeholder='E.g.: 021, 416'
                                onKeyUp={this.handleInputChange}
                                onFocus={this.handleInputFocus} />
                            </FormGroup>
                        </form>
                    </Col>
                    <Col sm={12} md={6} 
                        className='rccs__demo__content customer-info'>
                        <div style={{
                            maxWidth: '75%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            float: 'none'
                            }}>
                            <Cards
                                number={number}
                                name={name}
                                expiry={expiry}
                                cvc={cvc}
                                focused={focused}
                                callback={this.handleCallback} 
                                />
                        </div>
                    </Col>
                    </div>
                </Row>
            </Col>
        )
    }
}