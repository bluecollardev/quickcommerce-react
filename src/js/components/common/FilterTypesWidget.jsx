import React from 'react'

import { TabPanes } from 'react-bootstrap'

const TypesWidget = (props) => {
  const { types } = props
  return (
    <div className='widget widget-types'>
      <h3 className='widget-title'>Types</h3>
      <ul>
        {Object.keys(types).map((key, idx) => (
          <li key={idx} rel={key}><a href='#'>
            <span className='type' style={{ backgroundColor: '#93c4ef' }}/>
            {types[key]}
          </a></li>
        ))}
      </ul>
    </div>
  )
}

export default TypesWidget
