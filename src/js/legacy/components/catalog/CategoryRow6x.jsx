import React, { Component } from 'react'

import CategoryDragItem from '../catalog/CategoryDragItem.jsx'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class CategoryRow6x extends Component {
    static defaultProps = {
        data: {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Col xs={12} sm={4} md={2}>
                <CategoryDragItem 
                    displayLabel = {true}
                    displayThumbnail = {true}
                    id = {this.props.data.id}
                    item = {this.props.data}
                    onItemClicked = {this.props.onItemClicked} />
            </Col>
        )
    }
}