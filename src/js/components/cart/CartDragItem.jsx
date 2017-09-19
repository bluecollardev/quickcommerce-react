import React          from 'react'
import { DragSource } from 'react-dnd'
import { Thumbnail }  from 'react-bootstrap'

const mySource = {

    beginDrag(props) {
        return {
            id : props.id
        }
    },

    endDrag(props, monitor, component) {}

}

function collect(connect, monitor) {
    return {
        connectDragSource : connect.dragSource(),
        isDragging        : monitor.isDragging()
    }
}

const CartDragItem = React.createClass({
    getDefaultProps() {
        return {
            item : {},
            onItemClicked : () => {}
        }
    },
    render() {
        const { id, isDragging, connectDragSource } = this.props
        return connectDragSource(
            <div onClick={this.props.onItemClicked.bind(this, this.props.item)} className='card'>
                <Thumbnail src={this.props.item.image} />
                <h5 className='item-brand'>
                    {this.props.item['manufacturer']}
                </h5>
                <p className='item-name'>
                    {this.props.item['name']}
                </p>
                {this.props.item.hasOwnProperty('price') && this.props.item['price'] !== '' && (
                    <p className='item-price'>
                        {'$' + parseFloat(this.props.item['price']).toFixed(2)}
                    </p>
                )}
            </div>
        )
    }
})

module.exports = DragSource('sprite', mySource, collect)(CartDragItem)
