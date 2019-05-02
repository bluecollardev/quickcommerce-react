import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

export default class About extends Component {    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <main className='content-wrapper'>{/* Main Content Wrapper */}
              <section id='about'>
                <section className='fw-section slide account-slide text-center'>
                    <span className='h1'>
                        <i className="cursive"><strong>Hello friend.</strong></i>
                        <br />
                        Meet our team!
                    </span>
                </section>
                
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <h3 className='cursive text-center padding-top'>About Us</h3>
                        </div>
                    </div>
                </div>
                <div className='container-fluid'>
                    <div className='row padding-top'>
                      <div className='col-md-5 col-sm-6 padding-bottom'>
                        <h3>The Brand</h3>
                        <p className=' space-top'>Respecting the science and craft of the past, our team of reasters have developed an evolving portfolio of coffees that reflect our passion, philosophy and commitment to sensible roasting... the end goal - delicious artisan coffee.</p>
                      </div>{/* .col-md-5.col-sm-6 */}
                      <div className='col-sm-6 col-md-offset-1 padding-bottom'>
                        <h3>Mission</h3>
                        <div className='quotation padding-top'>
                          <div className='quotation-author'>
                            <div className='quotation-author-ava'>
                              <img src='img/team/quote_author.jpg' alt='James Cameron' />
                            </div>
                          </div>
                          <blockquote>
                            <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem.</p>
                            <cite>Joe Parottino, Founder Ace Coffee Roasters</cite>
                          </blockquote>
                        </div>{/* .quotation */}
                      </div>{/* .col-md-6.col-sm-6.col-md-offset-1 */}
                    </div>{/* .row */}
                    <hr className='padding-bottom' />
                    
                    <h3>Our Team</h3>
                    <div className='row padding-top'>
                      {/* Teammate */}
                      <div className='col-xs-6 col-md-3'>
                        <div className='teammate'>
                          <div className='teammate-thumb'>
                            <div className='social-bar text-center space-bottom'>
                              <a href='#' className='sb-skype' data-toggle='tooltip' data-placement='top' title='Skype'>
                                <i className='socicon-skype' />
                              </a>
                              <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                                <i className='socicon-facebook' />
                              </a>
                              <a href='#' className='sb-google-plus' data-toggle='tooltip' data-placement='top' title data-original-title='Google+'>
                                <i className='socicon-googleplus' />
                              </a>
                            </div>{/* .social-bar */}
                            <img src='img/team/01.jpg' alt='Teammate' />
                          </div>
                          <h4 className='teammate-name'>Joe Parottino</h4>
                          <span className='teammate-position'>Founder, Managing Director</span>
                        </div>{/* .teammate */}
                      </div>{/* .col-xs-6.col-md-3 */}
                      {/* Teammate */}
                      <div className='col-xs-6 col-md-3'>
                        <div className='teammate'>
                          <div className='teammate-thumb'>
                            <div className='social-bar text-center space-bottom'>
                              <a href='#' className='sb-twitter' data-toggle='tooltip' data-placement='top' title='Twitter'>
                                <i className='socicon-twitter' />
                              </a>
                              <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                                <i className='socicon-facebook' />
                              </a>
                              <a href='#' className='sb-instagram' data-toggle='tooltip' data-placement='top' title data-original-title='Instagram'>
                                <i className='socicon-instagram' />
                              </a>
                            </div>{/* .social-bar */}
                            <img src='img/team/02.jpg' alt='Teammate' />
                          </div>
                          <h4 className='teammate-name'>Kate</h4>
                          <span className='teammate-position'>Master Roaster</span>
                        </div>{/* .teammate */}
                      </div>{/* .col-xs-6.col-md-3 */}
                      {/* Teammate */}
                      <div className='col-xs-6 col-md-3'>
                        <div className='teammate'>
                          <div className='teammate-thumb'>
                            <div className='social-bar text-center space-bottom'>
                              <a href='#' className='sb-twitter' data-toggle='tooltip' data-placement='top' title='Twitter'>
                                <i className='socicon-twitter' />
                              </a>
                              <a href='#' className='sb-linkedin' data-toggle='tooltip' data-placement='top' title='LinkedIn'>
                                <i className='socicon-linkedin' />
                              </a>
                              <a href='#' className='sb-dribbble' data-toggle='tooltip' data-placement='top' title data-original-title='Dribbble'>
                                <i className='socicon-dribbble' />
                              </a>
                            </div>{/* .social-bar */}
                            <img src='img/team/03.jpg' alt='Teammate' />
                          </div>
                          <h4 className='teammate-name'>Taylor White</h4>
                          <span className='teammate-position'>Brand Director</span>
                        </div>{/* .teammate */}
                      </div>{/* .col-xs-6.col-md-3 */}
                      {/* Teammate */}
                      <div className='col-xs-6 col-md-3'>
                        <div className='teammate'>
                          <div className='teammate-thumb'>
                            <div className='social-bar text-center space-bottom'>
                              <a href='#' className='sb-skype' data-toggle='tooltip' data-placement='top' title='Skype'>
                                <i className='socicon-skype' />
                              </a>
                              <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                                <i className='socicon-facebook' />
                              </a>
                              <a href='#' className='sb-google-plus' data-toggle='tooltip' data-placement='top' title data-original-title='Google+'>
                                <i className='socicon-googleplus' />
                              </a>
                            </div>{/* .social-bar */}
                            <img src='img/team/04.jpg' alt='Teammate' />
                          </div>
                          <h4 className='teammate-name'>Suasanna Davis</h4>
                          <span className='teammate-position'>Sales Manager</span>
                        </div>{/* .teammate */}
                      </div>{/* .col-xs-6.col-md-3 */}
                    </div>{/* .row */}
                </div>
                {/* Video Popup */}
                <div className='fw-section padding-top-3x' style={{backgroundImage: 'url(img/video_bg.jpg)'}}>
                    <div className='container padding-top-3x padding-bottom-3x text-center'>
                      <div className='space-top-3x space-bottom'>
                        {/* Add '.light-skin' class to alter appearance. */}
                        <a href='https://player.vimeo.com/video/135832597?color=77cde3&title=0&byline=0&portrait=0' className='video-popup-btn'>
                          <i className='material-icons play_arrow' />
                        </a>
                      </div>
                      <p className='space-bottom-2x'>Quick Commerce - your reliable partner.</p>
                    </div>
                </div>
              </section>
            </main>
        )
    }
}