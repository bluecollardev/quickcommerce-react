import { inject, observer } from 'mobx-react'
import CustomerProfile from 'qc-react/components/customer/AuthenticatedCustomerFullProfile.jsx'
//import SignInForm from 'qc-react/components/account/SignInForm.jsx'
import CreditCardForm from 'qc-react/components/payment/CreditCardForm.jsx'

import { PosComponent } from 'qc-react/components/PosComponent.jsx'
import React from 'react'

import { Col, Input, Row } from 'react-bootstrap'

@inject(deps => ({
  actions: deps.actions,
  authService: deps.authService,
  customerService: deps.customerService,
  settingService: deps.authService,
  customerStore: deps.customerStore,
  mappings: deps.mappings, // Per component or global scope?
  translations: deps.translations, // i8ln transations
  roles: deps.roles, // App level roles, general authenticated user (not customer!)
//userRoles: deps.userRoles, // Shortcut or implement via HoC?
  user: deps.user // Shortcut or implement via HoC?
  })) @observer
class CheckoutComponent extends PosComponent.wrappedComponent {
  render() {
    return (
      <main className="content-wrapper">
        <form method="post" className="container padding-top-3x padding-bottom-2x">
          <h1 className="space-top-half">Checkout</h1>
          <div className="row padding-top">
            <div className="col-sm-7 padding-bottom">
              <Row>
                <CustomerProfile
                  customer={this.props.customerStore.customer}
                  displayAddresses='single'
                  billingAddress={this.props.customerStore.billingAddress}
                  shippingAddress={this.props.customerStore.shippingAddress}
                  mode='edit'
                  displayProfile={true}
                  displayCurrentAddress={true}
                  displayBillingAddress={true}
                  displayShippingAddress={true}
                  onCreateSuccess={this.onCreateSuccess}
                  onCancel={() => {
                    window.location.hash = '/'
                  }}>
                </CustomerProfile>
              </Row>
              <div className="form-group">
                <label className="radio radio-inline">
                  <input type="radio" name="co_shipping" defaultChecked/> Ship to this address
                </label>
                <label className="radio radio-inline">
                  <input type="radio" name="co_shipping"/> Ship to different address
                </label>
              </div>
              <Row>
                <Col md={12}>
                  <Row>
                    <CreditCardForm/>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="col-md-4 col-md-offset-1 col-sm-4 padding-bottom">
              <aside>
                <h3>Cart total:</h3>
                <h4>$460.90</h4>
                <p className="text-sm text-gray">* Note: This amount includes costs for shipping to address you provided.</p>
                <a href="#/cart" className="btn btn-default btn-ghost icon-left btn-block">
                  Back To Cart
                </a>
                <button type="submit" className="btn btn-primary btn-block waves-effect waves-light space-top-none">Checkout</button>
              </aside>
              <aside>
                <div className='receipt'
                  style={{
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    padding: '18px',
                    border: '1px solid black'
                  }}>
                  {this.renderCachedReceipt()}
                </div>
              </aside>
            </div>
          </div>
        </form>
      </main>
    )
  }
}

export default CheckoutComponent
