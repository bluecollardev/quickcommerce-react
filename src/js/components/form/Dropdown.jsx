// TODO: Document this, half the time I have no f***ing idea how to configure dropdowns

import assign from 'object-assign'

import React from 'react'
import PropTypes from 'prop-types'

import { DropdownButton, FormControl, MenuItem, SplitButton, InputGroup } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'
import ObjectHelper from '../../helpers/Object.js'

import DefaultSelectListOptions from './selectListOptions/DefaultSelectListOptions.jsx'
import NormalValueSelectListOptions from './selectListOptions/NormalValueSelectListOptions.jsx'
import OptionValueSelectListOptions from './selectListOptions/OptionValueSelectListOptions.jsx'
import CodeValueSelectListOptions from './selectListOptions/CodeValueSelectListOptions.jsx'
import DisplayTextValueSelectListOptions from './selectListOptions/DisplayTextValueSelectListOptions.jsx'

const getMappedValue = FormHelper.getMappedValue

const renderSelectListOptions = (props) => {
  if (props.hasOwnProperty('normalValue')) {
    return (
      <NormalValueSelectListOptions
        items={props.items}
        mapItems={props.mapItems}
      />
    )
}

  if (props.hasOwnProperty('optionValue')) {
    return (
      <OptionValueSelectListOptions
        items={props.items}
        mapItems={props.mapItems}
      />
    )
  }

  if (props.hasOwnProperty('codeValue')) {
    return (
      <CodeValueSelectListOptions
        items={props.items}
        mapItems={props.mapItems}
      />
    )
  }

  if (props.hasOwnProperty('displayTextValue')) {
    return (
      <DisplayTextValueSelectListOptions
        items={props.items}
        mapItems={props.mapItems}
        displayText={props.displayText}
      />
    )
  }

  return (
    <DefaultSelectListOptions
      items={props.items}
      mapItems={props.mapItems}
    />
  )
}

const SelectList = (props) => {
  // Render the SelectList
  const {
    //field,
    fields,
    mapping,
    data,
    mapItems,
    displayText,
  } = props

  let items = props.items || []

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
    let mappedValue = getMappedValue(mapping, data)
    let formComponentProps = props.fields(mapping.property, mappedValue, null, {
      onChange: props.onChange
    })

    inputProps = assign({}, props, formComponentProps)

    // Make sure we delete props before we spread the input props onto
    // the JSX element or you'll end up with attributes like mapping="[Object object]"
    delete inputProps.items
    delete inputProps.normalValue
    delete inputProps.optionValue
    delete inputProps.codeValue
    delete inputProps.displayTextValue
    delete inputProps.displayText
    delete inputProps.data
    delete inputProps.mapping
    delete inputProps.mapItems
    delete inputProps.field
    delete inputProps.fields
  }

  // Just for debugging
  if (!ObjectHelper.isEmpty(data)) {
    //debugger
  }

  return (
    <FormControl
      readOnly={props.readOnly}
      name={name}
      componentClass='select'
      {...inputProps}>
      {renderSelectListOptions(props)}
    </FormControl>
  )
}

SelectList.propTypes = {
  mapItems: PropTypes.func
}

SelectList.defaultProps = {
  mapItems: (items) => { return items }
}

const SelectButton = (props) => {
  let items = props.items || []
  // Helen Keller won't be using this software, because she obviously shouldn't be driving or even thinking about vehicles but since
  // React/Bootstrap is stupidly opinionated about assistive technologies like screen readers we have to hack in an ID to prevent warnings
  let itemId = 'splitbutton-' + Math.random() * 10

  if (props.mode === 'split') {
    return (
      <SplitButton
        readOnly={props.readOnly}
        id={itemId}
        title='Split Button'
        {...props}>
        {items.map((item, idx) => (
          <MenuItem key={idx} eventKey={item.id}>{item.value}</MenuItem>
        ))}
      </SplitButton>
    )
  } else {
    return (
      <DropdownButton title='Normal Button' {...props}>
        {items.map((item, idx) => (
          <MenuItem id={itemId + '_' + idx} key={idx} eventKey={item.id}>{item.value}</MenuItem>
        ))}
      </DropdownButton>
    )
  }
}

