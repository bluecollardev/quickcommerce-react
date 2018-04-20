import React, { Component } from 'react'
import { Col, Input } from 'react-bootstrap'

import CategoryDragItem from '../catalog/CategoryDragItem.jsx'

export default class CategoryRow3x extends Component {
  static defaultProps = {
    data: {},
    onItemClicked: () => {}
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Col xs={6} sm={4}>
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
