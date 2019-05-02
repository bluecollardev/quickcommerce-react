import React          from 'react'
import { Pagination } from 'react-bootstrap'

const GriddleBootstrapPager = React.createClass({
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
              bsSize     = 'small'
              items      = {maxPage}
              prev       = {true}
              next       = {true}
              ellipsis   = {true}
              maxButtons = {Math.min(this.props.maxButtons, maxPage)}
              activePage = {this.props.currentPage}
              onSelect   = {this.handleSelect} />
        )
    }
})

module.exports = GriddleBootstrapPager