const PercentageRateDropdown = (props) => {
  return (
    <InputGroup>
      <SelectList {...props} />
      <InputGroup.Addon>%</InputGroup.Addon>
    </InputGroup>
  )
}

const MonthsDropdown = (props) => {
  return (
    <InputGroup>
      <SelectList {...props} />
      <InputGroup.Addon>Months</InputGroup.Addon>
    </InputGroup>
  )
}

// Dropdown lists
const AddressStyleDropdown = (props) => {
  //console.log('dumping AddressStyleDropdown props')
  //console.log(props)
  return (<SelectList {...props} />)
}

const ContactTypeDropdown = (props) => {
  //console.log('dumping ContactTypeDropdown props')
  //console.log(props)
  return (<SelectList {...props} />)
}

const IdTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const CustomerRelationDropdown = (props) => {
  return (<SelectList {...props} />)
}

const SalutationDropdown = (props) => {
  return (<SelectList {...props} />)
}

const SuffixDropdown = (props) => {
  return (<SelectList {...props} />)
}

const GenderDropdown = (props) => {
  return (<SelectList {...props} />)
}

const MaritalDropdown = (props) => {
  return (<SelectList {...props} />)
}

const ResidenceTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const EmploymentTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const EmploymentStatusDropdown = (props) => {
  return (<SelectList {...props} />)
}

const IncomeTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const FrequencyDropdown = (props) => {
  return (<SelectList {...props} />)
}

const AssetTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const LiabilityTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const StreetTypeDropdown = (props) => {
  return (<SelectList {...props} />)
}

const StreetDirDropdown = (props) => {
  return (<SelectList {...props} />)
}

const QuadrantDropdown = (props) => {
  return (<SelectList {...props} />)
}

// Dropdown buttons

const ContactTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const IdTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const CustomerRelationButton = (props) => {
  return (<SelectButton {...props} />)
}

const SalutationButton = (props) => {
  return (<SelectButton {...props} />)
}

const SuffixButton = (props) => {
  return (<SelectButton {...props} />)
}

const GenderButton = (props) => {
  return (<SelectButton {...props} />)
}

const MaritalButton = (props) => {
  return (<SelectButton {...props} />)
}

const ResidenceTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const EmploymentTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const IncomeTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const FrequencyButton = (props) => {
  return (<SelectButton {...props} />)
}

const AssetTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const LiabilityTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const StreetTypeButton = (props) => {
  return (<SelectButton {...props} />)
}

const StreetDirButton = (props) => {
  return (<SelectButton {...props} />)
}

export {
  SelectList,
  SelectButton,
  AddressStyleDropdown,
  ContactTypeDropdown,
  IdTypeDropdown,
  CustomerRelationDropdown,
  SalutationDropdown,
  SuffixDropdown,
  GenderDropdown,
  MaritalDropdown,
  ResidenceTypeDropdown,
  EmploymentTypeDropdown,
  EmploymentStatusDropdown,
  IncomeTypeDropdown,
  FrequencyDropdown,
  MonthsDropdown,
  PercentageRateDropdown,
  AssetTypeDropdown,
  LiabilityTypeDropdown,
  StreetTypeDropdown,
  StreetDirDropdown,
  QuadrantDropdown,
  ContactTypeButton,
  IdTypeButton,
  CustomerRelationButton,
  SalutationButton,
  SuffixButton,
  GenderButton,
  MaritalButton,
  ResidenceTypeButton,
  EmploymentTypeButton,
  IncomeTypeButton,
  FrequencyButton,
  AssetTypeButton,
  LiabilityTypeButton,
  StreetTypeButton,
  StreetDirButton
} 
