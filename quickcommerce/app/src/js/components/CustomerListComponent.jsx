import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Jumbotron } from 'react-bootstrap'

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'

import OmniSearch from './search/OmniSearch.jsx'
import CustomerPicker from './customer/CustomerPickerAlt.jsx'
import SignInForm from './account/SignInForm.jsx'
//import CreditCardForm from './payment/CreditCardForm.jsx'
import CustomerProfile from './customer/AuthenticatedCustomerFullProfile.jsx'
import CustomerFilter from './filter/CustomerFilter.jsx'

import LoginStore from '../stores/LoginStore.jsx'
import UserStore from '../stores/UserStore.jsx'
import CustomerStore from '../stores/CustomerStore.jsx'
import CheckoutStore from '../stores/CustomerStore.jsx'


export default AuthenticatedComponent(class CustomerListComponent extends Component {
    constructor(props) {
        super(props)
        
        this.onLoginSuccess = this.onLoginSuccess.bind(this)
        this.onProfileCreate = this.onProfileCreate.bind(this)
        this.onProfileSelect = this.onProfileSelect.bind(this)
        this.hideCustomerSearchModal = this.hideCustomerSearchModal.bind(this)
        
        this.state = {
            profileCreate: true,
            profileEdit: false,
            customerSearch: true
        }
    }
    
    hideCustomerSearchModal() {
        this.setState({
            customerSearch: null
        })
    }
    
    getLoginState() {
        return {
            loggedIn: LoginStore.isLoggedIn(),
            user: LoginStore.user,
            userToken: LoginStore.userToken
        }
    }
    
    getUserState() {
        return {
            loggedIn: LoginStore.isLoggedIn(),
            user: UserStore.user,
            billingAddress: UserStore.billingAddress,
            shippingAddress: UserStore.shippingAddress,
            userToken: LoginStore.userToken
        }
    }
    
    getCustomerState() {
        return {
            loggedIn: LoginStore.isLoggedIn(),
            customer: CustomerStore.customer,
            billingAddress: CustomerStore.billingAddress,
            billingAddressString: CustomerStore.billingAddressString,
            shippingAddress: CustomerStore.shippingAddress,
            shippingAddressString: CustomerStore.shippingAddressString,
            customerToken: CustomerStore.customerToken
        }
    }

    componentDidMount() {
        this.changeListener = this.onChange.bind(this)
        LoginStore.addChangeListener(this.changeListener)
        UserStore.addChangeListener(this.changeListener)
        CustomerStore.addChangeListener(this.changeListener)
    }

    onChange() {
        this.setState(
            assign({},
                this.getLoginState(),
                this.getUserState(),
                this.getCustomerState())
        )
    }
    
    onLoginSuccess(e) {
        window.location.hash = '/account/edit'
    }
    
    onProfileCreate() {
        this.setState({
            profileCreate: true,
            profileEdit: false
        })
    }
    
    onProfileSelect() {
        this.setState({
            profileCreate: false,
            profileEdit: true,
            customerSearch: null
        })
    }

    componentWillUnmount() {
        LoginStore.removeChangeListener(this.changeListener)
        UserStore.removeChangeListener(this.changeListener)
        CustomerStore.removeChangeListener(this.changeListener)
    }
    
    render() {       
        return (
            <div className='container-fluid'>
				<Row className='searchDrawer'
					style = {{ backgroundColor: '#0071BC' }}>
                    <OmniSearch
                        title = 'Search Customers'
                        customer = {CheckoutStore.customer}
                        onCreate = {this.onProfileCreate}
                        onSelect = {this.onProfileSelect}
                        />
					<CustomerFilter
						ref = {(profile) => {this.profile = profile}}/>
				</Row>
				<Row>
					<Col>
						<h2 className='title'>Customers</h2>
						<div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHeaderColumn>ID</TableHeaderColumn>
										<TableHeaderColumn>Name</TableHeaderColumn>
										<TableHeaderColumn>Status</TableHeaderColumn>
										<TableHeaderColumn>Action</TableHeaderColumn>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableRowColumn>1</TableRowColumn>
										<TableRowColumn>John Smith</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>2</TableRowColumn>
										<TableRowColumn>Randal White</TableRowColumn>
										<TableRowColumn>Unemployed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>3</TableRowColumn>
										<TableRowColumn>Stephanie Sanders</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>4</TableRowColumn>
										<TableRowColumn>Steve Brown</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>5</TableRowColumn>
										<TableRowColumn>Christopher Nolan</TableRowColumn>
										<TableRowColumn>Unemployed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>6</TableRowColumn>
										<TableRowColumn>John Smith</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>7</TableRowColumn>
										<TableRowColumn>Randal White</TableRowColumn>
										<TableRowColumn>Unemployed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>8</TableRowColumn>
										<TableRowColumn>Stephanie Sanders</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>9</TableRowColumn>
										<TableRowColumn>Steve Brown</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>10</TableRowColumn>
										<TableRowColumn>Christopher Nolan</TableRowColumn>
										<TableRowColumn>Unemployed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>11</TableRowColumn>
										<TableRowColumn>John Smith</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>12</TableRowColumn>
										<TableRowColumn>Randal White</TableRowColumn>
										<TableRowColumn>Unemployed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>13</TableRowColumn>
										<TableRowColumn>Stephanie Sanders</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>14</TableRowColumn>
										<TableRowColumn>Steve Brown</TableRowColumn>
										<TableRowColumn>Employed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
									<TableRow>
										<TableRowColumn>15</TableRowColumn>
										<TableRowColumn>Christopher Nolan</TableRowColumn>
										<TableRowColumn>Unemployed</TableRowColumn>
										<TableRowColumn>
											<Button onClick={() => window.location.hash = '/retail/create'} tooltip='Create Deal'><i className='fa fa-fw fa-file-text' /></Button>&nbsp;
											<Button onClick={() => window.location.hash = '/customer/edit'} tooltip='Edit Customer'><i className='fa fa-fw fa-edit' /></Button>&nbsp;
										</TableRowColumn>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</Col>
				</Row>
            </div>
        )
    }
})