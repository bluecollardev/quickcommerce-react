import React, { Component } from 'react'
import { Dispatcher } from 'flux'
import PropTypes from 'prop-types'

import { unwrapComponent, resolveComponent } from '../../helpers/Component.js'

import BrowserActions from '../../actions/BrowserActions.jsx'
import { BrowserStore } from '../../stores/BrowserStore.jsx'

import itemFieldNames from '../../forms/ItemFields.jsx'

class AbstractBrowserStep extends Component {
  static propTypes = {
    itemMappings: PropTypes.object, // TODO: object.isRequired
    onAddToCartClicked: PropTypes.func,
    onItemClicked: PropTypes.func,
    onFilterSelected: PropTypes.func,
    onStepClicked: PropTypes.func
  }

  static defaultProps = {
    itemMappings: itemFieldNames, // Defaults from ItemFields
    onItemClicked: () => {},
    onAddToCartClicked: () => {},
    onFilterSelected: () => {},
    onStepClicked: () => {}
  }

  constructor(props) {
    super(props)

    this.configureRow = this.configureRow.bind(this)
    //this.getInitialState = this.getInitialState.bind(this)
    this.loadBrowserData = this.loadBrowserData.bind(this)

    // Initialize or set BrowserStep dispatcher
    if (!props.hasOwnProperty('dispatcher')) {
      this.dispatcher = new Dispatcher()
    } else {
      this.dispatcher = props.dispatcher
    }

    // Initialize or set BrowserStep store
    if (!props.hasOwnProperty('store')) {
      this.store = new BrowserStore(this.dispatcher)
    } else {
      this.store = props.store
    }

    // Initialize or set BrowserStep actions
    if (!props.hasOwnProperty('actions')) {
      this.actions = BrowserActions(this.dispatcher)
    } else {
      this.actions = props.actions
    }

    this.store.addChangeListener(this.loadBrowserData)

    //this.state = this.getInitialState()
  }

  componentDidMount() {
    //let cards = document.getElementsByClassName('card')
    //HtmlHelper.equalHeights(cards, true)
    this.loadBrowserData()
  }

  componentDidUpdate() {
    let cards = document.getElementsByClassName('card')
    //HtmlHelper.equalHeights(cards, true)
  }

  componentWillUnmount() {
    if (typeof this.loadBrowserData === 'function') {
      this.store.removeChangeListener(this.loadBrowserData)
    }
  }

  // Need to pass in non-default actions, this component needs some work, right now it's a hassle to get it working
  // in any manner other than with Quick Commerce endpoints
  setActions(actions) {
    this.actions = actions
  }

  loadBrowserData() {
    //throw new Error('loadBrowserData has not been implemented')
  }

  reset() {
    this.props.stepper.start()
  }

  configureRow(rowComponent) {
    let that = this
    let fn = null

    // Configure product browser row
    if (this.props.hasOwnProperty('onItemClicked') && typeof this.props.onItemClicked === 'function') {

      // Wrap the function in a generic handler so we can pass in custom args
      let callback = fn = this.props.onItemClicked
      fn = function () {
        // What's the current step?
        let step = that.store.getConfig()

        // Make sure there's a next step before calling it into action
        // Also, subtract a step to account for zero index
        if (that.props.stepper.currentStep < (that.props.stepper.steps.length - 1)) {
          that.props.stepper.next()
        }

        // Execute our handler
        callback(...arguments)
      }
    } else {
      fn = this.props.onItemClicked
    }

    // The rowComponent may be wrapped in a mobx injector
    // Unwrap it - we need to add these properties to the row itself
    let row = unwrapComponent(rowComponent)

    // Override default component props and decorate them with our passed in props
    row.defaultProps.onItemClicked = fn
    row.defaultProps.onAddToCartClicked = this.props.onAddToCartClicked // Shortcut - quick add to cart
    row.defaultProps.stepper = this.props.stepper

    return rowComponent
  }

  /*render() {
    return null
  }*/
}

export default AbstractBrowserStep
