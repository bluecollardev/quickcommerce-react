import { TableCell as MuiTableCell } from 'material-ui/Table'
import React from 'react'

import { muiTableCellStyle as cellStyle } from '../../../styles/MuiStyles.jsx'

// Mui lib uses some pretty stupid defaults, I'll say...
// Have to wrap the component to kill the styles until I provide a custom theme...
const TableCell = (props) => {
  return (
    <MuiTableCell {...props} style={cellStyle}>
      {props.children}
    </MuiTableCell>
  )
}

export default TableCell
