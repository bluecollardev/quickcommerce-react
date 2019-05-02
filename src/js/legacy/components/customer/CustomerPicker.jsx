import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import Autocomplete from 'react-autocomplete'

@inject(deps => ({
    actions: deps.actions,
    customerService: deps.customerService,
    customerService: deps.customerService,
    customerStore: deps.customerStore,
    customerSearchStore: deps.customerSearchStore,
    customerListStore: deps.customerListStore,
    checkoutService: deps.checkoutService,
    checkoutStore: deps.checkoutStore,
    settingStore: deps.settingStore
}))
@observer
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
        this.props.customerListStore.on('CHANGE', this.updateCustomerList)

        this.props.actions.customerList.loadCustomers()
    }
    
    updateCustomerList() {
        this.setState({
            customers: this.getCustomerList()
        })
    }

    componentWillUnmount() {
        if (this.props.customerListStore.listenerCount('CHANGE') > 0) {
            this.props.customerListStore.removeListener('CHANGE', this.updateCustomerList)
        }
    }
    
    // TODO: Move me to a utils class
    // Also: Why the hell is sometimes this being fed a string and other times an object?
    matchItemToTerm(item, value) {
        if (typeof value === 'string') {
            return [item.firstname, item.lastname].join(' ').toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
        }
    }
    
    onSubmit(item) {
        //e.preventDefault()
        //e.stopPropagation()
        
        console.log('executing onSubmit callback')
        if (typeof this.props.onSubmit === 'function') {
            console.log('execute handler')
            let fn = this.props.onSubmit
            fn(item)
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
        let customers = this.props.customerListStore.getItems()
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
        let customers = this.props.customerListStore.getItems()
        
        let cashCustomerName = this.props.settingStore.posSettings['cash_customer']
        let cashCustomerId = parseInt(this.props.settingStore.posSettings['cash_customer_id'])
        let cashCustomerGroup = this.props.settingStore.posSettings['cash_customer_group']
        let cashCustomerGroupId = parseInt(this.props.settingStore.posSettings['cash_customer_group_id'])
        
        let customer = customers.filter((customer) => parseInt(customer['customer_id']) === cashCustomerId)[0]
        
        // Set the customer for our component
        this.setState({
            customerName: cashCustomerName,
            selectedCustomer: customer
        })

        this.props.actions.checkout.setBuiltInCustomer(customer)
    }

    render() {
        return (
            <Row className='customer-picker'>
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
                                
                                if (this.state.customers instanceof Array) {
                                    let customers = this.state.customers
                                    let matches = customers.filter(item => {
                                        return [item.firstname, item.lastname].join(' ').toLowerCase() === value.toLowerCase()
                                    })
                                    
                                    if (matches.length === 1) {
                                        // Don't auto-select if there's more than one match
                                        // Require a selection from the dropdown
                                        this.props.customerService.setCustomer(matches[0])
                                        
                                        this.onSubmit(matches[0])
                                    }
                                }
                            }}
                            onSelect={(value, item) => {
                                this.setState(assign({}, this.state, { customerName: value, selectedCustomer: item }))
                                this.props.customerService.setCustomer(item)
                                
                                this.onSubmit(item)
                            }}
                        />
                    </FormGroup>
                    
                    <FormGroup className='customer-picker-default col-xs-12 col-lg-6'>
                        <ControlLabel>&nbsp;</ControlLabel>
                        <Button block bsStyle='danger' onClick={this.selectCashier}>
                            <h4><i className='fa fa-money' /> Cash Sales</h4>
                        </Button>
                    </FormGroup>
                    
                    {!this.props.displayActions && (
                    <FormGroup className='customer-picker-create col-xs-12 col-md-6'>
                        <Button block onClick={this.onCreate}>
                            <h5><i className='fa fa-user-plus' /> New Customer</h5>
                        </Button>
                    </FormGroup>
                    )}
                    
                    {!this.props.displayActions && (
                    <FormGroup className='customer-picker-edit col-xs-12 col-md-6'>
                        <Button block onClick={this.onEdit}>
                            <h5><i className='fa fa-edit' /> Edit Customer</h5>
                        </Button>
                    </FormGroup>
                    )}
                    
                </form>
            </Row>
        )
    }
}
