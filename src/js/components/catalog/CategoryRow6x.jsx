import React, { Component } from 'react'
import { Col, Input } from 'react-bootstrap'

import CategoryDragItem from '../catalog/CategoryDragItem.jsx'

export default class CategoryRow6x extends Component {
  static defaultProps = {
    data: {},
    onItemClicked: () => {}
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col xs={12} sm={4} md={2}>
        <CategoryDragItem
          displayLabel={true}
          displayThumbnail={true}
          id={this.props.data.id}
          item={this.props.data}
          onItemClicked={this.props.onItemClicked}
        />
      </Col>
    )
  }
}
