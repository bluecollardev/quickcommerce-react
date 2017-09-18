import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'

import CustomerService from '../../services/CustomerService.jsx'
import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerListActions from '../../actions/CustomerListActions.jsx'
import CustomerListStore from '../../stores/CustomerListStore.jsx'
import CheckoutStore from '../../stores/CheckoutStore.jsx'

// TODO: Remove this from global scope, just for ease of testing
window.CustomerListStore = CustomerListStore
window.CustomerListActions = CustomerListActions
window.CustomerActions = CustomerActions
//window.CheckoutStore = CheckoutStore // Already exposed somewhere else

export default class CustomerPicker extends Component {
    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
        this.onCreate = this.onCreate.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.selectCashier = this.selectCashier.bind(this)
        this.getCustomerList = this.getCustomerList.bind(this)
		this.updateCustomerList = this.updateCustomerList.bind(this)

        this.state = {
            customers: [],
            customerName: '',
            selectedCustomer: {
                customer_id: null,
                firstname: '',
                lastname: '',
                email: '' // Ref value for autocomplete
            }
        }

        if (typeof props.customer !== 'undefined' && props.customer !== null) {
            this.state.customerName = [props.customer.firstname, props.customer.lastname].join(' ')
        }

        // Use core event from BaseStore
        CustomerListStore.on('CHANGE', this.updateCustomerList)

        CustomerListActions.loadCustomers()
    }
	
	updateCustomerList() {
        this.setState({
            customers: this.getCustomerList()
        })
	}

	componentWillUnmount() {
		if (CustomerListStore.listenerCount('CHANGE') > 0) {
			CustomerListStore.removeListener('CHANGE', this.updateCustomerList)
        }
	}
    
    // TODO: Move me to a utils class
    // Also: Why the hell is sometimes this being fed a string and other times an object?
    matchItemToTerm(item, value) {
        if (typeof value === 'string') {
            return [item.firstname, item.lastname].join(' ').toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
    }
    
    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        console.log('executing onSubmit callback')
        if (typeof this.props.onSubmit === 'function') {
            console.log('execute handler')
            let fn = this.props.onSubmit
            fn(e)
        }
    }

    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()

        console.log('executing onCreate callback')
        if (typeof this.props.onCreate === 'function') {
            console.log('execute handler')
            let fn = this.props.onCreate
            fn(e)
        }
    }

    onEdit(e) {
        e.preventDefault()
        e.stopPropagation()
        
        console.log('executing onEdit callback')
        if (typeof this.props.onEdit === 'function') {
            console.log('execute handler')
            let fn = this.props.onEdit
            fn(e)
        }
    }

    getCustomerList() {
        let customers = CustomerListStore.getItems()
        if (typeof customers === 'undefined' || customers instanceof Array === false || customers.length === 0) {
            // Autocomplete will completely eff up if no input array of items is provided
            customers = [{
                customer_id: null,
                firstname: '',
                lastname: '',
                email: ''
            }]
        }

        return customers
    }

    selectCashier() {
        let customers = CustomerListStore.getItems()
        if (customers[0].firstname === 'Cash' && customers[0].lastname === 'Sales') {
            // Set the customer for our component
            this.setState({
                customerName: 'Cash Sales',
                selectedCustomer: customers[0]
            })

            CheckoutStore.setBuiltInCustomer()
        }
    }

    render() {
        return (
            <Row className='cutomer-picker'>
                <form>
                    <FormGroup className='autocomplete-control-group col-xs-12'>
                        <ControlLabel>Choose Customer</ControlLabel>
                        <Autocomplete
                            name='customer'
                            getItemValue={(item) => {
                                return [item.firstname, item.lastname].join(' ')
                            }}
                            items={this.state.customers}
                            renderItem={(item, isHighlighted) => {
                                return (
                                    <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                        {[item.firstname, item.lastname].join(' ')}
                                    </div>
                                )
                            }}
                            shouldItemRender={this.matchItemToTerm}
                            autoHighlight={true}
                            inputProps={{
                                className: 'form-control'
                            }}
                            wrapperStyle={{
                                display: 'block'
                            }}
                            value={this.state.customerName}
                            onChange={(event, value) => {
                                this.setState(assign({}, this.state, { customerName: value }))
                            }}
                            onSelect={(value, item) => {
                                this.setState(assign({}, this.state, { customerName: value, selectedCustomer: item }))
                                // Update the order customer using the selected item
                                // Fetch addresses and assign them to the order too
                                //CheckoutStore.setExistingCustomer({ customer: item })
                                // Note: there's nothing wrong with this, I just personally think I can consolidate the two bits
                                CustomerService.setCustomer(item) // TODO: This should trigger an event... right now it doesn't trigger anything
                                CheckoutStore.setExistingCustomer({ customer: item }) // TODO: This should trigger an event... right now it doesn't trigger anything
                                
                                this.onSubmit()
                            }}
                        />
                    </FormGroup>
                    
                    <FormGroup className='col-xs-12 col-lg-6'>
                        <ControlLabel>&nbsp;</ControlLabel>
                        <Button block bsStyle='danger' onClick={this.selectCashier}>
                            <h4><i className='fa fa-money' /> Cash Sales</h4>
                        </Button>
                    </FormGroup>
                    
                    {!this.props.displayActions && (
                    <FormGroup className='col-xs-12 col-lg-6'>
                        <Button block onClick={this.onCreate}>
                            <h4><i className='fa fa-user-plus' /> New Customer</h4>
                        </Button>
                    </FormGroup>
                    )}
                    
                    {!this.props.displayActions && (
                    <FormGroup className='col-xs-12 col-lg-6'>
                        <Button block onClick={this.onEdit}>
                            <h4><i className='fa fa-edit' /> Edit Customer</h4>
                        </Button>
                    </FormGroup>
                    )}
                    
                </form>
            </Row>
        )
    }
}
