import React from 'react'

import { TabPanes } from 'react-bootstrap'

const TagsWidget = (props) => {
  const { tags } = props
  return (
    <div className='widget widget-tags'>
      <h3 className='widget-title'>Popular Tags</h3>
      {tags.map((value, idx) => (<a key={idx} rel={value} href='#'>{value}</a>))}
    </div>
  )
}

export default TagsWidget
