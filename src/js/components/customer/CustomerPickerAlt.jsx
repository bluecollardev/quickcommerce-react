import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import ToggleDisplay from 'react-toggle-display'
import Autocomplete from 'react-autocomplete'

import CustomerListActions from '../../actions/CustomerListActions.jsx'
import CustomerListStore from '../../stores/CustomerListStore.jsx'
import CheckoutStore from '../../stores/CheckoutStore.jsx'

export default class CustomerPicker extends Component {
    constructor(props) {
        super(props)
        
        this.onCreateClicked = this.onCreateClicked.bind(this)
        this.onSelectClicked = this.onSelectClicked.bind(this)
        this.getCustomerList = this.getCustomerList.bind(this)
        this.selectCashier = this.selectCashier.bind(this)

        console.log('sign in props')
        console.log(props)

        this.state = {
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
	
    onCreateClicked(e) {
        e.preventDefault()
        e.stopPropagation()

        console.log('executing onCreateClicked callback')
        if (typeof this.props.onCreate === 'function') {
            console.log('execute handler')
            var fn = this.props.onCreate
            fn.call(this, e)
        }
        
    }

    onSelectClicked(e) {
        e.preventDefault()
        e.stopPropagation()
        
        // Update the order customer using the selected item
        // Fetch addresses and assign them to the order too
        CheckoutStore.setExistingCustomer({ customer: this.state.selectedCustomer })

        console.log('executing onSelectClicked callback')
        if (typeof this.props.onSelect === 'function') {
            console.log('execute handler')
            var fn = this.props.onSelect
            fn.call(this, e)
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
            <Col sm={12}>
				<div>
					<form>                               
						<FormGroup className='autocomplete-control-group'>
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
								autoHighlight={false}
								inputProps={{
									className: 'form-control'
								}}
								wrapperStyle={{
									display: 'block'
								}}
								value={this.state.customerName}
								onSelect={(value, item) => {
									this.setState({
										customerName: value,
										selectedCustomer: item
									})
								}}
								onChange={(event, value) => {
									this.setState({
										customerName: value
									})
								}}
							/>
						</FormGroup>

						<FormGroup>
							<Button onClick={this.onCreateClicked}>Create New Customer</Button>&nbsp;
							<Button onClick={this.onSelectClicked} bsStyle='success'>Select Customer</Button>
						</FormGroup>
					</form>
				</div>
            </Col>
        )
    }
}
