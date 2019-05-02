import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

import StringHelper from '../../helpers/String.js'

@inject(deps => ({
    actions: deps.actions,
    checkoutStore: deps.checkoutStore,
    settingStore: deps.settingStore
}))
@observer
class DragDropCartTable extends Component {
    constructor(props) {
        super(props)
        
        this.doUpdate = this.doUpdate.bind(this)
        this.renderTotals = this.renderTotals.bind(this)
    }
    
    componentDidMount() {
        this.props.checkoutStore.on('set-order', this.doUpdate)
    }
    
    componentWillUnmount() {
        this.props.checkoutStore.removeListener('set-order', this.doUpdate)
    }
    
    doUpdate() {
        this.forceUpdate()
        
        /*try {
            this.forceUpdate()
        } catch (err) {
            console.log(err)
        }*/
    }
    
    renderTotals() {
        let output = []

        // Totals
        let totals = this.props.checkoutStore.getTotals() || []
        let total = this.props.checkoutStore.getTotal() || null

        // Sub-totals
        for (let idx = 0; idx < totals.length; idx++) {
            if (totals[idx].code === total.code) continue

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
    }
    
    render() {
        return (
            <table className={this.props.tableClassName}>
                <thead>
                    <tr>
                        <th>{'Name'}</th>
                        {this.props.columns.map(column => {
                        return (
                        <th key={column}>{StringHelper.capitalizeFirstLetter(column)}</th>
                        )}
                        )}
                        <th>{'Qty'}</th>
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
}

export default DragDropCartTable