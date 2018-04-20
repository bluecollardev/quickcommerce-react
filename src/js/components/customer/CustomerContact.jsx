import { inject, observer } from 'mobx-react'
import assign from 'object-assign'

import React, { Component } from 'react'

import { Button, ControlLabel, FormGroup } from 'react-bootstrap'

import fieldNames from '../../forms/CustomerContactFields.jsx'

import { ContactTypeDropdown } from '../form/Dropdown.jsx'

import { EmailInput, NumericInput, TelephoneInput } from '../form/Input.jsx'

import FormComponent from '../FormComponent.jsx'

@inject(deps => ({
  actions: deps.actions,
  authService: deps.authService,
  customerService: deps.customerService,
  settingStore: deps.settingStore
  })) @observer
class CustomerContact extends Component {
  static defaultProps = {
    id: null,
    email: '',
    telephone: '',
    fax: ''
  }

  constructor(props) {
    super(props)

    this.onCreate = this.onCreate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSaveSuccess = this.onSaveSuccess.bind(this)
    this.onError = this.onError.bind(this)

    this.state = {data: assign({}, props.data)}
  }

  componentWillReceiveProps(newProps) {
    this.setState({data: assign({}, newProps.data)})
  }

  onCreate(e) {
    e.preventDefault()
    e.stopPropagation()

    this.props.triggerAction((formData) => {
      this.props.customerService.post(formData, this.onSaveSuccess, this.onError)
    })

    this.onSaveSuccess()
  }

  onUpdate(e) {
    e.preventDefault()
    e.stopPropagation()

    this.props.triggerAction((formData) => {
      this.props.customerService.put(formData, this.onSaveSuccess, this.onError)
    })

    this.onSaveSuccess()
  }

  onCancel(e) {
    e.preventDefault()
    e.stopPropagation()

    console.log('executing onCancel')
    if (typeof this.props.onCancel === 'function') {
      console.log('execute handler')
      let fn = this.props.onCancel
      fn(e)
    }
  }

  onSaveSuccess(response) {
    console.log('executing onSaveSuccess')
    if (typeof this.props.onSaveSuccess === 'function') {
      console.log('execute handler')
      let fn = this.props.onSaveSuccess
      fn(response)
    }
  }

  onError(response) {
    console.log('executing onError')
    if (typeof this.props.onError === 'function') {
      console.log('execute handler')
      let fn = this.props.onError
      fn(response)
    }

    this.setState({errors: response.error})
  }

  render() {
    const mappings = this.props.mappings || fieldNames

    let data = this.state.data

    return (
      <form>
        <div className='col-md-flex col-lg-flex'>
          <FormGroup className='col-xs-12 col-sm-4 col-sm-4'>
            <ControlLabel>Type*</ControlLabel>
            <ContactTypeDropdown optionValue items={this.props.settingStore.contactTypes}
              name={mappings.CONTACT_TYPE} {...this.props.fields(mappings.CONTACT_TYPE, this.props.getMappedValue(mappings.CONTACT_TYPE, data))}
            />
          </FormGroup>

          {this.props.type === 'email' && (
            <FormGroup className='col-xs-12 col-sm-8'>
              <ControlLabel>Email*</ControlLabel>
              <EmailInput name={mappings.EMAIL} {...this.props.fields(mappings.EMAIL, this.props.getMappedValue(mappings.EMAIL, data))} />
            </FormGroup>
          )}

          {this.props.type === 'phone' && (
            <FormGroup className='col-xs-12 col-sm-6'>
              <ControlLabel>Telephone*</ControlLabel>
              <TelephoneInput name={mappings.TELEPHONE} {...this.props.fields(mappings.TELEPHONE, this.props.getMappedValue(mappings.TELEPHONE, data))} />
            </FormGroup>
          )}

          {this.props.type === 'mobile' && (
            <FormGroup className='col-xs-12 col-sm-6'>
              <ControlLabel>Mobile</ControlLabel>
              <TelephoneInput name={mappings.MOBILE} {...this.props.fields(mappings.MOBILE, this.props.getMappedValue(mappings.MOBILE, data))} />
            </FormGroup>
          )}

          {(this.props.type === 'phone' || this.props.type === 'mobile') && (
            <FormGroup className='col-xs-12 col-sm-2'>
              <ControlLabel>Ext.</ControlLabel>
              <NumericInput name={mappings.EXT} {...this.props.fields(mappings.EXT, this.props.getMappedValue(mappings.EXT, data))} />
            </FormGroup>
          )}

          {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'create' && (
            <FormGroup>
              <Button bsStyle='success' onClick={this.onCreate}>Create Account</Button>&nbsp;
              <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
            </FormGroup>
          )}

          {this.props.displayActions && this.props.hasOwnProperty('mode') && this.props.mode === 'edit' && (
            <FormGroup>
              <Button bsStyle='success' onClick={this.onUpdate}>Update Info</Button>&nbsp;
              <Button onClick={this.onCancel}>Cancel</Button>&nbsp;
            </FormGroup>
          )}
        </div>
      </form>
    )
  }
}

export default FormComponent(CustomerContact)
export { CustomerContact }
