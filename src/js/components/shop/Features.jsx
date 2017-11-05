import React, { Component } from 'react'

export default class Features extends Component {
    render() {
        return (
            <section className="container space-top space-bottom padding-top-3x padding-bottom-3x">
                <div className="row">
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="feature text-center">
                      <div className="feature-icon">
                        <i className="material-icons location_on" />
                      </div>
                      <h4 className="feature-title">Pick-up or Online Delivery</h4>
                      <p className="feature-text">Free shipping on all orders over $100</p>
                    </div>
                  </div>
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="feature text-center">
                      <div className="feature-icon">
                        <i className="material-icons autorenew" />
                      </div>
                      <h4 className="feature-title">Money Back Guarantee</h4>
                      <p className="feature-text">We return money within 30 days</p>
                    </div>
                  </div>
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="feature text-center">
                      <div className="feature-icon">
                        <i className="material-icons headset_mic" />
                      </div>
                      <h4 className="feature-title">24/7 Online Support</h4>
                      <p className="feature-text">Friendly 24/7 customer support</p>
                    </div>
                  </div>
                  
                  <div className="col-md-3 col-sm-6">
                    <div className="feature text-center">
                      <div className="feature-icon">
                        <i className="material-icons credit_card" />
                      </div>
                      <h4 className="feature-title">Secure Online Payments</h4>
                      <p className="feature-text">We posess SSL / Secure Certificate</p>
                    </div>
                  </div>
                </div>
            </section>
        )
    }
}