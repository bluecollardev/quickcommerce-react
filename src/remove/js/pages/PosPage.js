// Higher order component adds Auth functions
import AuthenticatedComponent from 'qc-react/components/AuthenticatedComponent.jsx'
// The actual shopping cart component itself (includes embedded ProductBrowser)
import PosComponent from 'qc-react/components/PosComponent.jsx' // TODO: Might be a good idea later to wrap
// this
import React, { Component } from 'react'

export default AuthenticatedComponent(class PosPage extends Component {
  constructor(props) {
    super(props)

    /*this.showBillingAddressModal = this.showBillingAddressModal.bind(this)
     this.hideBillingAddressModal = this.hideBillingAddressModal.bind(this)
     this.showShippingAddressModal = this.showShippingAddressModal.bind(this)
     this.hideShippingAddressModal = this.hideShippingAddressModal.bind(this)*/
    this.hideLoginModal = this.hideLoginModal.bind(this)
    this.delayHideLoginModal = this.delayHideLoginModal.bind(this)
    this.onLoginSuccess = this.onLoginSuccess.bind(this)
    this.onLoginResponse = this.onLoginResponse.bind(this)
    this.setCustomer = this.setCustomer.bind(this)

    this.getInitialState = this.getInitialState.bind(this)

    let state = this.getInitialState()

    this.state = state
    console.log('state data')
    console.log(this.state)
  }

  getInitialState() {
    return {
      logged: false,
      customer: null
    }
  }

  hideLoginModal(e) {
    console.log('event')
    console.log(e)
    console.log('hiding modal')
    this.setState({ logged: true })
  }

  onLoginSuccess(customer) {
    this.setCustomer(customer)

  }

  onLoginResponse(customer) {
    this.delayHideLoginModal()
  }

  setCustomer(customer) {
    if (typeof customer === 'undefined' || customer === null) {
      return this.state.logged
    }

    if (customer !== false) {
      this.setState({
        logged: true,
        customer: customer
      })
    } else {
      this.setState({
        logged: false,
        customer: null
      })
    }
  }

  delayHideLoginModal() {
    let that = this

    setTimeout(function () {
      console.log('hiding modal')
      that.setState({ logged: true })
    }, 3000)
  }

  showLoginModal() {
    this.setState({ logged: false })
  }

  render() {
    return (
      <PosComponent
        location={this.props.location}
        match={this.props.match}
        logged={this.props.loggedIn}
        onLoginSuccess={this.onLoginSuccess}
        customer={this.state.customer}
        user={this.state.user}
      />
    )
  }
})
