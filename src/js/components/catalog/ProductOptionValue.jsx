import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class ProductOptionValue extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Row>
                <Col xs={12} sm={3} md={3} lg={3}>
                    <div className='card'
                        onClick = {this.props.onItemClicked.bind(null, this.props.data)}>
                        <Thumbnail src={this.props.data.image} />
                        <p className='item-name'>
                            {this.props.data['name']}
                        </p>
                    </div>
                </Col>
            </Row>
        )
    }
}