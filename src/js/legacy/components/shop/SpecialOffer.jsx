import React, { Component } from 'react'

export default class SpecialOffer extends Component {
    render() {
        return (
            <div className="col-lg-3 col-md-4">
                <div className="info-box text-center">
                  <h2>Special Offer<br /><span className="text-danger">-30%</span></h2>
                  <a href="#/product" className="inline">
                    <img src="img/shop/special-offer.jpg" alt="Special Offer" />
                  </a>
                  <h3 className="lead text-normal space-bottom-half"><a href="#/product" className="link-title">FLOS Outdoor Lightning</a></h3>
                  <span className="lead text-normal text-gray text-crossed">$800.00</span>
                  <span className="h4 text-normal text-danger">$560.00</span>
                  
                  
                  <div className="countdown space-top-half padding-top" data-date-time="07/30/2017 12:00:00">
                    <div className="item">
                      <div className="days">00</div>
                      <span className="days_ref">Days</span>
                    </div>
                    <div className="item">
                      <div className="hours">00</div>
                      <span className="hours_ref">Hours</span>
                    </div>
                    <div className="item">
                      <div className="minutes">00</div>
                      <span className="minutes_ref">Mins</span>
                    </div>
                    <div className="item">
                      <div className="seconds">00</div>
                      <span className="seconds_ref">Secs</span>
                    </div>
                  </div>
                </div>
                <div className="padding-bottom-2x visible-xs" />
            </div>
        )
    }
}