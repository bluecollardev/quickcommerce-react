import React from 'react'

const CatalogItemList = (props) => {
  let {className, listClassName} = props
  listClassName = listClassName || ''
  className = className || 'shop-item-details'
  return (
    <div className={className}>
      <ul className={listClassName}>{props.children}</ul>
    </div>
  )
}

export default CatalogItemList
