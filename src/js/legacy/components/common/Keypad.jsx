import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import NumberInput from 'grommet/components/NumberInput'

import FormComponent from '../FormComponent.jsx'

export default FormComponent(class Keypad extends Component {
    constructor(props) {
        super(props)
        
        this.handleKeypress = this.handleKeypress.bind(this)
        this.clear = this.clear.bind(this)
        
        this.state = {
            value: 0
        }
    }
    
    clear() {
       this.props.field('value', '')
       
       this.setState({
            value: ''
        })
    }
    
    handleKeypress(value) {
        let newValue = 0
        
        if (this.state.value > 0) {
            newValue = parseFloat([this.state.value, value].join(''))
            this.props.field('value', newValue)
        } else {
            newValue = parseFloat(value)
            this.props.field('value', newValue)
        }
        
        this.setState({
            value: newValue
        })
    }
    
    render() {
        return (
            <Col className='keypad'>
                <FormGroup>
                    {this.props.displayLabel && (
                    <ControlLabel>Enter Item Quantity</ControlLabel>
                    )}
                    <NumberInput 
                        {...this.props.fields('value', this.state.value)} />
                </FormGroup>
                <FormGroup>
                    <div className='numpad'>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 1)}>1</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 2)}>2</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 3)}>3</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 4)}>4</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 5)}>5</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 6)}>6</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 7)}>7</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 8)}>8</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 9)}>9</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, 0)}>0</div>
                        <div className='keypad-button' onClick={this.handleKeypress.bind(this, '.')}>.</div>
                        <div className='keypad-button' onClick={this.clear}><h4><i className='fa fa-ban' />&nbsp;&nbsp;Clear</h4></div>
                        {/*<div className='keypad-button'><i className='fa fa-shopping-cart' />&nbsp;&nbsp;Add to Order</div>*/}
                    </div>
                </FormGroup>
            </Col>
        )
    }   
})