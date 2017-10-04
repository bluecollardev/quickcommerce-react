import React               from 'react'
//import { DragDropContext } from 'react-dnd'
//import HTML5Backend        from 'react-dnd-html5-backend'
import Griddle             from 'griddle-react'

import CartDragItem        from './CartDragItem.jsx'
import CartDropTarget      from './CartDropTarget.jsx'
import Cart                from '../../modules/Cart.jsx'
import BootstrapPager      from '../common/GriddleBootstrapPager.jsx'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

import StringHelper from '../../helpers/String.js'

import CheckoutStore       from '../../stores/CheckoutStore.jsx' // Will need for totals and stuff

const DragDropContainer = React.createClass({
    componentDidMount() {
        CheckoutStore.on('set-order', this.doUpdate)
    },
    componentWillUnmount() {
        CheckoutStore.removeListener('set-order', this.doUpdate)
    },
    doUpdate() {
        this.forceUpdate()
        
        /*try {
            this.forceUpdate()
        } catch (err) {
            console.log(err)
        }*/
    },
    renderTotals() {
        let output = []

        // Totals
        let totals = CheckoutStore.getTotals() || []
        let total = CheckoutStore.getTotal() || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue // Ignore the final total OpenCart sux goat dick what a fucking dumb way to output totals!

            // Set the total title
            let subTotalTitle = ''
            switch (totals[idx].code) {
                case 'sub_total':
                    subTotalTitle = 'Sub-total'
                    break
                case 'total':
                    subTotalTitle = 'Total'
                    break
                default:
                    subTotalTitle = totals[idx].title
            }

            output.push(
                <tr>
                    <td colSpan={this.props.columns.length} style={{textAlign: 'right'}}>
                        <strong>{subTotalTitle}:</strong>
                    </td>
                    <td colSpan={2}>
                        ${parseFloat(totals[idx].value).toFixed(2)}
                    </td>
                </tr>
            )
        }

        if (total !== null) {
            // Final total
            // Set the total title
            let totalTitle = ''
            switch (total.code) {
                case 'sub_total':
                    totalTitle = 'Sub-total'
                    break
                case 'total':
                    totalTitle = 'Total'
                    break
                default:
                    totalTitle = total.title
            }

            output.push(
                <tr>
                    <td colSpan={this.props.columns.length} style={{textAlign: 'right'}}>
                        <h4>{totalTitle}:
                        <br/>
                        <small>(CAD)</small>
                        </h4>
                        
                    </td>
                    <td colSpan={2}>
                        <h1>${parseFloat(total.value).toFixed(2)}</h1>
                    </td>
                </tr>
            )
            
            output.push(
                <tr>
                    <td colSpan={this.props.columns.length + 1} style={{textAlign: 'center'}}>
                        <small style={{color: 'lightgrey'}}>* All prices in Canadian Dollars (CDN)</small>
                    </td>
                </tr>
            )
        }

        return output
    },
    render() {
        return (
            <table className={this.props.tableClassName}>
                <thead>
                    <tr>
                        <th>{"Name"}</th>
                        {this.props.columns.map(column => {
                        return (
                        <th key={column}>{StringHelper.capitalizeFirstLetter(column)}</th>
                        )}
                        )}
                        <th>{"Qty"}</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.body}
                </tbody>
                <tfoot>
                    {this.renderTotals()}
                </tfoot>
            </table>
        )
    }
})

module.exports = DragDropContainer
