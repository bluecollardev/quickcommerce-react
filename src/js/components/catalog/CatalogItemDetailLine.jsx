import React from 'react'

const CatalogItemDetailLine = (props) => {
  let {label, className, formattedValue, labelClassName, textValueClassName} = props

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

export default CatalogItemDetailLine
