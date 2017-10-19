import React, { Component } from 'react'

// Higher order component adds Auth functions
import AuthenticatedComponent from '../components/AuthenticatedComponent.jsx'
import CustomerComponent from '../components/CustomerComponent.jsx'
import CustomerStore from '../stores/CustomerStore.jsx'

export default AuthenticatedComponent(class CustomerPage extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
			customer: CustomerStore.customer
		}
		
		this.parseAddresses = this.parseAddresses.bind(this)
	}
	
	componentDidMount() {
		let customerId = this.props.match.params.customerId
		CustomerService.fetch(customerId)
    }
	
	parseAddresses(addressContacts) {
		let addresses = []
		
		addressContacts = addressContacts || null
		if (addressContacts === null) return addresses
		
		if (addressContacts instanceof Array) {
			// Pretty sure I don't need this now that I have field mappings
			addresses = addressContacts.map(addressContact => {
				// TODO: Return a typed object
				/*let city = {
					cityId: addressContact.address.city.id,
					cityCode: addressContact.address.city.code,
					city: addressContact.address.city.name
				}
				
				let zone = {
					zoneId: addressContact.address.territory.id,
					zoneCode: addressContact.address.territory.code,
					zone: addressContact.address.territory.name
				}
				
				let country = {
					countryId: addressContact.address.country.id,
					countryCode: addressContact.address.country.code,
					country: addressContact.address.country.name
				}*/
				
				return { 
					...addressContact.address,
					//...city, ...zone, ...country,
					comments: addressContact.comments,
					order: addressContact.order,
					version: addressContact.version
				}
			})				
		}
		
		return addresses
	}
	
	render() {       
        return (
            <CustomerComponent
                {...this.props}
				customer = {this.state.customer}>
				<div className='column mcb-column one-third column_column'
					style = {{
						marginLeft: 'auto',
						marginRight: 'auto',
						marginTop: '6rem',
						marginBottom: '9.5rem',
						float: 'none'
					}}>
                </div>
			</CustomerComponent>
        )
    }
})