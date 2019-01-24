import createReactClass from 'create-react-class'
import React from 'react'
import { Thumbnail } from 'react-bootstrap'
import { DragSource } from 'react-dnd'

import HtmlHelper from '../../helpers/HTML.js'

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

const CartMenuDragItem = createReactClass({
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
    const { id, isDragging, connectDragSource } = this.props

    return connectDragSource(
      <div className='card'
        onClick={this.onClick}>
        {this.props.displayLabel && (<span className="shop-label text-danger">Sale</span>)}
        {this.props.displayPrimaryImage && (
          <Thumbnail
            className='shop-thumbnail'
            src={this.props.item.image}>
            {this.props.children}
            <div className="card-tools">
              <a href="#" className="add-to-wishlist" data-toggle="tooltip" data-placement="top" title="Wishlist">
                <i className="material-icons favorite_border"/>
              </a>
              <a href="#" className="add-to-cart">
                <em>Order Now</em>
                <svg x="0px" y="0px" width="32px" height="32px" viewBox="0 0 32 32">
                  <path strokeDasharray="19.79 19.79" strokeDashoffset="19.79" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="square" strokeMiterlimit={10}
                    d="M9,17l3.9,3.9c0.1,0.1,0.2,0.1,0.3,0L23,11"
                  />
                </svg>
              </a>
            </div>
          </Thumbnail>
        )}

        {/*<div className="card-details">
         <h5 className='card-brand'>{this.props.item['manufacturer']}</h5>
         </div>*/}

        <div className="card-details">
          <h5 className="card-title h6"><a href="#/product">
            <small><em className='cursive'>{this.props.item['model']}</em></small>
          </a></h5>
        </div>
        <div className="card-details">
          <h3 className="card-title"><a href="#/product"><strong>{this.props.item['name']}</strong></a></h3>
          {this.props.item.hasOwnProperty('price') && this.props.item['price'] !== false && !isNaN(this.props.item['price']) && (
            <span className="card-price">
              {/*<span className="old-price">N/A</span>*/}
              <h3>{'$' + parseFloat(this.props.item['price']).toFixed(2)}</h3>
            </span>
          )}
        </div>

        {this.props.displayDetails && (<p className="card-details" dangerouslySetInnerHTML={{ __html: HtmlHelper.decodeHtmlEntities(this.props.item['description']) }}></p>)}
      </div>
    )
  }
})

export default DragSource('sprite', mySource, collect)(CartMenuDragItem)
