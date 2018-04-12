import React          from 'react'
import createReactClass from 'create-react-class'
import classNames     from 'classnames'
import { DropTarget } from 'react-dnd'
import { Well }       from 'react-bootstrap'

const myTarget = {

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
    canDrop           : monitor.canDrop(),
  }
}

const GenericDropTarget = createReactClass({
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
          className={classNames('text-center', {'well-is-over': isOver})}
          style={{marginBottom: '.5em'}}
          bssize='large'>
          <h1><i className='fa fa-bullseye fa-2x' /></h1>
        </Well>
        <p>
                    Drag an animal here to add it to the zoo.
        </p>
      </div>
        )
  }
})

module.exports = DropTarget('sprite', myTarget, collect)(GenericDropTarget)
