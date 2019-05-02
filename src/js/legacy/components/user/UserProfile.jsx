import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import CurrentAddress from '../address/CurrentAddress.jsx'
import CustomerInfo from '../customer/CustomerInfo.jsx'

import AuthenticatedComponent from '../AuthenticatedComponent'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService
}))
@observer
class UserProfile extends Component {
    // TODO: Invalid default props here...
    static defaultProps = {
        pk: 'customer_id',
        mode: 'edit',
        displayProfile: true,
        displayBillingAddress: false,
        displayShippingAddress: false,
        displayShippingAddress: false,
        billingAddressString: '',
        billingAddress: {},
        shippingAddressString: '',
        shippingAddress: {},
        user: {
            id: null, 
            address_id: null, 
            addresses: [], 
            firstname: '',
            middlename: '',
            lastname: '',
            company_name: '',
            email: '',
            telephone: '',
            fax: ''
        },
        customer: {
            id: null, 
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
            <Col sm={12}>
                {this.props.displayProfile && mode === 'create' && (
                    <CustomerInfo
                        onCancel={this.props.onCancel}
                        onSaveSuccess={this.props.onSaveSuccess} />
                )}

                {this.props.displayProfile && mode === 'edit' && (
                    <CustomerInfo
                        data={this.props.customer}
                        onCancel={this.props.onCancel}
                        onSaveSuccess={this.props.onSaveSuccess} />
                )}

                {this.props.displayBillingAddress && (
                <CurrentAddress
                    addressString = {this.props.billingAddressString}
                    data = {this.props.billingAddress}
                    title = 'Billing Address'
                    />
                )}

                {this.props.displayShippingAddress && (
                <CurrentAddress
                    addressString = {this.props.shippingAddressString}
                    data = {this.props.shippingAddress}
                    title = 'Shipping Address'
                    />
                )}
            </Col>
        )
    }
}

export default AuthenticatedComponent(UserProfile)
export { UserProfile }