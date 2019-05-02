import React, { Component } from 'react'

export default class PagePreloader extends Component {
    render() {
        return (
            <div className="page-preloader">
              <div className="preloader">
                <img src="img/preloader.gif" alt="Preloader" />
              </div>
            </div>
        )
    }
}