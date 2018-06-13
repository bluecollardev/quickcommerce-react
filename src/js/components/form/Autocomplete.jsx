import assign from 'object-assign'
import React, { Fragment } from 'react'
import Autocomplete from 'react-autocomplete'

import FormHelper from '../../helpers/Form.js'

const getMappedValue = FormHelper.getMappedValue

function matchItemToTerm(item, key, value) {
  if (typeof value === 'string' && typeof item[key] === 'string') {
    return item[key].toLowerCase().indexOf(value.toLowerCase()) !== -1
  }
}

function matchItemToStore(item, value) {
  return matchItemToTerm(item, 'value', value)
}

function matchItemToName(item, value) {
  return matchItemToTerm(item, 'name', value)
}

function matchItemToCountry(item, value) {
  return matchItemToTerm(item, 'value', value)
}

function matchItemToZone(item, value) {
  return matchItemToTerm(item, 'value', value)
}

// TODO: This is NOT generic yo...
function matchItemToCustomer(item, value) {
  if (typeof value === 'string') {
    return [
      item.firstname,
      item.lastname
    ].join(' ').toLowerCase().indexOf(value.toLowerCase()) !== -1 //|| zone.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
  }
}

function matchItemToCustomerGroup(item, value) {
  return matchItemToTerm(item, 'value', value)
}

function matchItemToStatus(item, value) {
  return matchItemToTerm(item, 'value', value)
}

// TODO: This is good to go, but the specialized/pre-configured
// autocompletes need to be revamped as of line, now...
const AutocompleteFormControl = (props) => {
  const { field, fields, value, mappings, selection, data, items } = props
  // props must have the following defined:
  // fields (function)

  // mappings is not the normal mapping, just the ones required for the autocomplete
  // structure: { field: ..., id: ..., code: ... }
  // TODO: id and code should be optional

  function onValueChanged(event, value) {
    field(mappings.field.property, value)

    if (typeof props.onChange === 'function') {
      props.onChange(event, value)
    }
  }

  function onItemSelected(value, item) {
    field(mappings.field.property, item.data)
    field(mappings.id.value, item.id)
    field(mappings.code.value, item.data.code)

    if (typeof props.onSelect === 'function') {
      props.onSelect(value, item)
    }
  }

  if (mappings.field.property === 'country') {
    console.log('CURRENT DEBUG BREAKPOINT')
  }

  let mergedSelection = assign({}, selection, {
    value: getMappedValue(mappings.field, data) || '',
    id: getMappedValue(mappings.id, data, true) || null,
    code: getMappedValue(mappings.code, data, true) || ''
  })
  
  return (
    <Fragment>
      <Autocomplete
        inputProps={assign(fields(mappings.field.property, mergedSelection.value), {
          className: 'form-control',
          readOnly: props.readOnly,
          disabled: props.disabled
        })}
        name={mappings.field.property}
        getItemValue={(item) => {
          return item.value
        }}
        items={items}
        renderItem={(item, isHighlighted) => {
          return (
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.value}
            </div>
          )
        }}
        shouldItemRender={props.shouldItemRender}
        autoHighlight={true}
        wrapperStyle={{ display: 'block' }}
        value={value(mappings.field.property)}
        onChange={onValueChanged}
        onSelect={onItemSelected}
      />
      <input type='hidden' name={mappings.field.value} {...fields(mappings.id.value, mergedSelection.id)} />
      <input type='hidden' name={mappings.code.value} {...fields(mappings.code.value, mergedSelection.code)} />
    </Fragment>
  )
}

const OccupationAutocomplete = (props) => {
  return (<div/>)
}

const CountryAutocomplete = (props) => {
  return (
    <Autocomplete
      readOnly={props.readOnly}
      name='default_country'
      getItemValue={(item) => {
        return item.value
      }}
      items={props.settingStore.getCountries()}
      renderItem={(item, isHighlighted) => {
        return (
          <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.value}
          </div>
        )
      }}
      shouldItemRender={this.matchItemToCountry}
      autoHighlight={true}
      wrapperStyle={{display: 'block'}}
      value={data.default_country}
      onChange={(event, value) => {
        props.fields('default_country', value)

        this.setState(assign({}, this.state, {data: assign({}, data, {default_country: value})}))

        //this.parseZones(item.id)
      }}
      onSelect={(value, item) => {
        props.fields('default_country_id', item.id)
        props.fields('default_country', item.value)

        this.setState(assign({}, this.state, {
          data: assign({}, data, {
            default_country_id: item.id,
            default_country: item.value
          })
        }))

        props.settingStore.parseZones(item.id)
      }}
      inputProps={assign(props.fields('default_country', data.default_country), { className: 'form-control' })}
    />
  )
}

const ZoneAutocomplete = (props) => {
  return (
    <Autocomplete
      readOnly={props.readOnly}
      name='default_zone'
      getItemValue={(item) => {
        return item.value
      }}
      items={props.settingStore.getZones(data.default_country_id)}
      renderItem={(item, isHighlighted) => {
        return (
          <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.value}
          </div>
        )
      }}
      shouldItemRender={this.matchItemToZone}
      autoHighlight={true}
      wrapperStyle={{display: 'block'}}
      value={data.default_zone}
      onChange={(event, value) => {
        props.fields('default_zone', value)

        this.setState(assign({}, this.state, {data: assign({}, data, {zone: value})}))
      }}
      onSelect={(value, item) => {
        props.fields('default_zone_id', item.id)
        props.fields('default_zone', item.value)

        this.setState(assign({}, this.state, {
          data: assign({}, data, {
            default_zone_id: item.id,
            default_zone: item.value
          })
        }))
      }}
      inputProps={assign(props.fields('default_zone', data.default_zone), { className: 'form-control' })}
    />
  )
}

