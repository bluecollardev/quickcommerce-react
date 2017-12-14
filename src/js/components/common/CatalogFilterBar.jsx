import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio, } from 'react-bootstrap'

import noUiSlider from 'nouislider'

export default class CatalogFilterBar extends Component {
    constructor(props) {
        super(props)
        
        this.openFilterPane = this.openFilterPane.bind(this)
        this.closeFilterPane = this.closeFilterPane.bind(this)
        this.onFilterSelected = this.onFilterSelected.bind(this)
        this.onFiltersToggleClicked = this.onFiltersToggleClicked.bind(this)
        this.onBlur = this.onBlur.bind(this)
    }
    
    componentDidMount() {
        //document.addEventListener('click', this.onBlur)
        
        let rangeSlider  = document.querySelector('.ui-range-slider')
        
        if (typeof rangeSlider !== 'undefined' && rangeSlider !== null) {
            let dataStartMin = parseInt(rangeSlider.parentNode.getAttribute('data-start-min'), 10),
                dataStartMax = parseInt(rangeSlider.parentNode.getAttribute('data-start-max'), 10),
                dataMin = parseInt(rangeSlider.parentNode.getAttribute('data-min'), 10),
                dataMax = parseInt(rangeSlider.parentNode.getAttribute('data-max'), 10),
                dataStep = parseInt(rangeSlider.parentNode.getAttribute('data-step'), 10)
            
            let valueMin = document.querySelector('.ui-range-value-min span'),
                valueMax = document.querySelector('.ui-range-value-max span'),
                valueMinInput = document.querySelector('.ui-range-value-min input'),
                valueMaxInput = document.querySelector('.ui-range-value-max input')
            
            noUiSlider.create(rangeSlider, {
                start: [ dataStartMin, dataStartMax ],
                connect: true,
                step: dataStep,
                range: {
                    'min': dataMin,
                    'max': dataMax
                }
            })
            
            rangeSlider.noUiSlider.on('update', (values, handle) => {
                let value = values[handle]
                if (handle) {
                    valueMax.innerHTML  = Math.round(value)
                    valueMaxInput.value = Math.round(value)
                } else {
                    valueMin.innerHTML  = Math.round(value)
                    valueMinInput.value = Math.round(value)
                }
            })

        }
    }
    
    componentWillUnmount() {
        //document.removeEventListener(this.onBlur)
    }
    
    onFilterSelected(eventKey) {
        e.preventDefault()
        e.stopPropagation()
        
        if (typeof this.props.onFilterSelected === 'undefined') return false
        
        console.log('executing onFilterSelected callback')
        if (typeof this.props.onFilterSelected === 'function') {
            console.log('execute handler')
            let fn = this.props.onFilterSelected
            fn(eventKey)
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
                
                // Render CatalogFilterBar items
                // TODO: Replace with a string helper method... clean/decode name
                elem = document.createElement('textarea')
                elem.innerHTML = item.name
                name = elem.value
                // TODO: className="active" default tab
                items.push(<NavItem key={idx} eventKey={item.category_id} title={name} onSelect={this.onFilterSelected}>{name} <sup>135</sup></NavItem>)
                //items.push(<li key={idx} eventKey={item.category_id}><a onClick={() => this.onFilterSelected()}>{name}</a></li>)
            }
        }
        
