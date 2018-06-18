import React from 'react'

import { FormControl } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'

const getMappedValue = FormHelper.getMappedValue

const InputFormControl = (props) => {
  // Render the InputFormControl
  const { field, fields, mapping, data } = props

  // props must have the following defined:
  // fields (function)

  // mappings is not the normal mapping, just the ones required for the autocomplete
  // structure: { field: ..., id: ..., code: ... }
  // TODO: id and code should be optional

  // Set resolve flag on getMappedValue to true or you'll get a error like:
  // "Cannot convert object to primitive value"?

  let hasMapping = false
  if (typeof mapping !== 'undefined' && mapping.hasOwnProperty('property')) {
    hasMapping = true
  }

  let name = ''
  if (hasMapping) {
    name = (typeof props.name === 'string') ? props.name : mapping.property
  } else {
    name = (typeof props.name === 'string') ? props.name: name
  }

  let inputProps = undefined
  if (hasMapping) {
    inputProps = props.fields(mapping.property, getMappedValue(mapping, data))
  }

  return (
    <FormControl
      readOnly={props.readOnly}
      name={name}
      type={props.type}
      onClick={props.onClick}
      componentClass={props.componentClass}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      {...inputProps}
    />
  )
}

const HiddenInput = (props) => {
  // Render the InputFormControl
  const { field, fields, mapping, data } = props

  let name = (typeof props.name === 'string') ? props.name: mapping.property
  // props must have the following defined:
  // fields (function)

  // mappings is not the normal mapping, just the ones required for the autocomplete
  // structure: { field: ..., id: ..., code: ... }
  // TODO: id and code should be optional

  // Set resolve flag on getMappedValue to true or you'll get a error like:
  // "Cannot convert object to primitive value"?
  return (
    <input
      readOnly={props.readOnly}
      name={name}
      type='hidden'
      {...props.fields(mapping.property, getMappedValue(mapping, data))}>
    </input>
  )
}

const DatePicker = (props) => {
  return <InputFormControl type='date' {...props} />
}

const TimePicker = (props) => {
  return <InputFormControl type='time' {...props} />
}

const DateInput = (props) => {
  return (<DatePicker {...props} />)
}

const DateTimeInput = (props) => {
  return (<DatePicker {...props} />)
}

const TimeInput = (props) => {
  return (<TimePicker {...props} />)
}

const NumericInput = (props) => {
  return (<InputFormControl type='number' {...props} />)
}

const TelephoneInput = (props) => {
  return (<InputFormControl type='tel' {...props} />)
}

const EmailInput = (props) => {
  return (<InputFormControl type='email' {...props} />)
}

const PostalCodeInput = (props) => {
  return (<InputFormControl type='text' {...props} />)
}

const SinInput = (props) => {
  return (<InputFormControl type='number' {...props} />)
}

const SsnInput = (props) => {
  return (<InputFormControl type='number' {...props} />)
}

export default InputFormControl
export { InputFormControl, HiddenInput, DateInput, DateTimeInput, TimeInput, NumericInput, TelephoneInput, EmailInput, PostalCodeInput, SinInput, SsnInput }
