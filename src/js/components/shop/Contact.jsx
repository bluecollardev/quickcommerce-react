import assign from 'object-assign'
 
import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

export default class Contact extends Component {    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div id="contact" className="container main-content">
                <div className="line5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="cursive text-center padding-top">~ Questions and Catering ~</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row ftext">
                        <div className="col-md-12">
                            <a id="features" />
                            {/*<p>Double click to close me.</p>*/}
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-9 col-xs-12 forma">
                            <form>
                                <input type="text" className="col-md-6 col-xs-12 name" name="name" placeholder="Name *" />
                                <input type="text" className="col-md-6 col-xs-12 Email" name="Email" placeholder="Email *" />
                                <input type="text" className="col-md-12 col-xs-12 Subject" name="Subject" placeholder="Subject" />
                                <textarea type="text" className="col-md-12 col-xs-12 Message" name="Message" placeholder="Message *" defaultValue={ ""} />
                                <div className="cBtn col-xs-12">
                                    <a className="btn btn-default" href="#">
                                        <i className="fa fa-times" />Clear Form
                                    </a>&nbsp;
                                    <a className="btn btn-primary" href="#">
                                        <i className="fa fa-share" />Send Message
                                    </a>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-3 col-xs-12 cont">
                            <ul>
                                <li>
                                    <i className="fa fa-home" />5512 Lorem Edmonton
                                </li>
                                <li>
                                    <i className="fa fa-phone" />+1 800 789 50 1
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-envelope" />info@phobulous.ca
                                    </a>
                                </li>
                                <li>
                                    <i className="fa fa-skype" />Phobulous (Edmonton)
                                </li>
                                {/*<li>
                                    <a href="#">
                                        <i className="fa fa-twitter" />Twitter
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-facebook-square" />Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-dribbble" />Dribbble
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-flickr" />Flickr
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <i className="fa fa-youtube-play" />YouTube
                                    </a>
                                </li>*/}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="line6">
                    <iframe src="https://maps.google.com/maps?q=phobulous edmonton&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height={750} frameBorder={0} style={{border: 0}} />
                </div>
            </div>
        )
    }
}