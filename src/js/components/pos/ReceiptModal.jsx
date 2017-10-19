import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class ReceiptModal extends Component {
	constructor(props) {
        super(props)
        
        this.showReceiptModal = this.showReceiptModal.bind(this)
        this.hideReceiptModal = this.hideReceiptModal.bind(this)
    }
    
    showReceiptModal() {
        // Hide the current modal
        this.hideCompleteModal()

        // Trigger receipt display
        this.setState({ receipt: 1 })
    }
    
    hideReceiptModal() {
        // Hide the receipt
        this.setState({ receipt: null })

        this.showCompleteModal()
    }
    
    render() {
		return (
			<Modal
                show   = {!!this.state.receipt}
                onHide = {this.hideReceiptModal}>
                <Modal.Header>
                    <Modal.Title>
                        ACE Coffee Roasters
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.hasOwnProperty('prevCheckout') &&
                    this.state.prevCheckout.hasOwnProperty('order') &&
                    typeof this.state.prevCheckout.order !== 'undefined' && (
                    <div className='receipt'
                        style={{
                            margin: '0 auto',
                            maxWidth: '300px',
                            boxSizing: 'border-box',
                            padding: '18px',
                            border: '1px solid black'
                        }}>
                        {this.renderCachedReceipt()}
                    </div>
                    )}
                </Modal.Body>
            </Modal>
		)
	}
}