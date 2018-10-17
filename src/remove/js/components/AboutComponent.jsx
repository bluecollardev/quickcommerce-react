import React, { Component } from 'react'

/* Site specific imports */

class AboutComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <main className='content-wrapper'>
        <section id='about'>
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
                <p className=' space-top'>Respecting the science and craft of the past, our team of reasters have developed an evolving portfolio of coffees that reflect our passion, philosophy and
                  commitment to sensible roasting... the end goal - delicious artisan coffee.</p>
              </div>
              <div className='col-sm-6 col-md-offset-1 padding-bottom'>
                <h3>Mission</h3>
                <div className='quotation padding-top'>
                  <div className='quotation-author'>
                    <div className='quotation-author-ava'>
                      <img src='img/team/quote_author.jpg' alt='James Cameron'/>
                    </div>
                  </div>
                  <blockquote>
                    <p>Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem.</p>
                    <cite>Joe Parottino, Founder Ace Coffee Roasters</cite>
                  </blockquote>
                </div>
              </div>
            </div>
            <hr className='padding-bottom'/>
            <h3>Our Team</h3>
            <div className='row padding-top'>

              <div className='col-xs-6 col-md-3'>
                <div className='teammate'>
                  <div className='teammate-thumb'>
                    <div className='social-bar text-center space-bottom'>
                      <a href='#' className='sb-skype' data-toggle='tooltip' data-placement='top' title='Skype'>
                        <i className='socicon-skype'/>
                      </a>
                      <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                        <i className='socicon-facebook'/>
                      </a>
                      <a href='#' className='sb-google-plus' data-toggle='tooltip' data-placement='top' title data-original-title='Google+'>
                        <i className='socicon-googleplus'/>
                      </a>
                    </div>
                    <img src='img/team/01.jpg' alt='Teammate'/>
                  </div>
                  <h4 className='teammate-name'>Joe Parottino</h4>
                  <span className='teammate-position'>Founder, Managing Director</span>
                </div>
              </div>

              <div className='col-xs-6 col-md-3'>
                <div className='teammate'>
                  <div className='teammate-thumb'>
                    <div className='social-bar text-center space-bottom'>
                      <a href='#' className='sb-twitter' data-toggle='tooltip' data-placement='top' title='Twitter'>
                        <i className='socicon-twitter'/>
                      </a>
                      <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                        <i className='socicon-facebook'/>
                      </a>
                      <a href='#' className='sb-instagram' data-toggle='tooltip' data-placement='top' title data-original-title='Instagram'>
                        <i className='socicon-instagram'/>
                      </a>
                    </div>
                    <img src='img/team/02.jpg' alt='Teammate'/>
                  </div>
                  <h4 className='teammate-name'>Kate</h4>
                  <span className='teammate-position'>Master Roaster</span>
                </div>
              </div>

              <div className='col-xs-6 col-md-3'>
                <div className='teammate'>
                  <div className='teammate-thumb'>
                    <div className='social-bar text-center space-bottom'>
                      <a href='#' className='sb-twitter' data-toggle='tooltip' data-placement='top' title='Twitter'>
                        <i className='socicon-twitter'/>
                      </a>
                      <a href='#' className='sb-linkedin' data-toggle='tooltip' data-placement='top' title='LinkedIn'>
                        <i className='socicon-linkedin'/>
                      </a>
                      <a href='#' className='sb-dribbble' data-toggle='tooltip' data-placement='top' title data-original-title='Dribbble'>
                        <i className='socicon-dribbble'/>
                      </a>
                    </div>
                    <img src='img/team/03.jpg' alt='Teammate'/>
                  </div>
                  <h4 className='teammate-name'>Taylor White</h4>
                  <span className='teammate-position'>Brand Director</span>
                </div>
              </div>

              <div className='col-xs-6 col-md-3'>
                <div className='teammate'>
                  <div className='teammate-thumb'>
                    <div className='social-bar text-center space-bottom'>
                      <a href='#' className='sb-skype' data-toggle='tooltip' data-placement='top' title='Skype'>
                        <i className='socicon-skype'/>
                      </a>
                      <a href='#' className='sb-facebook' data-toggle='tooltip' data-placement='top' title='Facebook'>
                        <i className='socicon-facebook'/>
                      </a>
                      <a href='#' className='sb-google-plus' data-toggle='tooltip' data-placement='top' title data-original-title='Google+'>
                        <i className='socicon-googleplus'/>
                      </a>
                    </div>
                    <img src='img/team/04.jpg' alt='Teammate'/>
                  </div>
                  <h4 className='teammate-name'>Suasanna Davis</h4>
                  <span className='teammate-position'>Sales Manager</span>
                </div>
              </div>
            </div>
          </div>
          <div className='ace-video-wrapper fw-section padding-top-3x'>
            <div className='ace-video'>
              <div className='container padding-top-3x padding-bottom-3x text-center'>
                <div className='space-top-3x space-bottom'>
                  <a href='https://player.vimeo.com/video/245274383?color=77cde3&title=0&byline=0&portrait=0' className='video-popup-btn'>
                    <i className='material-icons play_arrow'/>
                  </a>
                  <h3 className='padding-top-2x padding-bottom-2x'>The ACE Coffee Story</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }
}

export default AboutComponent
