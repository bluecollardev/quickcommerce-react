import createReactClass from 'create-react-class'
import React from 'react'
import { Thumbnail } from 'react-bootstrap'
import { DragSource } from 'react-dnd'

const mySource = {

  beginDrag(props) {
    return {id: props.id}
  },

  endDrag(props, monitor, component) {}

}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const CategoryDragItem = createReactClass({
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
    // CategoryDragItem render
    const { id, isDragging, connectDragSource } = this.props
    return connectDragSource(
      <div className='card'
        onClick={this.onClick}>
        {/* Looks like these are cached... may need to rethink my approach this should be overridden */}
        <Thumbnail src={this.props.item.image}/>

        <p className='item-name'>
          {this.props.item['name']}
        </p>
      </div>
    )
  }
})

export default DragSource('sprite', mySource, collect)(CategoryDragItem)
