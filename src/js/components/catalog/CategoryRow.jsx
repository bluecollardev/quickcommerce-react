import React, { Component } from 'react'
import { Col, Input } from 'react-bootstrap'

import CategoryDragItem from './CategoryDragItem.jsx'

export default class CategoryRow extends Component {
  static defaultProps = {
    data: {},
    onItemClicked: () => {}
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col xs={12} sm={4}>
        <CategoryDragItem
          item={this.props.data}
          id={this.props.data['category_id']}
          onItemClicked={this.props.onItemClicked}
        />
      </Col>
    )
  }
}
