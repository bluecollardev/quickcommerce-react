import React, { Component } from 'react'
//import { DragDropContext } from 'react-dnd'
//import HTML5Backend from 'react-dnd-html5-backend'
import Griddle from 'griddle-react'

import CartDragItem from './CartDragItem.jsx'
import CartDropTarget from './CartDropTarget.jsx'
import Cart from '../../modules/Cart.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'
//import items from '../../data/products.js'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class DragDropCustomerRow {
    constructor(props) {
		super(props)
	}
	
	handleChange(event) {
        const value = event.target.value
        if (!isNaN(value) && value > 0) {
            this.props.setItemQty(value)
        }
    }
	
    increment() {
        const value = this.props.item.quantity + 1
        this.props.setItemQty(value)
    }
	
    decrement() {
        const value = this.props.item.quantity - 1
        if (value) {
            this.props.setItemQty(value)
        }
    }
	
    renderOptions() {
        let options = []
        let selected = this.props.item.options
        
        for (let idx in selected) {
            options.push(<li>{selected[idx].data.option.name}: <b>{selected[idx].data.name}</b></li>)
        }
        
        return (
            <ul style={{
                marginLeft: '1.5rem'
            }}>
                {options}
            </ul>
        )
    }
	
    render() {
        let data = this.props.item.data
        let price = (typeof data.price !== 'undefined' && !isNaN(data.price)) ? Number(data.price).toFixed(2) : 0.00
        return (
			<tr>
				<td colSpan={5}>
					<table>
						<tr className='show-mobile hide-desktop'>
							<td colSpan={1}>
								<Thumbnail src={this.props.item.data.image} />
							</td>
							<td colSpan={1}>
								<Button 
								  bsSize   = 'small'
								  bsStyle  = 'danger'
								  onClick  = {this.props.removeItem}>
									<i className='fa fa-remove' />
								</Button>
							</td>
						</tr>
						<tr className='show-mobile hide-desktop'>
							{this.props.columns.map(column => {
								return (
									<td key={column}>
										{this.props.item.data[column]}
									</td>
								)
							})}
							<td>
								<div className='form-group form-group-sm' style={{marginBottom: 0, width: '110px'}}>
									{this.props.item.quantity}
								</div>
							</td>
						</tr>
						<tr className='hide-mobile show-desktop'>
							<td>
								<Thumbnail src={data.image} />
							</td>
							<td key='name'>
								<strong>{data['name']}</strong><br />
								{/*<div style={{maxWidth: '220px'}}><pre>{JSON.stringify(this.props.item.options)}</pre></div>*/}
								{this.renderOptions()}
							</td>
							<td style={{width: '100px'}}>
								<div className='form-group form-group-sm' style={{width: '80px'}}>
									${price}
								</div>
									</td>
							<td style={{width: '40px'}}>
								<div className='form-group form-group-sm' style={{width: '40px'}}>
									{this.props.item.quantity}
								</div>
							</td>
							<td style={{width: '50px'}}>
								<Button 
								  bsSize   = 'small'
								  bsStyle  = 'danger'
								  onClick  = {this.props.removeItem}>
									<i className='fa fa-remove' />
								</Button>
							</td>
						</tr>
					</table>
				</td>        
			</tr>
        )
    }
}