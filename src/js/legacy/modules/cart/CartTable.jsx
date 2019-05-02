import React, { Component } from 'react'

class CartTable extends Component {
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
                    </tr>
                </thead>
                <tbody>
                    {this.props.body}
                </tbody>
            </table>
        )
    }
}

export default CartTable