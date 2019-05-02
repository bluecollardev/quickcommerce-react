import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class UserPicker extends Component {
    constructor(props) {
        super(props)
        
        this.onSubmit = this.onSubmit.bind(this)
        
        console.log('sign in props')
        console.log(props)
    }
    
    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing onSubmit')
        if (typeof this.props.onClick === 'function') {
            console.log('execute handler')
            var fn = this.props.onClick
            fn.call(this, e)
        }
    }
    
    render() {
        return (
            <Col sm={12}>
                <Row>
                    <Col sm={12}>
                        <div>
                            <form>
                                <FormGroup>
                                    <ControlLabel>Username (E-mail Address)</ControlLabel>
                                    <FormControl name='account' type='text' />
                                </FormGroup>
                                
                                <FormGroup>
                                    <Button onClick={this.onSubmit}>New User</Button>&nbsp;
                                    <Button onClick={this.onSubmit}>Edit User</Button>
                                </FormGroup>
                            </form>
                        </div>
                    </Col>
                </Row>
            </Col>
        )
    }   
}



