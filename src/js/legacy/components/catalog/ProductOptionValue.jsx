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
        
        this.isSelected = this.isSelected.bind(this)
    }
    
    isSelected(id) {
        let stepper = this.props.stepper || null
        if (stepper === null) return false
        
        let selection = stepper.getSelection() || null        
        if (selection === null || !(selection instanceof Array)) return false
        
        // Should only be one product selected at a time, but I'll have to confirm this
        if (selection.length === 1) {
            selection = selection[0]
            
            let options = selection.options
            if (!(options instanceof Array) || options.length === 0) return false
            
            // Filter options
            options = options.filter(option => {
                return option.id === id
            })
            
            return options.length > 0
        }
    }
    
    onClick(data) {
        if (typeof this.props.onItemClicked === 'function') {
            let fn = this.props.onItemClicked
            fn(data)
        }
        
        this.forceUpdate()
    }
    
    render() {
        let selected = this.isSelected(this.props.data['product_option_value_id']) ? 'is-selected' : ''
        
        return (
            <Row>
                <Col xs={12} sm={3} md={3} lg={3}>
                    <div className={['card', selected].join(' ')}
                        onClick = {this.onClick.bind(this, this.props.data)}>
                        <Thumbnail src={QC_IMAGES_URI + this.props.data.image} />
                        <p className='item-name'>
                            {this.props.data['name']}
                        </p>
                        {this.props.data.hasOwnProperty('price') && 
                        this.props.data['price'] !== false && 
                        !isNaN(this.props.data['price']) && (
                        <p className='item-price'>
                            {'$' + parseFloat(this.props.data['price']).toFixed(2)}
                        </p>
                        )}
                    </div>
                </Col>
            </Row>
        )
    }
}