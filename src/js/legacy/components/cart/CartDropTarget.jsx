import React          from 'react'
import classNames     from 'classnames'
import { DropTarget } from 'react-dnd'
import { Well }       from 'react-bootstrap'

var target = {

    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return
        }
        const item = monitor.getItem()
        component.props.onItemDropped(item.id)
    }

}

function collect(connect, monitor) {
    return {
        connectDropTarget : connect.dropTarget(),
        isOver            : monitor.isOver(),
        canDrop           : monitor.canDrop()
    }
}

const CartDropTarget = React.createClass({
    getDefaultProps() {
        return {
            onItemDropped : () => {}
        }
    },
    render() {
        const { position, isOver, canDrop, connectDropTarget } = this.props
        return connectDropTarget(
            <div>
                <Well 
                  className = {classNames('text-center', {'well-is-over': isOver})}
                  style     = {{marginBottom: '.5em'}}
                  bsSize    = 'large'>
                  {/*<h1 className='drop-target-icon'><i className='fa fa-bullseye fa-2x' /></h1>*/}
                </Well>
            </div>
        )
    }
})

module.exports = DropTarget('sprite', target, collect)(CartDropTarget)
