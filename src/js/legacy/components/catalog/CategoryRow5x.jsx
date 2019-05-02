import React, { Component } from 'react'

import CategoryDragItem from '../catalog/CategoryDragItem.jsx'
import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class CategoryRow5x extends Component {
    static defaultProps = {
        data: {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div className='col-xs-12 col-sm-4 col-md-2 col-md-push-1'>
                <CategoryDragItem 
                  displayLabel = {true}
                  displayThumbnail = {true}
                  id = {this.props.data.id}
                  item = {this.props.data}
                  onItemClicked = {this.props.onItemClicked} />
            </div>
        )
    }
}