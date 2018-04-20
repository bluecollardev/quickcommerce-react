import React from 'react'

import { TabPanes } from 'react-bootstrap'

const ColorsWidget = (props) => {
  const { colors } = props
  return (
    <div className='widget widget-color'>
      <h3 className='widget-title'>Colors</h3>
      <ul>
        {Object.keys(colors).map((key, idx) => (
          <li key={idx} rel={key}><a href='#'>
            <span className='color' style={{ backgroundColor: '#93c4ef' }}/>
            {colors[key]}
          </a></li>
        ))}
      </ul>
    </div>
  )
}

export default ColorsWidget
