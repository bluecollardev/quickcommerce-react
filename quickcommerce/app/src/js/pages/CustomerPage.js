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
					<img src='assets/application/images/ideal-logo-lg.png' style={{maxWidth: '100%', display: 'block', margin: '0 auto'}} />
                </div>
			</CustomerComponent>
        )
    }
})