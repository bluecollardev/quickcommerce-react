import React, { Component } from 'react'

class CartRow extends Component {
    constructor(props) {
        super(props)
        
        this.handleChange = this.handleChange.bind(this)
    }
    
    handleChange(event) {
        const value = event.target.value
        if (!isNaN(value) && value > 0) {
            this.props.setItemQty(value)
        }
    }
    
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
                      style = {{textAlign: 'right', width: '100px'}}
                      type = 'number'
                      value = {this.props.item.quantity}
                      onChange = {this.handleChange} />
                </td>
                <td>
                    <button 
                      onClick = {this.props.removeItem}>
                        Remove
                    </button>
                </td>
            </tr>
        )
    }
}

export default CartRow