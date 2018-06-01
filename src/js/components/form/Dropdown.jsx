import assign from 'object-assign'

import React from 'react'

import { DropdownButton, FormControl, MenuItem, SplitButton } from 'react-bootstrap'

const SelectList = (props) => {
  let items = props.items || []
  let elementProps = assign({}, props) // Copy so we can delete, props are read-only
  delete elementProps.items
  delete elementProps.optionValue
  delete elementProps.codeValue

  if (props.hasOwnProperty('optionValue')) {
    return (
      <FormControl
        readOnly={props.readOnly}
        componentClass='select'
        {...elementProps}>
        <option key={0} value=''></option>
        {items.map((item, idx) => (
          <option
            key={idx + 1}
            code={item.code}
            value={item.value}
            selected={item.selected}>
            {item.value}
          </option>
        ))}
      </FormControl>
    )
  }

  if (props.hasOwnProperty('codeValue')) {
    return (
      <FormControl
        readOnly={props.readOnly}
        componentClass='select'
        {...elementProps}>
        <option key={0} value=''></option>
        {items.map((item, idx) => (
          <option
            key={idx + 1}
            value={item.code}
            selected={item.selected}>
            {item.value}
          </option>
        ))}
      </FormControl>
    )
  }

  return (
    <FormControl
      readOnly={props.readOnly}
      componentClass='select'
      {...elementProps}>
      <option key={0} value=''></option>
      {items.map((item, idx) => (
        <option
          key={idx + 1}
          value={item.id}
          selected={item.selected}>
          {item.value}
        </option>
      ))}
    </FormControl>
  )
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

// Dropdown lists
const ContactTypeDropdown = (props) => {
  console.log('dumping ContactTypeDropdown props')
  console.log(props)
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
  let newProps = assign({}, props, {
    items: [
      {
        id: 1,
        code: 'JR',
        value: 'Jr.'
      },
      {
        id: 2,
        code: 'SR',
        value: 'Sr.'
      },
      {
        id: 3,
        code: '1',
        value: 'I'
      },
      {
        id: 4,
        code: '2',
        value: 'II'
      },
      {
        id: 5,
        code: '3',
        value: 'III'
      },
      {
        id: 6,
        code: '4',
        value: 'IV'
      },
      {
        id: 7,
        code: '5',
        value: 'V'
      },
      {
        id: 8,
        code: '6',
        value: 'VI'
      },
      {
        id: 9,
        code: '7',
        value: 'VII'
      },
      {
        id: 10,
        code: '8',
        value: 'VIII'
      },
      {
        id: 11,
        code: '9',
        value: 'IX'
      },
      {
        id: 12,
        code: '10',
        value: 'X'
      }
    ]
  })

  return (<SelectList {...newProps} />)
}

const GenderDropdown = (props) => {
  return (<SelectList {...props} />)
}

const MaritalDropdown = (props) => {
  let newProps = assign({}, props, {
    items: [
      {
        id: 1,
        code: 'SINGLE',
        value: 'Single'
      },
      {
        id: 2,
        code: 'MARRIED',
        value: 'Married'
      },
      {
        id: 3,
        code: 'COMMONLAW',
        value: 'Common Law'
      },
      {
        id: 4,
        code: 'SEPARATED',
        value: 'Separated'
      },
      {
        id: 5,
        code: 'DIVORCED',
        value: 'Divorced'
      }
    ]
  })

  return (<SelectList {...newProps} />)
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
  AssetTypeDropdown,
  LiabilityTypeDropdown,
  StreetTypeDropdown,
  StreetDirDropdown,
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
