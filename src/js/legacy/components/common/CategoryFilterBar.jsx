import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

export default class CategoryFilterBar extends Component {
    constructor(props) {
        super(props)
        
        this.onFilterSelected = this.onFilterSelected.bind(this)
        this.renderItems = this.renderItems.bind(this)
    }
    
    onFilterSelected(eventKey, e) {
        e.preventDefault()
        e.stopPropagation()
        
        if (typeof this.props.onFilterSelected === 'undefined') return false
        
        console.log('executing onFilterSelected callback')
        if (typeof this.props.onFilterSelected === 'function') {
            console.log('execute handler')
            let fn = this.props.onFilterSelected
            fn(eventKey, e)
        }
    }
    
    renderItems() {
        let items = []
        if (typeof this.props.items !== 'undefined' && 
            this.props.items instanceof Array) {
            
            let elem = null
            let item = null
            let name = null

            for (let idx = 0; idx < this.props.items.length; idx++) {
                item = this.props.items[idx]
                
                // TODO: Replace with a string helper method... clean/decode name
                elem = document.createElement('textarea')
                elem.innerHTML = item.name
                name = elem.value
                
                items.push(<NavItem key={idx} eventKey={item.category_id} title={name} onSelect={this.onFilterSelected}>{name}</NavItem>)
            }
        }
        
        return items
    }
    
    render() {
        let items = this.renderItems()
        return (
            <Row className='category-filter-bar'>
                <Col sm={12}>
                    <Navbar collapseOnSelect fluid>
                        <Navbar.Header>
                          <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse style={{overflow: 'visible'}}>
                            <Nav className='multi-filter-panel' justified>
                            {items}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
        )
    }
}