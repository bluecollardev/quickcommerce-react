import React, { Component } from 'react'
import { Col, Input } from 'react-bootstrap'

import CartDragItem from '../cart/CartDragItem.jsx'

export default class CatalogRow extends Component {
  static defaultProps = {
    data: {},
    onItemClicked: () => {}
  }

  constructor(props) {
    super(props)
  }

  render() {
    // TODO: Use mappings!
    return (
      <Col xs={12} sm={4}>
        <CartDragItem
          item={this.props.data}
          id={this.props.data['product_id']}
          onItemClicked={this.props.onItemClicked}
        />
      </Col>
    )
  }
}
