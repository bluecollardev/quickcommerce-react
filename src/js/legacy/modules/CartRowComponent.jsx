import React               from 'react'

const CartRowComponent = React.createClass({
    handleChange(event) {
        const value = event.target.value
        if (!isNaN(value) && value > 0) {
            this.props.setItemQty(value)
        }
    },
    render() {
        return (
            <tr>
                {this.props.columns.map(column => {
                    return (
                        <td key={column}>
                            {this.props.item.data[column]}
                        </td>
                    )
                })}
                <td>
                    <input
                      style    = {{textAlign: 'right', width: '100px'}}
                      type     = 'number'
                      value    = {this.props.item.quantity}
                      onChange = {this.handleChange} />
                </td>
                <td>
                    <button 
                      onClick  = {this.props.removeItem}>
                        Remove
                    </button>
                </td>
            </tr>
        )
    }
})

module