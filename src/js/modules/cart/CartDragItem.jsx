import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { Thumbnail, Button } from 'react-bootstrap'

import FormHelper from '../../helpers/Form.js'
import HtmlHelper from '../../helpers/HTML.js'

const mySource = {
    beginDrag(props) {
        return {
            id: props['product_id']
        }
    },
    endDrag(props, monitor, component) {}

}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class CartDragItem extends Component {
    constructor(props) {
        super(props)
        
        this.onClick = this.onClick.bind(this)
    }
    
    onClick(e) {
        // onClick handler for CartDragItem
        if (typeof this.props.onItemClicked === 'function') {
            let fn = this.props.onItemClicked
            fn(e, this.props.item)
        }
    }
    
    render() {
        // QuickCommerce Theme CartDragItem.render
        const { id, item, itemMappings, isDragging, connectDragSource } = this.props
        
        let itemId = FormHelper.getMappedValue(itemMappings.ITEM_ID, item)
        let model = FormHelper.getMappedValue(itemMappings.MODEL, item)
        let manufacturer = FormHelper.getMappedValue(itemMappings.MANUFACTURER, item)
        let brand = FormHelper.getMappedValue(itemMappings.BRAND, item)
        let name = FormHelper.getMappedValue(itemMappings.NAME, item)
        let price = FormHelper.getMappedValue(itemMappings.PRICE, item)
        let description = FormHelper.getMappedValue(itemMappings.DESCRIPTION, item)
        let image = FormHelper.getMappedValue(itemMappings.IMAGE, item)
        
        return connectDragSource(
            <div className='card'
                onClick={this.onClick}>
                <Thumbnail src={QC_IMAGES_URI + image} />
                <h5 className='item-brand'>
                    {brand}
                </h5>
                <p className='item-name'>
                    {name}
                </p>
                {price && price !== false && !isNaN(price) && (
                <p className='item-price'>
                    {'$' + parseFloat(price).toFixed(2)}
                </p>
                )}
            </div>
        )
    }
}

CartDragItem.propTypes = {
    item: PropTypes.object,
    onItemClicked: PropTypes.func
}
    
CartDragItem.defaultProps = {
    item: {},
    onItemClicked: () => {}
}

export default DragSource('sprite', mySource, collect)(CartDragItem)
