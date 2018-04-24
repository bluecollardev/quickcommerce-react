import React, { Component } from 'react'

class PagePreloader extends Component {
  render() {
    return (
      <div className="page-preloader">
        <div className="preloader">
          <img src="img/preloader.gif" alt="Preloader"/>
        </div>
      </div>
    )
  }
}

export default PagePreloader
