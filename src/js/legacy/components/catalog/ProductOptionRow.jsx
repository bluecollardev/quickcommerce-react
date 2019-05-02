import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Input, Button, Modal } from 'react-bootstrap'

import Griddle from 'griddle-react'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

import ProductOptionValue from '../catalog/ProductOptionValue.jsx'

export default class ProductOptionRow extends Component {
    static defaultProps = {
        data : {}, 
        onItemClicked: () => {}
    }
    
    constructor(props) {
        super(props)
        
        this.configureRow = this.configureRow.bind(this)
        
        console.log('init row')
    }
    
    configureRow(rowComponent) {
        let that = this
        let fn = null

        if (this.props.hasOwnProperty('onItemClicked') &&
            typeof this.props.onItemClicked === 'function') {

            // Wrap the function in a generic handler so we can pass in custom args
            let callback = fn = this.props.onItemClicked
            fn = function() {
                callback(...arguments)
            }
        } else {
            fn = this.props.onItemClicked
        }

        rowComponent.defaultProps.onItemClicked = fn
        rowComponent.defaultProps.stepper = this.props.stepper

        return rowComponent
    }
    
    render() {
        // Render ProductOptionRow
        let rowComponent = this.configureRow(ProductOptionValue)
        // TODO: Use mapping or POJO
        let data = this.props.data['product_option_values'] || []
        if (data instanceof Array && data.length > 0) {
            data = data.map(value => {
                let optionValue = {
                    name: value['option_value']['description'][0]['name'],
                    image: value['option_value']['image'],
                    price: value['price'],
                    option: assign({}, this.props.data),
                    product: assign({}, this.props.data.product)
                }
                
                //delete optionValue['option']['option_value'] // Kill ref
                //delete optionValue['option']['product'] // Kill ref
                
                return optionValue
            })
        }
        
        console.log('rendering row')
        console.log(data)
        
        return (
            <Col xs={12}>
                <div className='card product-options-card row'>
                    <p className='item-name'>
                        {/*this.props.data['name']*/}Option
                    </p>
                    <Grid fluid={true} className='product-option-grid'>
                        <Griddle
                            showFilter              = {false}
                            columns                 = {[
                                'name'
                            ]}
                            useGriddleStyles        = {false}
                            useCustomPagerComponent = {true}
                            customPagerComponent    = {BootstrapPager}
                            useCustomRowComponent   = {true}
                            resultsPerPage          = {3}
                            customRowComponent      = {rowComponent}
                            results                 = {data}
                        />
                    </Grid>
                </div>
            </Col>
        )
    }
}