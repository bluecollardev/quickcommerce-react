import React, { Fragment } from 'react'

/**
 * default
 *
 * Options has the following attributes set:
 * @property key
 * @property raw The JSON-encoded data item
 * @property value
 * @property selected
 *
 * The following value is used for display:
 * @value item.value
 */
const DefaultSelectListOptions = (props) => {
  return (
    <Fragment>
      <option key={0} value=''></option>
      {props.items.map((item, idx) => {
        // Use the mapItems callback to perform
        // any last second tweaks to the data
        item = props.mapItems(item)
        return(
          <option
            key={idx + 1}
            raw={JSON.stringify(item)}
            value={item.id}
            selected={item.selected}>
            {item.value}
          </option>
        )
      })}
    </Fragment>
  )
}

export default DefaultSelectListOptions
