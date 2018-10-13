import React from 'react'

import { FormControl, InputGroup } from 'react-bootstrap'

import * as Input from './Input.jsx'
import * as Dropdown from './Dropdown.jsx'

const PaymentInput = (props) => {
  // Pass FormComponent props down to inputs
  const inputProps = {
    //data: props.data,
    field: props.field,
    fields: props.fields,
    value: props.value
  }

  return (
    <InputGroup className='payment-input-group'>
      <InputGroup.Addon>$</InputGroup.Addon>
      <Input.CurrencyFormControl
        type='number'
        min='0.01'
        step='0.01'
        data-number-to-fixed='2'
        data-number-stepfactor='100'
        {...inputProps}
        mapping={props.mappings.amount}
        data={props.data}
      />
      <Dropdown.FrequencyDropdown
        optionValue
        {...inputProps}
        items={props.frequencies}
        mapping={props.mappings.frequency}
        data={props.data}
      />
    </InputGroup>
  )
}

export { PaymentInput }
