import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

export default class ProductOptionSlide extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <Col xs={12} sm={4} md={3} lg={2}>
                <div className='card'>
                    <Thumbnail src={this.props.data.image} />
                    <p className='item-name'>
                        {this.props.data['name']}
                    </p>
                </div>
            </Col>
        )
    }
}