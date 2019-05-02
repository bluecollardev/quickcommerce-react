import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

export default class Contact extends Component {    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
          <main className="content-wrapper">{/* Main Content Wrapper */}
            <div id="contact">
                <section className='fw-section slide account-slide text-center'>
                    <span className='h1'>
                        <i className="cursive"><strong>Have a question?</strong></i>
                        <br />
                        Take aim and shoot.
                    </span>
                </section>
                
                <section className="container space-top-3x padding-bottom-2x">
                  {/*<h1>Contacts</h1>*/}
                  <div className="row padding-top">
                    <div className="col-sm-5 padding-bottom-2x">
                      <ul className="list-icon">
                        <li>
                          <i className="material-icons location_on" />
                          10055 80 Ave NW, Edmonton, AB T6E 1T3
                        </li>
                        <li>
                          <i className="material-icons phone" />
                          +(1) 414-1200
                        </li>
                        {/*<li>
                          <i className="material-icons phone_iphone" />
                          001 (800) 333-6578
                        </li>*/}
                        <li>
                          <i className="material-icons email" />
                          <a href="mailto:info@acecoffeeroasters.com">info@acecoffeeroasters.com</a>
                        </li>
                        <li>
                          <i className="socicon-skype" />
                          <a href="#">acecoffeeroasters</a>
                        </li>
                      </ul>{/* .list-icon */}
                      <p>Store hours: <span className="text-gray">8am - 4pm, Fri - Sun</span></p>
                      <span className="display-inline" style={{marginBottom: 6}}>Social accounts: &nbsp;&nbsp;</span>
                      <div className="social-bar display-inline">
                        <a href="#" className="sb-facebook" data-toggle="tooltip" data-placement="top" title="Facebook">
                          <i className="socicon-facebook" />
                        </a>
                        <a href="#" className="sb-google-plus" data-toggle="tooltip" data-placement="top" title data-original-title="Google+">
                          <i className="socicon-googleplus" />
                        </a>
                        <a href="#" className="sb-twitter" data-toggle="tooltip" data-placement="top" title="Twitter">
                          <i className="socicon-twitter" />
                        </a>
                        <a href="#" className="sb-instagram" data-toggle="tooltip" data-placement="top" title data-original-title="Instagram">
                          <i className="socicon-instagram" />
                        </a>
                      </div>{/* .social-bar */}
                    </div>{/* .col-sm-5 */}
                    <div className="col-sm-7 padding-bottom-2x">
                      <form method="post" className="ajax-form">
                        <div className="contact-form container">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="form-element">
                                <input type="text" className="form-control" name="name" placeholder="Name" />
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <div className="form-element">
                                <input type="email" className="form-control" name="email" placeholder="E-mail" />
                              </div>
                            </div>
                          </div>{/* .row */}
                          <div className="form-element">
                            <textarea rows={6} className="form-control" name="message" placeholder="Message" defaultValue={""} />
                          </div>
                          <button type="submit" className="btn btn-primary btn-block waves-effect waves-light space-top-none">Send Message</button>
                        </div>
                        <div className="status-message" />
                      </form>
                    </div>{/* .col-sm-7 */}
                  </div>{/* .row */}
                </section>

                <div className="row">
                    <div className="col-xs-12 padding-top-2x">
                        <iframe src="https://maps.google.com/maps?q=acecoffeeroasters&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height={750} frameBorder={0} style={{border: 0}} />
                    </div>
                </div>
            </div>
          </main>
        )
    }
}