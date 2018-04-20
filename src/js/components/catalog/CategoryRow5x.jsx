import React, { Component } from 'react'
import { Input } from 'react-bootstrap'

import CategoryDragItem from '../catalog/CategoryDragItem.jsx'

export default class CategoryRow5x extends Component {
  static defaultProps = {
    data: {},
    onItemClicked: () => {}
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='col-xs-12 col-sm-4 col-md-2 col-md-push-1'>
        <CategoryDragItem
          displayLabel={true}
          displayThumbnail={true}
          id={this.props.data.id}
          item={this.props.data}
          onItemClicked={this.props.onItemClicked}
        />
      </div>
    )
  }
}
