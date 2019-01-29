import React from 'react'
import PropTypes from 'prop-types'

const CatalogItemDetailLine = (props) => {
  let {
    label,
    className,
    formattedValue,
    labelClassName,
    textValueClassName
  } = props

  className = className || 'card-details value-list'
  labelClassName = labelClassName || 'card-attribute'
  textValueClassName = textValueClassName || 'card-attribute-value'

  return (
    <div className={className}>
      <span className={labelClassName}>
        {label}
      </span>
      <span className={textValueClassName}>{formattedValue}</span>
    </div>
  )
}

CatalogItemDetailLine.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  formattedValue: PropTypes.string,
  labelClassName: PropTypes.string,
  textValueClassName: PropTypes.string
}

CatalogItemDetailLine.defaultProps = {
  label: null,
  className: null,
  formattedValue: null,
  labelClassName: null,
  textValueClassName: null
}

export default CatalogItemDetailLine
