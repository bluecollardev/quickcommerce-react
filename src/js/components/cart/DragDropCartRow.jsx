import React               from 'react'
//import { DragDropContext } from 'react-dnd'
//import HTML5Backend        from 'react-dnd-html5-backend'
import Griddle             from 'griddle-react'

import CartDragItem        from './CartDragItem.jsx'
import CartDropTarget      from './CartDropTarget.jsx'
import Cart      from '../../modules/Cart.jsx'
import BootstrapPager      from '../common/GriddleBootstrapPager.jsx'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

const DragDropCartRow = React.createClass({
    handleChange(event) {
        const value = event.target.value
        if (!isNaN(value) && value > 0) {
            this.props.setItemQty(value)
        }
    },
    increment() {
        const value = this.props.item.quantity + 1
        this.props.setItemQty(value)
    },
    decrement() {
        const value = this.props.item.quantity - 1
        if (value) {
            this.props.setItemQty(value)
        }
    },
    renderOptions() {
        let options = []
        let selected = this.props.item.options
        
        for (let idx in selected) {
            options.push(<li>{selected[idx].data.option.name}: <b>{selected[idx].data.name}</b></li>)
        }
        
        return (
            <ul style={{
                paddingLeft: '1.5rem',
                marginLeft: '0'
            }}>
                {options}
            </ul>
        )
    },
    render() {
        let data = this.props.item.data
        let price = (typeof data.price !== 'undefined' && !isNaN(data.price)) ? Number(data.price).toFixed(2) : 0.00
        return (
            <tr>
                <td key='name' className='cart-product-col'>
                    <div className='cart-product-delete'>
                        <Button 
                          bsSize   = 'small'
                          bsStyle  = 'danger'
                          onClick  = {this.props.removeItem}>
                            <i className='fa fa-remove' />
                        </Button>
                    </div>
                    <strong className='cart-product-name'>{data['name']}</strong><br />
                    <div className='cart-product-detail'>
                        <Thumbnail src={data.image} />
                        {/*<div style={{maxWidth: '220px'}}><pre>{JSON.stringify(this.props.item.options)}</pre></div>*/}
                        {this.renderOptions()}
                    </div>
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
            </tr>
        )
    }
})

module.exports = DragDropCartRow