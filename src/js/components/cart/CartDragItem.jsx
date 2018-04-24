import createReactClass from 'create-react-class'
import React from 'react'
import { Thumbnail } from 'react-bootstrap'
import { DragSource } from 'react-dnd'

const mySource = {
  beginDrag(props) {
    return {id: props['product_id']}
  },
  endDrag(props, monitor, component) {}
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const CartDragItem = createReactClass({
  getDefaultProps() {
    return {
      item: {},
      onItemClicked: () => {}
    }
  },
  onClick(e) {
    // onClick handler for CartDragItem
    if (typeof this.props.onItemClicked === 'function') {
      let fn = this.props.onItemClicked
      fn(e, this.props.item)
    }
  },
  render() {
    // CartDragItem render
    const { id, isDragging, connectDragSource } = this.props
    return connectDragSource(
      <div className='card'
        onClick={this.onClick}>
        <Thumbnail src={QC_IMAGES_URI + this.props.item.image}/>
        <h5 className='item-brand'>
          {/* TODO: Use mappings! */}
          {this.props.item['manufacturer']['name']}
        </h5>
        <p className='item-name'>
          {this.props.item['name']}
        </p>
        {this.props.item.hasOwnProperty('price') && this.props.item['price'] !== false && !isNaN(this.props.item['price']) && (
          <p className='item-price'>
            {'$' + parseFloat(this.props.item['price']).toFixed(2)}
          </p>
        )}
      </div>
    )
  }
})

export default DragSource('sprite', mySource, collect)(CartDragItem)
