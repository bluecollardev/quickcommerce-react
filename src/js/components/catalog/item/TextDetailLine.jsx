import React from 'react'

const TextDetailLine = (props) => {
  return (<p className='shop-item-details visible-xs' dangerouslySetInnerHTML={{ __html: props.description }}></p>)
}

export default TextDetailLine
