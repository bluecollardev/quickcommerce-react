import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'


import CurrentAddress from '../address/CurrentAddress.jsx'
import ShippingAddress from '../address/ShippingAddress.jsx'
import EmployerInfo from '../employer/EmployerInfo.jsx'

import Auth from '../../services/AuthService.jsx'
import AuthenticatedComponent from '../AuthenticatedComponent'

export default class EmployerProfile extends Component {
    static defaultProps = {
		pk: 'employer_id',
		mode: 'edit',
		displayLogin: false,
		displayProfile: true,
		displayCurrentAddress: false,
		displayShippingAddress: false,
		mailingAddress: {},
		shippingAddress: {},
		employer: {
			id: null,
			employer_id: null,
			address_id: null,
			addresses: [],
			firstname: '',
			middlename: '',
			lastname: '',
			company_name: '',
			email: '',
			telephone: '',
			fax: ''
		}
	}
	
	constructor(props) {
        super(props)
    }

    render() {
        let mode = (this.props.hasOwnProperty('edit') && this.props.edit === false) ? 'create' : 'edit'

        return (
            <Col sm={12} className='employer-profile'>
                <div className='employer-profile-block row employer-info'>
                    {this.props.children}
                    
                    {this.props.displayProfile && mode === 'create' && (
                    <EmployerInfo
                        displayContact = {false}
                        onCancel = {this.props.onCancel}
                        onSaveSuccess = {this.props.onSaveSuccess} />
                    )}
                    
                    {this.props.displayProfile && mode === 'edit' && (
                    <EmployerInfo
                        displayContact = {false}
                        data = {this.props.employer}
                        onCancel = {this.props.onCancel}
                        onSaveSuccess = {this.props.onSaveSuccess} />
                    )}
                </div>                

                {this.props.displayCurrentAddress && (
				<div className='customer-profile-block row full-width-inputs'>
					<div className='billing-address'>
						<CurrentAddress
							ref = {(address) => {this.billingAddress = address}}
							modal = {this.props.modal}
							data = {this.props.billingAddress}
                            durationRequired = {true}
                            nameRequired = {false}
							mode = 'create'
							/>
					</div>
				</div>
				)}
				
				{/*this.props.displayShippingAddress && (
				<div className='customer-profile-block row full-width-inputs'>
					<div className='shipping-address'>
						<CurrentAddress
							ref = {(address) => {this.shippingAddress = address}}
							title = 'Shipping Address'
							modal = {this.props.modal}
							data = {this.props.shippingAddress}
							mode = 'create'
							/>
					</div>
				</div>
                )*/}
            </Col>
        )
    }
}
