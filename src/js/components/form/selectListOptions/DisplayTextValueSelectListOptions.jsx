import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

/**
 * displayTextValue
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
const DisplayTextValueSelectListOptions = (props) => {
  return (
    <Fragment>
      <option key={0} value=''></option>
      {props.items.map((item, idx) => {
        // Use the mapItems callback to perform
        // any last second tweaks to the data
        item = props.mapItems(item)

        let displayValue = item.value

        if (typeof props.displayText === 'function') {
          displayValue = props.displayText(item.value)
        }

        return(
          <option
            key={idx + 1}
            raw={JSON.stringify(item)}
            value={item.value}
            selected={item.selected}>
            {displayValue}
          </option>
        )
      })}
    </Fragment>
  )
}

DisplayTextValueSelectListOptions.propTypes = {
  items: PropTypes.array,
  mapItems: PropTypes.func
}

DisplayTextValueSelectListOptions.defaultProps = {
  items: [],
  mapItems: () => {}
}

export default DisplayTextValueSelectListOptions
