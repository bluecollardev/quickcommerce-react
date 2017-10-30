import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Table, {
	TableBody,
	TableHead,
	TableFoot,
	TableRow,
	TableCell
} from 'material-ui/Table'

import Autocomplete from 'react-autocomplete'

import OmniSearchActions from '../../actions/OmniSearchActions.jsx'
import OmniSearchStore from '../../stores/OmniSearchStore.jsx'

import CustomerActions from '../../actions/CustomerActions.jsx'
import CustomerListActions from '../../actions/CustomerListActions.jsx'
import CheckoutActions from '../../actions/CheckoutActions.jsx'

@inject(deps => ({
    customerStore: deps.customerStore,
    customerSearchStore: deps.customerSearchStore,
    customerListStore: deps.customerListStore,
    checkoutStore: deps.checkoutStore,
    settingStore: deps.settingStore
}))
@observer
class OmniSearch extends Component {
    constructor(props) {
        super(props)
        
        this.onCreateClicked = this.onCreateClicked.bind(this)
        this.onSelectClicked = this.onSelectClicked.bind(this)
        this.getResults = this.getResults.bind(this)
        this.updateOmniSearch = this.updateOmniSearch.bind(this)
        //this.selectCashier = this.selectCashier.bind(this)

        console.log('sign in props')
        console.log(props)
		
		// TODO: Make the result set object configurable
		/*selectedCustomer: {
			customer_id: null,
			firstname: '',
			lastname: '',
			email: '' // Ref value for autocomplete
		}*/
		
        this.state = {
            results: this.getResults(),
			customerName: '',
            selectedCustomer: {
				userId: null,
				name: '',
				firstName: '',
				lastName: '',
				middleName: '',
				preferredName: '',
				email: ''
			}
        }

        if (typeof props.customer !== 'undefined' && props.customer !== null) {
            // TODO: Make the result set object configurable
			//this.state.customerName = [props.customer.firstname, props.customer.lastname].join(' ')
			this.state.customerName = [props.customer.firstName, props.customer.lastName].join(' ')
        }

        // Use core event from BaseStore
        OmniSearchStore.on('CHANGE', this.updateOmniSearch)
    }
	
	updateOmniSearch() {
		this.setState({
			results: this.getResults()
		})
	}
	
	componentWillUnmount() {
		if (OmniSearchStore.listenerCount('CHANGE') > 0) {
			OmniSearchStore.removeListener('CHANGE', this.updateOmniSearch)
		}
	}
	
	// TODO: Move me to a utils class
    // Also: Why the hell is sometimes this being fed a string and other times an object?
    matchItemToTerm(item, value) {
        if (typeof value === 'string') {
            return [item.firstName, item.lastName].join(' ').toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
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
        //CheckoutActions.setExistingCustomer({ customer: this.state.selectedCustomer })

        console.log('executing onSelectClicked callback')
        if (typeof this.props.onSelect === 'function') {
            console.log('execute handler')
            var fn = this.props.onSelect
            fn.call(this, e)
        }
    }

    getResults() {
        let results = OmniSearchStore.getItems()
        if (typeof results === 'undefined' || results instanceof Array === false || results.length === 0) {
            // Autocomplete will completely eff up if no input array of items is provided
            // TODO: Make the result set object configurable
			/*results = [{
                customer_id: null,
                firstname: '',
                lastname: '',
                email: ''
            }]*/
			
			results = [{
                userId: null,
                name: '',
                firstName: '',
                lastName: '',
                middleName: '',
                preferredName: '',
                email: ''
            }]
        }

        return results
    }

    /*selectCashier() {
        let results = OmniSearchStore.getItems()
        if (results[0].firstname === 'Cash' && results[0].lastname === 'Sales') {
            // Set the customer for our component
            this.setState({
                customerName: 'Cash Sales',
                selectedCustomer: results[0]
            })

            CheckoutActions.setBuiltInCustomer()
        }
    }*/

    render() {
        return (
            <Col sm={12}>
				<div className='dark' style={{ paddingTop: '0.5rem', paddingBottom: '1rem' }}>
					<form>                               
						<FormGroup className='autocomplete-control-group col-xs-8 col-xs-push-2'>
							<ControlLabel>{this.props.title}</ControlLabel>
							<Autocomplete
								open = {this.props.open}
								name='customer'
								getItemValue={(item) => {
									// TODO: Make the result set object configurable
									//return [item.firstname, item.lastname].join(' ')
									return [item.firstName, item.lastName].join(' ')
								}}
								items={this.state.results}
								renderItem={(item, isHighlighted) => {
									// TODO: Make the result set object configurable
									/*return (
										<div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
											{[item.firstname, item.lastname].join(' ')}
										</div>
									)*/
									
									return (
										<TableRow style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
											<TableCell>{item.userId}</TableCell>
											<TableCell>{[item.firstName, item.lastName].join(' ')}</TableCell>
											<TableCell>{item.email}</TableCell>
											<TableCell><Button><i className='fa fa-fw fa-file-text' /></Button>&nbsp;<Button><i className='fa fa-fw fa-eye' /></Button></TableCell>
										</TableRow>
									)
								}}
								renderMenu={(items, value, style) => {
									return (
										<div className='search-dropdown-wrapper'>
											<div style={{
												position: 'absolute',
												zIndex: '9999',
												left: '0',
												right: '0',
												overflow: 'hidden',
												zIndex: '100',
												borderRadius: '0',
												boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
												background: 'rgba(255, 255, 255, 0.9)',
												padding: '1rem 0',
												fontSize: '100%',
												overflow: 'auto',
												height: 'auto',
												maxHeight: '240px'}}>
												<Table>
													<TableHead>
														<TableRow>
															<TableCell>ID</TableCell>
															<TableCell>Name</TableCell>
															<TableCell>Email</TableCell>
															<TableCell>Action</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{items}
														<TableRow>
															<TableCell>
																<Button><i className='fa fa-fw fa-user-plus' /> Create New Customer</Button>
															</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</div>
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
									if (typeof value === 'string' && value.trim().length > 0) {										
										OmniSearchActions.search({
											search: value.trim()
										})
									}
									
									this.setState({
										customerName: value
									})
								}}
								onSelect={(value, item) => {
									this.setState({ customerName: value, selectedCustomer: item }, () => { 
										window.location.hash = '/retail/create'
									})
									
									// Update the order customer using the selected item
									// Fetch addresses and assign them to the order too
									//CheckoutActions.setExistingCustomer({ customer: item })
									// Note: there's nothing wrong with this, I just personally think I can consolidate the two bits
									CustomerActions.setCustomer(item) // TODO: This should trigger an event... right now it doesn't trigger anything
									CheckoutActions.setExistingCustomer({ customer: item }) // TODO: This should trigger an event... right now it doesn't trigger anything
								}}
							/>
						</FormGroup>
						{/*<FormGroup className='col-xs-3'>
							<Button block bsStyle='success' onClick={this.onUpdate}><h4><i className='fa fa-search' /> Search</h4></Button>
						</FormGroup>*/}
					</form>
				</div>
            </Col>
        )
    }
}

export default OmniSearch