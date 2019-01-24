import React from 'react'

const CatalogItemDetailLine = (props) => {
  let {label, className, formattedPrice, labelClassName, priceClassName} = props

  className = className || 'card-details'
  labelClassName = labelClassName || 'card-title'
  priceClassName = priceClassName || 'average-payment'

  return (
    <div className={className}>
      <h5 className={labelClassName}>
        <span className='float-left'>{label}</span>
        <small className='float-right'>
          <span className={priceClassName}>{formattedPrice}</span>
        </small>
      </h5>
    </div>
  )
}

export default CatalogItemDetailLine
