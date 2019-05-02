import React, { Component } from 'react'

export default class SiteLogo extends Component {
    render() {
        return (
            <div className="site-logo-wrapper">
                <a href="#/"className="site-logo visible-desktop">
                  <span><img src={this.props.image} /></span>
                </a>
                <a href="#/" className="site-logo visible-mobile">
                  <span><img src={this.props.image} /></span>
                </a>
            </div>
        )
    }
}