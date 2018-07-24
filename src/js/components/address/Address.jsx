import { inject, observer } from 'mobx-react'
import assign from 'object-assign'

import React, { Component } from 'react'

import fieldNames from '../../forms/AddressFields.jsx'
import CurrentAddress from './CurrentAddress.jsx'

@inject(deps => ({
  actions: deps.actions,
  mappings: deps.mappings,
  customerService: deps.customerService, // Not used, just in case!
  customerAddressService: deps.customerAddressService,
  geoService: deps.geoService,
  settingStore: deps.settingStore
})) @observer
class Address extends Component {
  constructor(props) {
    super(props)

    this.onCreate = this.onCreate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onError = this.onError.bind(this)
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  componentWillReceiveProps(newProps) {
    console.log('componentWillReceiveProps')
    console.log(newProps)
  }

  onCreate(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!this.props.isSubForm) {
      this.props.triggerAction((formData) => {
        this.props.customerAddressService.post(formData, this.onSaveSuccess, this.onError)
      })
    }

    /*if (this.props.modal) {
      this.setState({
        addressString: CurrentAddress.getAddressString(assign({}, this.props.getForm())),
        data: assign({}, this.state.data, this.props.getForm())
      }, this.hideAddressModal())
    }*/
  }

  onUpdate(e) {
    e.preventDefault()
    e.stopPropagation()

    if (!this.props.isSubForm) {
      this.props.triggerAction((formData) => {
        this.props.customerAddressService.put(formData, this.onSaveSuccess, this.onError)
      })
    } else if (typeof this.props.onUpdate === 'function') {
      console.log('execute CurrentAddress onUpdate handler')
      let fn = this.props.onUpdate
      fn(this.props.getForm())
    }

    /*if (this.props.modal) {
      this.setState({
        addressString: CurrentAddress.getAddressString(assign({}, this.props.getForm())),
        data: assign({}, this.state.data, this.props.getForm())
      }, this.hideAddressModal())
    }*/
  }

  onCancel(e) {
    e.preventDefault()
    e.stopPropagation()

    console.log('executing CurrentAddress onCancel')
    if (typeof this.props.onCancel === 'function') {
      console.log('execute handler')
      let fn = this.props.onCancel
      fn(e)
    }

    this.hideAddressModal()
  }

  onSaveSuccess(response) {
    console.log('executing CurrentAddress onSaveSuccess')
    if (typeof this.props.onSaveSuccess === 'function') {
      console.log('execute handler')
      let fn = this.props.onSaveSuccess
      fn(response)
    }

    this.hideAddressModal()
  }

  onError(response) {
    console.log('executing CurrentAddress onError')
    if (typeof this.props.onError === 'function') {
      console.log('execute handler')
      let fn = this.props.onError
      fn(response)
    }

    this.setState({errors: response.error})
  }

  render() {
    if (this.props.isSummaryAddress) {
      //debugger
    }

    return (
      <CurrentAddress
        data={this.props.data}
      />
    )
  }
}

export default Address
export { Address }
