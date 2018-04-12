import React          from 'react'
import createReactClass from 'create-react-class'

import { Pagination } from 'react-bootstrap'

const GriddleBootstrapPager = createReactClass({
  getDefaultProps() {
    return {
      currentPage : 0,
      maxPage     : 0,
      maxButtons  : 12
    }
  },
  handleSelect(eventKey, e) {
    const page = eventKey
    if (page > this.props.maxPage || !page) {
      return
    }
        
    this.props.setPage(page)
  },
  render() {
    const maxPage = this.props.maxPage
        
    if (maxPage < 2) {
      return <span />
    }
        
    return (
      <Pagination
        bssize='small'
        items={maxPage}
        prev={true}
        next={true}
        ellipsis={true}
        maxButtons={Math.min(this.props.maxButtons, maxPage)}
        activePage={this.props.currentPage}
        onSelect={this.handleSelect} />
    )
  }
})

module.exports = GriddleBootstrapPager
