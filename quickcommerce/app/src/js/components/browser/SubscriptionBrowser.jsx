import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavOption, MenuOption, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

//import ToggleDisplay from 'react-toggle-display'
import Griddle from 'griddle-react'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

//import Stepper from '../stepper/BrowserStepper.jsx'
import BrowserActions from '../../actions/BrowserActions.jsx'
import BrowserStore from '../../stores/BrowserStore.jsx'
import BrowserMenu from './BrowserMenu.jsx'

import CatalogRow from '../catalog/CatalogRow.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'

export default class OptionBrowser extends Component {
    constructor(props) {
        super(props)

        this.configureRow = this.configureRow.bind(this)
        this.getInitialState = this.getInitialState.bind(this)

        this.state = this.getInitialState()
    }

    // TODO: Fry anything we don't need in here!
    getInitialState() {
        let state = {
            categories: [],
            items: [],
            options: [],
            product_category: null, // Pretty sure I changed the name of this stuff
            product_config: { // Pretty sure I changed the name of this stuff
                product_id: null,
                option: []
            },
            availableTracks: [], // Just so we don't forget VEST
            availableDates: [], // VEST as well
            unavailableDates: [], // Bookings,
            stepForward: false
        }

        return state
    }

    configureRow(rowComponent) {
        let that = this
        let fn = null

        if (this.props.hasOwnProperty('onItemClicked') &&
            typeof this.props.onItemClicked === 'function') {

            // Wrap the function in a generic handler so we can pass in custom args
            let callback = fn = this.props.onItemClicked
            fn = function () {
                // What's the current step?
                let step = BrowserActions.getCurrentStep()

                // Make sure there's a next step before calling it into action
                // Also, subtract a step to account for zero index
                if (that.props.stepper.currentStep < (that.props.stepper.steps.length - 1)) {
                    that.props.stepper.next()
                }

                // Execute our handler
                callback(arguments[0])
            }
        } else {
            fn = this.props.onItemClicked
        }

        rowComponent.defaultProps.onItemClicked = fn

        return rowComponent
    }

    render() {
        let rowComponent = this.configureRow(this.props.customRowComponent)

        return (
            <div className='browser-container'>
                <div className='browser-menu-container'>
                    {this.props.displayCategoryFilter && (
                    <CategoryFilterBar
                        items = {this.state.categories}
                        onFilterSelected = {this.props.onFilterSelected}
                        />
                    )}
                    <BrowserMenu
                        steps = {this.props.steps}
                        activeStep = {this.props.activeStep}
                        onStepClicked = {this.props.onStepClicked}
                        />
                    {this.props.displayProductFilter && (
                    <FilterBar
                        />
                    )}
                </div>
                <div className='browser-content'>
                    <Grid fluid={true}>
                        <Griddle
                            showFilter              = {true}
                            columns                 = {[
                                'manufacturer',
                                'name',
                                'model',
                                //'location',
                                //'date_added',
                                //'options',
                                'price'
                            ]}
                            useGriddleStyles        = {false}
                            useCustomPagerComponent = {true}
                            customPagerComponent    = {BootstrapPager}
                            useCustomRowComponent   = {true}
                            resultsPerPage          = {12}
                            customRowComponent      = {rowComponent}
                            results                 = {this.state.items}
                        />
                    </Grid>
                </div>
            </div>
        )
    }

}

ProductBrowser.propTypes = {
    onItemClicked: React.PropTypes.func,
    onFilterSelected: React.PropTypes.func,
    onStepClicked: React.PropTypes.func
}

ProductBrowser.defaultProps = {
    onItemClicked: () => {},
    onFilterSelected: () => {},
    onStepClicked: () => {}
}
