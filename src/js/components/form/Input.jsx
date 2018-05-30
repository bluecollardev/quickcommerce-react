import React from 'react'

import { FormControl } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'

const getMappedValue = FormHelper.getMappedValue

const InputFormControl = (props) => {
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
    <FormControl
      name={name}
      type={props.type}
      componentClass={props.componentClass}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      {...props.fields(mapping.property, getMappedValue(mapping, data))}>
    </FormControl>
  )
}

const DatePicker = (props) => {
  //return <input type='date' />
  return <FormControl type='date' {...props} />
}

const TimePicker = (props) => {
  //return <input type='time' />
  return <FormControl type='time' {...props} />
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
  /*return (
   <input type='number' {...props} />
   )*/

  return (<FormControl type='number' {...props} />)
}

const TelephoneInput = (props) => {
  /*return (
   <input type='tel' {...props} />
   )*/

  return (<FormControl type='tel' {...props} />)
}

const EmailInput = (props) => {
  /*return (
   <input type='email' {...props} />
   )*/

  return (<FormControl type='email' {...props} />)
}

const PostalCodeInput = (props) => {
  /*return (
   <input type='text' {...props} />
   )*/

  return (<FormControl type='text' {...props} />)
}

const SinInput = (props) => {
  /*return (
   <input type='text' {...props} />
   )*/

  return (<FormControl type='number' {...props} />)
}

const SsnInput = (props) => {
  /*return (
   <input type='text' {...props} />
   )*/

  return (<FormControl type='number' {...props} />)
}

export default InputFormControl
export { DateInput, DateTimeInput, TimeInput, NumericInput, TelephoneInput, EmailInput, PostalCodeInput, SinInput, SsnInput }
