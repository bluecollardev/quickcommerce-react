import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'

import Griddle             from 'griddle-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Stepper from '../stepper/Stepper.js'
import StepAction from '../stepper/StepAction.js'

import CatalogRow from '../catalog/CatalogRow.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

// Step
const Step = (props) =>
  <div className="StepIndicator__step">
    <div className="StepIndicator__indicator">
      <span className="StepIndicator__info">{props.indicator}</span>
    </div>
    <div className="StepIndicator__label">{props.title}</div>
    <div className="StepIndicator__panel">
      {props.children}
    </div>
  </div>

// Overlay
const StepIndicator = (props) =>
  <div className='StepIndicator' 
  //className={`StepIndicator ${props.isVertical ? 'StepIndicator--vertical' : ''} ${props.isInline ? 'StepIndicator--inline' : ''}`}
  >
    {props.children}
  </div>

export default class SubscriptionMenu extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            currentTabIndex : 0
        }
        
        this.initMenu = this.initMenu.bind(this)
        this.setMenuItem = this.setMenuItem.bind(this)
    }
    
    initMenu() {
        that.menu.setOptions({
            selectable: true,
            template: kendo.template($('#browser-menu-item-template').html()),
            dataSource: new kendo.data.DataSource({
                data: [],
                schema: {
                    model: {
                        id: 'step',
                        fields: {
                            step: { editable: false, nullable: false },
                            name: { type: 'string', editable: true, nullable: true },
                            image: { type: 'string', editable: true, nullable: true }
                        }
                    }
                }
            })
        })
    }
    
    setMenuItem(step, item) {
        var that = this,
            menuItem = that.menu.dataSource.at(step), // Data items are zero-indexed
            type = menuItem.type,
            dataItem,
            selector
            
        // TODO: Keep this logging for debug mode
        console.log(that.menu)
        //console.log('soon to be previous step has index of ' + step)
        console.log('attempting to fetch menu item with datasource index ' + step)
        
        if (typeof menuItem !== 'undefined') {
            console.log('found menu item at step ' + step)
            console.log(menuItem)
        }
        
        selector = '[data-step=' + step + '] ~ [data-step]'
        //console.log('only display menu items matching selector ' + selector)
            
        //console.log('fetching selected catalog item')
        if (type === 'select' || type === 'checkbox') {
            // A selection should have been made already to get to here
            dataItem = that.catalog.dataSource.get(item.attr('data-id'))
            menuItem.set('name', dataItem.name)
            menuItem.set('image', dataItem.image)
            
        } else if (type === 'date' || type == 'time' || type == 'datetime') {
            // Select on click is disabled for date/time types - events are forwarded
            // Manually select first data item
            dataItem = that.catalog.dataSource.at(0)
            menuItem.set('name', 'Race Day')
            menuItem.set('image', null)
            // TODO: This could *not* be a scheduler too, but no time for that right now 
            menuItem.set('date', that.formatDate(item.find('.product-option-scheduler-widget').data('kendoScheduler').select().start))
        }
        
        that.menu.refresh() // Re-draw first
        
        that.menu.element.find(selector).hide().end()
            .find('[data-step]').not(selector).show()
    }
    
    render() {
        return (
            <div className='browser-container'>
                <div className='browser-content'>
                    <StepIndicator>
                      <Step indicator="1" title="Customize">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>          
                      <Step indicator="2" title="Delivery">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>          
                      <Step indicator="3" title="Timing">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>
                    </StepIndicator> 

                    {/*<StepIndicator isVertical>
                      <Step indicator="1" title="Step 1">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>          
                      <Step indicator="2" title="Step 2">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>          
                      <Step indicator="3" title="Step 3">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>               
                    </StepIndicator> 

                    <StepIndicator isInline>
                      <Step indicator="1" title="Step 1">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>          
                      <Step indicator="2" title="Step 2">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>          
                      <Step indicator="3" title="Step 3">
                        <div className="Content">
                          <button>Prev</button>
                          <button>Next</button>
                        </div>
                      </Step>               
                    </StepIndicator>*/}
                </div>
            </div>
        )
    }
    
}




