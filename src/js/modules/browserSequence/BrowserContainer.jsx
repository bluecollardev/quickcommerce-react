import React, { Component } from 'react'

//import CatalogFilterBar from '../common/CatalogFilterBar.jsx'
import BrowserStep from './BrowserStep.jsx'


class BrowserContainer extends Component {
  constructor(props) {
    super(props)

    // Store our stepper instance
    // Stepper maintains its own state and store
    //this.stepper = new Stepper()
    //this.stepper.setSteps(this.configureSteps())
  }

  render() {
    //let steps = this.stepper.getSteps() // Stepper extends store, we're good
    //let categories = this.props.catalogStore.getCategories()

    return (
      <section className="container-fluid padding-bottom-3x">
        <div className="row padding-top-half">
          {this.props.children}
        </div>
        <hr/>
        <div className="pagination padding-bottom">
          <div className="page-numbers">
            <a href="#">1</a>
            <a href="#">2</a>
            <span className="active">3</span>
            <a href="#">4</a>
            <span>...</span>
            <a href="#">10</a>
          </div>
          <div className="pager">
            <a href="#">Prev</a>
            <span>|</span>
            <a href="#">Next</a>
          </div>
        </div>
      </section>
    )
  }
}

export default BrowserContainer
