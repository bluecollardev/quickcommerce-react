import React from 'react'

import { FormControl, InputGroup } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'
import DateHelper from '../../helpers/Date.js'

const getMappedValue = FormHelper.getMappedValue

const InputFormControl = (props) => {
  // Render the InputFormControl
  const { field, fields, mapping, valueMapping, data } = props

  // props must have the following defined:
  // fields (function)

  // mappings is not the normal mapping, just the ones required for the autocomplete
  // structure: { field: ..., id: ..., code: ... }
  // TODO: id and code should be optional

  // Set resolve flag on getMappedValue to true or you'll get a error like:
  // 'Cannot convert object to primitive value'?

  let type = null
  let hasMapping = false

  if (typeof mapping !== 'undefined' && mapping.hasOwnProperty('property')) {
    hasMapping = true

    if (mapping.hasOwnProperty('type')) {
      type = mapping.type
    }
  }

  let useValueMapping = false

  if (typeof valueMapping !== 'undefined' && valueMapping !== false) {
    useValueMapping = true
  }

  let name = ''
  if (hasMapping && useValueMapping === false) {
    name = (typeof props.name === 'string') ? props.name : mapping.property
  } else if (hasMapping && useValueMapping === true) {
    name = (typeof props.name === 'string') ? props.name : mapping.value
  } else {
    name = (typeof props.name === 'string') ? props.name: name
  }

  let inputProps = undefined
  if (hasMapping) {
    if (type !== null) {
      inputProps = props.fields(
        (useValueMapping ? mapping.value : mapping.property),
        getMappedValue(mapping, data, useValueMapping),
        type,
        { onChange: props.onChange }
      )
    } else {
      inputProps = props.fields(
        (useValueMapping ? mapping.value : mapping.property),
        getMappedValue(mapping, data, useValueMapping),
        null,
        { onChange: props.onChange }
      )
    }
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

const CurrencyFormControl = (props) => {
  // Render the InputFormControl
  const { field, fields, mapping, data } = props

  // props must have the following defined:
  // fields (function)

  // mappings is not the normal mapping, just the ones required for the autocomplete
  // structure: { field: ..., id: ..., code: ... }
  // TODO: id and code should be optional

  // Set resolve flag on getMappedValue to true or you'll get a error like:
  // 'Cannot convert object to primitive value'?

  let type = null
  let hasMapping = false

  if (typeof mapping !== 'undefined' && mapping.hasOwnProperty('property')) {
    hasMapping = true

    if (mapping.hasOwnProperty('type')) {
      type = mapping.type
    }
  }

  let name = ''
  if (hasMapping) {
    name = (typeof props.name === 'string') ? props.name : mapping.property
  } else {
    name = (typeof props.name === 'string') ? props.name: name
  }

  let inputProps = undefined
  if (hasMapping) {
    if (type !== null) {
      inputProps = props.fields(
        mapping.property,
        getMappedValue(mapping, data),
        type
      )
    } else {
      inputProps = props.fields(
        mapping.property,
        getMappedValue(mapping, data)
      )
    }
  }

  return (
    <FormControl
      readOnly={props.readOnly}
      name={name}
      type={props.type}
      min={props.min}
      max={props.max}
      step={props.step}
      data-number-to-fixed='2'
      data-number-stepfactor='100'
      onKeyUp={props.onKeyUp}
      onBlur={props.onBlur}
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
  // 'Cannot convert object to primitive value'?
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

const DateTimePicker = (props) => {
  return <InputFormControl type='datetime-local' {...props} />
}

const DateInput = (props) => {
  return (<DatePicker {...props} />)
}

const DateTimeInput = (props) => {
  return (<DateTimePicker {...props} />)
}

const TimeInput = (props) => {
  return (<TimePicker {...props} />)
}

const NumericInput = (props) => {
  return (<InputFormControl type='number' {...props} />)
}

const CurrencyInput = (props) => {
  return (
    <InputGroup>
      <InputGroup.Addon>$</InputGroup.Addon>
      <CurrencyFormControl
        type='number'
        min='0.01'
        step='0.01'
        data-number-to-fixed='2'
        data-number-stepfactor='100'
        {...props}
      />
      {/*<InputGroup.Addon>.00</InputGroup.Addon>*/}
    </InputGroup>
  )
}

const PercentageInput = (props) => {
  return (
    <InputGroup>
      <InputFormControl type='text' {...props} />
      <InputGroup.Addon>%</InputGroup.Addon>
    </InputGroup>
  )
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
export { InputFormControl, CurrencyFormControl, HiddenInput, DateInput, DateTimeInput, TimeInput, NumericInput, CurrencyInput, PercentageInput, TelephoneInput, EmailInput, PostalCodeInput, SinInput, SsnInput }