const CustomerAutocomplete = (props) => {
  return (
    <Autocomplete
      readOnly={props.readOnly}
      name='customer'
      getItemValue={(item) => {
        return [
          item.firstname,
          item.lastname
        ].join(' ')
      }}
      items={this.state.customers}
      renderItem={(item, isHighlighted) => {
        return (
          <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {[
              item.firstname,
              item.lastname
            ].join(' ')}
          </div>
        )
      }}
      shouldItemRender={this.matchItemToCustomer}
      autoHighlight={true}
      wrapperStyle={{display: 'block'}}
      value={data.default_customer}
      onChange={(event, value) => {
        props.fields('default_customer', value)

        this.setState(assign({}, this.state, {data: assign({}, data, {default_customer: value})}))
      }}
      onSelect={(value, item) => {
        props.fields('default_customer_id', item.customer_id)
        props.fields('default_customer', value)

        this.setState(assign({}, this.state, {
          data: assign({}, data, {
            default_customer_id: item.customer_id,
            default_customer: value
          })
        }))
      }}
      inputProps={assign(props.fields('default_customer', data.default_customer), { className: 'form-control' })}
    />
  )
}

const CustomerGroupAutocomplete = (props) => {
  return (
    <Autocomplete
      readOnly={props.readOnly}
      name='default_customer_group'
      getItemValue={(item) => {
        return item.value
      }}
      items={props.settingStore.customerGroups}
      renderItem={(item, isHighlighted) => {
        return (
          <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.value}
          </div>
        )
      }}
      shouldItemRender={this.matchItemToCustomerGroup}
      autoHighlight={true}
      wrapperStyle={{display: 'block'}}
      value={data.default_customer_group}
      onChange={(event, value) => {
        props.fields('default_customer_group', value)

        this.setState(assign({}, this.state, {data: assign({}, data, {default_customer_group: value})}))
      }}
      onSelect={(value, item) => {
        props.fields('default_customer_group_id', item.id)
        props.fields('default_customer_group', value)

        this.setState(assign({}, this.state, {
          data: assign({}, data, {
            default_customer_group_id: item.id,
            default_customer_group: value
          })
        }))
      }}
      inputProps={assign(props.fields('default_customer_group', data.default_customer_group), { className: 'form-control' })}
    />
  )
}

const OrderStatusAutocomplete = (props) => {
  return (
    <Autocomplete
      readOnly={props.readOnly}
      name='order_status'
      getItemValue={(item) => {
        return item.value
      }}
      items={props.settingStore.orderStatuses}
      renderItem={(item, isHighlighted) => {
        return (
          <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.value}
          </div>
        )
      }}
      shouldItemRender={this.matchItemToStatus}
      autoHighlight={true}
      wrapperStyle={{display: 'block'}}
      value={data.POS_complete_status}
      onChange={(event, value) => {
        props.fields('POS_complete_status', value)

        this.setState(assign({}, this.state, {data: assign({}, data, {POS_complete_status: value})}))
      }}
      onSelect={(value, item) => {
        props.fields('POS_complete_status_id', item.id)
        props.fields('POS_complete_status', item.value)

        this.setState(assign({}, this.state, {
          data: assign({}, data, {
            POS_complete_status_id: item.id,
            POS_complete_status: item.value
          })
        }))
      }}
      inputProps={assign(props.fields('POS_complete_status', data.POS_complete_status), { className: 'form-control' })}
    />
  )
}

const LanguageAutocomplete = (props) => {
  return (<div/>)
}

const StoreAutocomplete = (props) => {
  return (
    <Autocomplete
      readOnly={props.readOnly}
      name='store'
      getItemValue={(item) => {
        return item.value
      }}
      items={props.settingStore.stores}
      renderItem={(item, isHighlighted) => {
        return (
          <div key={item.id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
            {item.value}
          </div>
        )
      }}
      shouldItemRender={this.matchItemToStore}
      autoHighlight={true}
      wrapperStyle={{display: 'block'}}
      value={data.store}
      onChange={(event, value) => {
        props.fields('store', value)

        this.setState(assign({}, this.state, {data: assign({}, data, {store: value})}))

        //this.parseZones(item.id)
      }}
      onSelect={(value, item) => {
        props.fields('store_id', item.id)
        props.fields('store', value)

        this.setState(assign({}, this.state, {
          data: assign({}, data, {
            store_id: item.id,
            store: value
          })
        }))
      }}
      inputProps={assign(props.fields('store', data.store), { className: 'form-control' })}
    />
  )
}

export default AutocompleteFormControl
export {
  AutocompleteFormControl,
  OccupationAutocomplete,
  CountryAutocomplete,
  ZoneAutocomplete,
  OrderStatusAutocomplete,
  LanguageAutocomplete,
  StoreAutocomplete,
  CustomerAutocomplete,
  CustomerGroupAutocomplete,
  matchItemToTerm,
  matchItemToStore,
  matchItemToName,
  matchItemToCountry,
  matchItemToZone,
  matchItemToCustomer,
  matchItemToCustomerGroup,
  matchItemToStatus
}
