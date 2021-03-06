import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

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
            //selected={item.selected}
            value={item.id}>
            {item.value}
          </option>
        )
      })}
    </Fragment>
  )
}

DefaultSelectListOptions.propTypes = {
  items: PropTypes.array,
  mapItems: PropTypes.func
}

DefaultSelectListOptions.defaultProps = {
  items: [],
  mapItems: () => {}
}


export default DefaultSelectListOptions
