import React, { Component } from 'react'

import BlockUi from 'react-block-ui'
import 'react-block-ui/style.css'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

export default class ChargeModal extends Component {
	constructor(props) {
        super(props)
        
        this.showChargeModal = this.showChargeModal.bind(this)
        this.hideChargeModal = this.hideChargeModal.bind(this)
    }
    
    showChargeModal() {
        this.setState({ 
            charge: 1,
            checkout: {
                system: {
                    currency: CURRENCY,
                    drawer: CASH_IN_DRAWER
                },
                store: SettingStore.getStoreData(),
                order: CheckoutStore.getOrderDetails(),
                items: CartStore.selection, // Should already be available via getOrderDetails? Just a thought....
                totals: CheckoutStore.getTotals(),
                total: CheckoutStore.getTotal()
            }
        })
    }
    
    hideChargeModal() {
        this.setState({ charge: null })
    }
    
    
    render() {
		return (
			<Modal
                show   = {!!this.state.charge}
                onHide = {this.hideChargeModal}>
                <Modal.Header>
                    <Modal.Title>
                        <span style={{ float: 'right', display: 'inline-block', marginTop: '5px' }}>Charge / Split</span>
                        <span style={{ float: 'none' }} class='total-charge'>Total:<span style={{ display: 'inline-block', marginLeft: '1rem', fontSize: '1.5rem' }}>${orderTotal}</span></span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>
                            <div>
                                <Alert bsStyle='danger'>
                                    <i className='fa fa-info' /> Please select a payment option below.
                                </Alert>
                            </div>

                            <form>
                                <FormGroup>
                                    <i className='fa fa-money' /> <ControlLabel>Choose Payment Type</ControlLabel>
                                    <br />
                                </FormGroup>
                                
                                <FormGroup>
                                    {this.renderPaymentOptions()}
                                    <input type='hidden' name='hid_cash' />
                                </FormGroup>

                                <hr />
                                
                                {this.state.paymentCode === 'cash' && (
                                <FormGroup>
                                    {this.renderCashOptions()}
                                    <input type='hidden' name='hid_cash' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'cash' && this.state.customPaymentAmount && (
                                <FormGroup>
                                    <i className='fa fa-dollar' /> <ControlLabel>Custom Amount</ControlLabel>
                                    <FormControl type='text' name='custom_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'credit' && (
                                <FormGroup>
                                    <i className='fa fa-credit-card' /> <ControlLabel>Credit Card</ControlLabel>
                                    <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                    <input type='hidden' name='hid_card' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'debit' && (
                                <FormGroup>
                                    <i className='fa fa-credit-card' /> <ControlLabel>Debit Card</ControlLabel>
                                    <FormControl type='text' name='card' placeholder='1234 5678 9012 3456' />
                                    <input type='hidden' name='hid_debit' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'cheque' && (
                                <FormGroup>
                                    <i className='fa fa-money' /> <ControlLabel>Cheque / Money Order</ControlLabel>
                                    <FormControl type='text' name='cheque' placeholder='Reference Number' />
                                    <input type='hidden' name='hid_cheque' />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'cheque' && this.customerPaymentAmount && (
                                <FormGroup>
                                    <i className='fa fa-dollar' /> <ControlLabel>Amount</ControlLabel>
                                    <FormControl type='text' name='cheque_amount' inputRef={(amount) => this.customPaymentAmount = amount} />
                                </FormGroup>
                                )}
                                
                                {this.state.paymentCode === 'giftcard' && (
                                <FormGroup>
                                    <i className='fa fa-gift' /> <ControlLabel>Gift Card</ControlLabel>
                                    <FormControl type='text' name='gift' placeholder='Card Number or Swipe' />
                                    <input type='hidden' name='hid_gift' />
                                </FormGroup>
                                )}
                                
                                {/* TODO: Check if is a valid method */}
                                {this.state.paymentCode !== null && (
                                <hr />
                                )}

                                <FormGroup>
                                    <Button bsStyle='success' block onClick={this.completeOrder}><h4><i className='fa fa-money' /> Process Payment</h4></Button>
                                </FormGroup>
                                <FormGroup>
                                    <Button bsStyle='default' block onClick={this.hideChargeModal}><h4><i className='fa fa-ban' /> Cancel</h4></Button>
                                </FormGroup>
                                
                            </form>
                            
                            <div className='receipt'
                                style={{
                                    margin: '0 auto',
                                    maxWidth: '570px',
                                    boxSizing: 'border-box',
                                    padding: '18px',
                                    border: '1px solid black'
                                }}>
                                {this.renderReceipt()}
                            </div>
                            
                            <br />
                            
                            <FormGroup>
                                <Button bsStyle='warning' block onClick={this.debugReceipt}>
                                    <h4><i className='fa fa-bug' /> Debug Receipt</h4>
                                </Button>
                            </FormGroup>
                            <FormGroup>
                                <Button bsStyle='warning' block onClick={this.debugOrder}>
                                    <h4><i className='fa fa-bug' /> Debug Order</h4>
                                </Button>
                            </FormGroup>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
		)
	}
}