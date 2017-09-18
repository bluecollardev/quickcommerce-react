import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend        from 'react-dnd-html5-backend'

import Griddle             from 'griddle-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import CatalogRow from '../catalog/CatalogRow.jsx'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

export default class BrowserProgress extends Component {
    constructor(props) {
        //catalog, menu
        super(props)
    }
    
    updateProgress(status, value) {
        var that = this
        
        if (typeof ellipsisInterval === 'function') {
            clearInterval(ellipsisInterval)
        }
        
        if (that.progressBar instanceof kendo.ui.ProgressBar) {
            value = (typeof value === 'number') ? value : parseInt(that.progressBar.value() + 1)
            that.progressBar.value(value)
        }
    }
    
    updateProgressText(status) {
        if (typeof ellipsisInterval === 'function') {
            clearInterval(ellipsisInterval)
        }
    }
    
    render() {
        return (
            <div className='browser-container'>
                <div className='browser-content'>
                    <Grid>
                        <Griddle 
                          showFilter              = {true}
                          columns                 = {['Brand', 'Name', 'Type', 'Country', 'Year', 'Options', 'Price']}
                          useGriddleStyles        = {false}
                          useCustomPagerComponent = {true}
                          customPagerComponent    = {BootstrapPager}
                          useCustomRowComponent   = {true}
                          resultsPerPage          = {4}
                          customRowComponent      = {CatalogRow}
                          results                 = {this.state.data} />
                    </Grid>
                </div>
            </div>
        )
    }
    
}




