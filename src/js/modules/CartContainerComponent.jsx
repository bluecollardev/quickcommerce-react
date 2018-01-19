import React from 'react'
import createReactClass from 'create-react-class'

const CartContainerComponent = createReactClass({
  render() {
    return (
      <table className={this.props.tableClassName}>
        <thead>
          <tr>
            {this.props.columns.map(column => {
              return (
                <th key={column}>
                  {column}
                </th>
              )
            })}
            <th>
                            Quantity
            </th>
            <th />
          </tr>+
        </thead>
        <tbody>
          {this.props.body}
        </tbody>
      </table>
    )
  }
})