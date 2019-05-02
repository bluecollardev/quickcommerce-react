import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { DropTarget } from 'react-dnd'
import classNames from 'classnames'

import { Well } from 'react-bootstrap'

import RowComponent from './CartRow.jsx'
import ContainerComponent from './CartTable.jsx'

let cartTarget = {
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
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    }
}

@inject(deps => ({
    actions: deps.actions,
	cartStore: deps.cartStore
}))
@observer
class Cart extends Component {
    constructor(props) {
        super(props)
        
        this.getInitialState = this.getInitialState.bind(this)
        this.refresh = this.refresh.bind(this)
        this.onChange = this.onChange.bind(this)
        this.addItem = this.addItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        //this.getSelection = this.getSelection.bind(this)
        //this.isEmpty = this.isEmpty.bind(this)
        this.emptyCart = this.emptyCart.bind(this)
        this.clearCart = this.clearCart.bind(this)
        this.reset = this.reset.bind(this)
        
        this.state = this.getInitialState()
    }
    
    getInitialState() {
        return {
            selection: this.props.cartStore.getSelection()
        }
    }
    
    componentDidMount() {
        this.props.actions.cart.init(this.props.items, this.props.cartStore.getSelection())
        
        this.props.cartStore.on('ready', this.refresh)
        this.props.cartStore.on('change', this.onChange)
        this.props.cartStore.on('item-added', this.props.onItemAdded)
        this.props.cartStore.on('item-removed', this.props.onItemRemoved)
        this.props.cartStore.on('item-changed', this.props.onItemQtyChanged)
    }
    
    componentWillUnmount() {
        this.props.cartStore.removeListener('ready', this.refresh)
        this.props.cartStore.removeListener('change', this.onChange)
        this.props.cartStore.removeListener('item-added', this.props.onItemAdded)
        this.props.cartStore.removeListener('item-removed', this.props.onItemRemoved)
        this.props.cartStore.removeListener('item-changed', this.props.onItemQtyChanged)
    }
    
    refresh() {
        this.setState({
            selection: this.props.cartStore.getSelection()
        })
    }
    
    onChange() {
        this.refresh()
        this.props.onChange()
    }
    
    addItem(key, quantity, item) {
        this.props.actions.cart.addItem(key, quantity, item)
    }
    
    removeItem(index) {
        this.props.actions.cart.removeItem(index)
    }
    
    updateQuantity(index, quantity) {
        this.props.actions.cart.updateQuantity(index, quantity)
    }
    
    addOption(key, quantity, item, product) {
        this.props.actions.cart.addOption(key, quantity, item, product)
    }
    
    emptyCart() {
        this.props.actions.cart.emptyCart()
    }
    
    clearCart() {
        this.props.actions.cart.clearCart()
    }
    
    reset() {
        this.props.actions.cart.reset()
    }
    
    render() {
        const { position, isOver, canDrop, connectDropTarget } = this.props
        
        const Container = this.props.containerComponent
        const Row = this.props.rowComponent
        
        let context = this.props.iterator()    
            
        if (this.props.cartStore.isEmpty()) {
            return connectDropTarget(
                <div className='dnd-target-wrapper'>
                    <div>
                        <Well
                          className = {classNames({'well-is-over': isOver})}
                          style = {{marginBottom: '.5em'}}
                          bsSize = 'large'>
                            {/*<h1 className='drop-target-icon' style={{textAlign: 'center'}}><i className='fa fa-bullseye fa-2x' /></h1>*/}
                            <p style={{textAlign: 'center', maxWidth: 'auto'}}>{this.props.cartEmptyMessage}</p>
                        </Well>
                        <p></p>
                    </div>
                </div>
            )
        }
        
        return connectDropTarget(
            <div className='dnd-target-wrapper'>
                <Container
                    tableClassName = {this.props.tableClassName}
                    columns = {this.props.columns}
                    body = {this.state.selection.map(item => {
                      let context = this.props.iterator(context, item)
                      return (
                          <Row
                            key = {item._key}
                            item = {item}
                            columns = {this.props.columns}
                            onItemClicked = {this.props.onItemClicked}
                            removeItem = {()  => this.removeItem(item._index)}
                            setItemQty = {qty => this.updateQuantity(item._index, qty)} />
                      )
                    })}
                    context = {context}
                />
            </div>
        )
    }
}

Cart.propTypes = {
    items             : React.PropTypes.object,
    selection         : React.PropTypes.array,
    onItemDropped     : React.PropTypes.func,
    onItemAdded       : React.PropTypes.func,
    onItemClicked     : React.PropTypes.func,
    onItemRemoved     : React.PropTypes.func,
    onItemQtyChanged  : React.PropTypes.func,
    onChange          : React.PropTypes.func,
    iterator          : React.PropTypes.func,
    tableClassName    : React.PropTypes.string,
    cartEmptyMessage  : React.PropTypes.node

}

Cart.defaultProps = {
    items               : {},
    selection           : [],
    onItemClicked       : () => {},
    onItemDropped       : () => {},
    onItemAdded         : () => {},
    onItemRemoved       : () => {},
    onItemQtyChanged    : () => {},
    onChange            : () => {},
    iterator            : () => { return {} },
    containerComponent  : ContainerComponent,
    rowComponent        : RowComponent,
    tableClassName      : '',
    cartEmptyMessage    : (
        <span><b>Your shopping cart is empty.</b><br/>Please add some products to continue.</span>
    )
}

export default DropTarget('sprite', cartTarget, collect)(Cart)
