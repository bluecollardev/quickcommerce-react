import React, { Component } from 'react'

import CategoryDragItem from '../catalog/CategoryDragItem.jsx'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class CategoryRow extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Col xs={6} sm={12}>
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