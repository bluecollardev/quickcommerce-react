import React, { Component } from 'react'

import CartDragItem from '../cart/CartDragItem.jsx'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class ProductRow extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {},
        onAddToCartClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Col xs={12} sm={4}>
                <CartDragItem
                    onItemClicked = {this.props.onItemClicked}
                    item = {this.props.data}
                    id = {this.props.data['product_id']}>
                    <Button block onClick={this.props.onAddToCartClicked}><i className='fa fa-shopping-cart' /> Quick Add</Button>
                </CartDragItem>
            </Col>
        )
    }
}