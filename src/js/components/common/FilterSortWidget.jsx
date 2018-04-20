import { SelectList } from '../form/Dropdown.jsx'

import React from 'react'

import { ControlLabel, FormGroup } from 'react-bootstrap'

const SortWidget = (props) => {
  const { sort } = props

  return (
    <div className='widget widget-sorting'>
      <h3 className='widget-title'>
        <FormGroup className='form-element form-select'>
          <ControlLabel>
            <i className='fa fa-sort'/>&nbsp;Arrange By
          </ControlLabel>
          <SelectList className='form-control'
            items={[
              {
                code: 'PROFIT',
                value: 'Profitability (Default)',
                selected: true
              },
              {
                code: 'PROFITMANDATE',
                value: 'Profit Mandate'
              },
              {
                code: 'PROFITMANDATE',
                value: 'Price (High to Low)'
              },
              {
                code: 'PROFITMANDATE',
                value: 'Price (Low to High)'
              }
            ]}
          />
        </FormGroup>
      </h3>
      <ul>
        {Object.keys(sort).map((key, idx) => (
          <li key={idx} rel={key} className='active'><a href='#'>
            <i className='material-icons'/>
            {sort[key]}
          </a></li>
        ))}
      </ul>
    </div>
  )
}

export default SortWidget
