import React, { Component } from 'react';
import CurrentAddress from './CurrentAddress.jsx'

export default () => {
    return class MailingAddress extends Component {
        constructor(props) {
            super(props)
        }
        
        render() {
            return (
                <CurrentAddress
                    {...props}
                    title = 'Billing Address'
                    />
            )
        }
    }
}