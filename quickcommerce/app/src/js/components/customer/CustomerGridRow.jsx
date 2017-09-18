import React, { Component } from 'react'

import CartDragItem from '../cart/CartDragItem.jsx'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class CustomerGridRow extends Component {
    static defaultProps = {
		data : {}, 
		onItemClicked: () => {}
	}
	
	constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Col xs={12} sm={4} md={3} lg={3}>
                <CartDragItem 
                  item = {this.props.data}
                  id = {this.props.data.id}
                  onItemClicked = {this.props.onItemClicked} />
            </Col>
        )
    }
}