        return items
    }
    
    openFilterPane() {
    }
    
    closeFilterPane() {
        this.criteriaFilterToggle.classList.remove('active')
        this.searchFilterToggle.classList.remove('active')
        this.filtersPane.classList.remove('open')
    }
    
    
    onFiltersToggleClicked(e) {
        let el = e.target
        let currentFilter = document.getElementById(el.rel) // Not ideal for a module... we can refactor this all later
        
        if (el.classList.contains('active')) {
            this.closeFilterPane()
        } else {
            this.closeFilterPane()
            el.classList.add('active')
            currentFilter.classList.add('open')
        }
        
        e.preventDefault()
        e.stopPropagation()
    }
    
    onBlur() {
        this.closeFilterPane()
    }
    
    render() {
        let items = this.renderItems()
		let { tags, priceRange, types, sort } = this.props
        
        return (
            <section className='container-fluid'>
              <div className='filters-bar'>
                <div className='column'>
                  {/* Nav Filters */}
                  <ul className='nav-filters'>
                    {items}
                  </ul>{/* .nav-filters */}
                </div>{/* .column */}
                <div className='column'>
                  <a rel='filters' className='filters-toggle' data-toggle='filters'
                    onClick = {this.onFiltersToggleClicked}
                    ref = {(toggle) => this.criteriaFilterToggle = toggle}>
                    <i className='material-icons filter_list' />
                    Filters
                  </a>
                  <a rel='search-box' className='search-btn' data-toggle='filters'
                    onClick = {this.onFiltersToggleClicked}
                    ref = {(toggle) => this.searchFilterToggle = toggle}>
                    <i className='material-icons search' />
                  </a>
                </div>
              </div>{/* .filters-bar */}
              <div className='row filters'
                ref = {(wrap) => this.filtersWrap = wrap}>
                <div className='col-xs-12 filters-pane' id='filters'
                  ref = {(filters) => this.filtersPane = filters}>
                  <div className='row'>
                    <div className='col-md-3'>
                      {/* Sorting Widget */}
                      <div className='widget widget-sorting'>
                        <h3 className='widget-title'>Sort By</h3>
                        <ul>
						{Object.keys(sort).map((key, idx) => (
						  <li key={idx} rel={key} className='active'><a href='#'>
                              <i className='material-icons' />
                              {sort[key]}
                            </a></li>
                        ))}
						</ul>
                      </div>{/* .widget.widget-sorting */}
                    </div>
                    <div className='col-md-2'>
                      <div className='widget widget-color'>
                        <h3 className='widget-title'>Types</h3>
                        <ul>
						{Object.keys(types).map((key, idx) => (
                          <li key={idx} rel={key}><a href='#'>
                              <span className='color' style={{backgroundColor: '#93c4ef'}} />
                              {types[key]}
                            </a></li>
						))}
                        </ul>
                      </div>{/* .widget.widget-color */}
                    </div>
                    <div className='col-md-3'>
                      {/* Price Range Widget */}
                      {/* Please note: Only one Range Slider allowed on the page! */}
                      <div className='widget widget-catesgories'>
                        <h3 className='widget-title'>Price Range</h3>
                        <form method='post' className='price-range-slider' data-start-min={priceRange.startMin} data-start-max={priceRange.startMax} data-min={priceRange.min} data-max={priceRange.max} data-step={priceRange.step}>
                          <div className='ui-range-slider' />
                          <footer className='ui-range-slider-footer'>
                            <div className='column'>
                              <button type='submit' className='btn btn-ghost btn-sm btn-default'>Filter</button>
                            </div>
                            <div className='column'>
                              <div className='ui-range-values'>
                                <div className='ui-range-value-min'>
                                  $<span />
                                  <input type='hidden' />
                                </div> -
                                <div className='ui-range-value-max'>
                                  $<span />
                                  <input type='hidden' />
                                </div>
                              </div>
                            </div>
                          </footer>
                        </form>
                      </div>
                    </div>
                    <div className='col-md-3 col-md-offset-1'>
                      {/* Tags Widget */}
                      <div className='widget widget-tags'>
                        <h3 className='widget-title'>Popular Tags</h3>
                        {tags.map((value, idx) => (
						<a key={idx} rel={value} href='#'>{value}</a>
						))}
                      </div>
                    </div>
                  </div>
                </div>
                <form className='col-xs-12 filters-pane' id='search-box'>
                  <input type='text' className='form-control' placeholder='Type and hit enter' />
                </form>
              </div>
            </section>
        )
    }
}