import React, { Component } from 'react'

//import CatalogFilterBar from '../common/CatalogFilterBar.jsx'
import BrowserStep from './BrowserStep.jsx'


class BrowserContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <main>
        <section className="container-fluid padding-bottom-3x">
          <div className="row padding-top-half">
            {this.props.children}
          </div>
          <hr/>
        </section>
        {/* .container */}
      </main>
    )
  }
}

export default BrowserContainer
