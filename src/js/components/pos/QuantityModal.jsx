import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class QuantityModal extends Component {
	constructor(props) {
        super(props)
        
        this.showQuantityModal = this.showQuantityModal.bind(this)
        this.hideQuantityModal = this.hideQuantityModal.bind(this)
    }
    
    render() {
        return (
            <Modal
                show   = {!!this.state.chooseQuantity}
                onHide = {this.hideQuantity}>
                <Modal.Header>
                    <Modal.Title>
                        Enter Item Quantity
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Keypad 
                        ref = {(keypad) => this.popupKeypad = keypad} 
                        displayLabel = {false} />
                    <FormGroup style={{ display: 'block' }}>
                        <Button block bsStyle='success' onClick={this.quickAddToCart}>
                            <h4><i className='fa fa-shopping-cart' /> Add to Order</h4>
                        </Button>
                        <Button block bsStyle='danger' onClick={() => this.setState({ chooseQuantity: false }, () => this.popupKeypad.component.clear())}>
                            <h4><i className='fa fa-ban' /> Cancel</h4>
                        </Button>
                    </FormGroup>
                </Modal.Body>
            </Modal>
        )
    }
}