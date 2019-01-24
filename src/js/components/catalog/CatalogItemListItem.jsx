import React from 'react'

const CatalogItemListItem = (props) => {
  let { label, text, className, labelClassName, textClassName } = props

  className = className || 'card-list-item'
  labelClassName = labelClassName || 'list-item-label'
  textClassName = textClassName || 'list-item-text'

  return (
    <li className={className}>
      <small>
        <span className={labelClassName}>{label}</span>
        <br/>
        <strong><span className={textClassName}>{text}</span></strong>
      </small>
    </li>
  )
}

export default CatalogItemListItem
