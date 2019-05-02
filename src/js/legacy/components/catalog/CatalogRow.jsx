import React, { Component } from 'react'

import CartDragItem from '../cart/CartDragItem.jsx'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class CatalogRow extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        // TODO: Use mappings!
        return (
            <Col xs={12} sm={4}>
                <CartDragItem 
                  item = {this.props.data}
                  id = {this.props.data['product_id']}
                  onItemClicked = {this.props.onItemClicked} />
            </Col>
        )
    }
}