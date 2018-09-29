import React, { Component } from 'react'

import Stepper from 'qc-react/modules/stepper/Stepper.jsx'

//import BrowserStep from './BrowserStep.jsx'

import BrowserContainer from './BrowserContainer'

class BrowserSequence extends Component {
  constructor(props) {
    super(props)

    // Store our stepper instance
    // Stepper maintains its own state and store
    this.stepper = new Stepper()
    //this.stepper.setSteps(this.configureSteps())
  }

  render() {
    //let steps = this.stepper.getSteps() // Stepper extends store, we're good
    //let categories = this.props.catalogStore.getCategories()

    return (
      <BrowserContainer>
        {this.props.children}
      </BrowserContainer>
    )
  }
}

export default BrowserSequence
