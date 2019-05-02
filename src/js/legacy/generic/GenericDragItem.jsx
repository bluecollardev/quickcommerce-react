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

const GenericDragItem = React.createClass({
    getDefaultProps() {
        return { 
            item : {} 
        }
    },
    render() {
        const { id, isDragging, connectDragSource } = this.props
        return connectDragSource(
            <div className='card'>
                <Thumbnail src={'media/' + this.props.item.thumbnail } />
                <h5>
                    {this.props.item['Type']}
                </h5>
                <p>
                    {this.props.item['Name']}
                </p>
            </div>
        )
    }
})

module.exports = DragSource('sprite', mySource, collect)(GenericDragItem)
