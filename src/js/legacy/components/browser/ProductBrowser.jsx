import React, { Component } from 'react'
import { Dispatcher } from 'flux'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Well } from 'react-bootstrap'

import Griddle from 'griddle-react'
import BootstrapPager from '../common/GriddleBootstrapPager.jsx'

import Anchor from 'grommet/components/Anchor'
import Box from 'grommet/components/Box'
import Card from 'grommet/components/Card'
import Chart, { Area, Axis, Base, Layers } from 'grommet/components/chart/Chart'
import Menu from 'grommet/components/Menu'
import Footer from 'grommet/components/Footer'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'
import Select from 'grommet/components/Select'
import Heading from 'grommet/components/Heading'
import Hero from 'grommet/components/Hero'
import Image from 'grommet/components/Image'
import Label from 'grommet/components/Label'
import TableHeader from 'grommet/components/TableHeader'
import TableRow from 'grommet/components/TableRow'
import Paragraph from 'grommet/components/Paragraph'
import Quote from 'grommet/components/Quote'
import Section from 'grommet/components/Section'
import SocialShare from 'grommet/components/SocialShare'
import Video from 'grommet/components/Video'
import CirclePlayIcon from 'grommet/components/icons/base/CirclePlay'

//import StarRating from 'react-star-rating'

//import Stepper from '../stepper/BrowserStepper.jsx'
import BrowserActions from '../../actions/BrowserActions.jsx'
import { BrowserStore } from '../../stores/BrowserStore.jsx'

import BrowserMenu from './BrowserMenu.jsx'

import CatalogRow from '../catalog/CatalogRow.jsx'
import CategoryFilterBar from '../common/CategoryFilterBar.jsx'
import FilterBar from '../common/FilterBar.jsx'

import HtmlHelper from '../../helpers/HTML.js'

export default class ProductBrowser extends Component {
    static defaultProps = {
        onItemClicked: () => {},
        onAddToCartClicked: () => {},
        onFilterSelected: () => {},
        onStepClicked: () => {}
    }
    
    constructor(props) {
        super(props)

        this.configureRow = this.configureRow.bind(this)
        this.getInitialState = this.getInitialState.bind(this)
        this.onChange = this.onChange.bind(this)

        this.state = this.getInitialState()
        
		// Initialize or set ProductBrowser dispatcher
		if (!props.hasOwnProperty('dispatcher')) {
			this.dispatcher = new Dispatcher()
		} else {
			this.dispatcher = props.dispatcher
		}
		
		// Initialize or set ProductBrowser store
		if (!props.hasOwnProperty('store')) {
			this.store = new BrowserStore(this.dispatcher)
		} else {
			this.store = props.store
		}
		
		// Initialize or set ProductBrowser actions
		if (!props.hasOwnProperty('actions')) {
			this.actions = BrowserActions(this.dispatcher)
		} else {
			this.actions = props.actions
		}
    }
	
	// Need to pass in non-default actions, this component needs some work, right now it's a hassle to get it working 
	// in any manner other than with Quick Commerce endpoints
	setActions(actions) {
		this.actions = actions
	}

    // TODO: Fry anything we don't need in here!
    getInitialState() {
        let state = {
            categories: [],
            items: [],
            options: [],
            availableTracks: [], // Just so we don't forget VEST
            availableDates: [], // VEST as well
            unavailableDates: [], // Bookings,
            stepForward: false
        }

        return state
    }

    componentDidMount() {
        // Subscribe to BrowserStore to listen for changes when the component is mounted
        this.store.addChangeListener(this.onChange)
        
        //let cards = document.getElementsByClassName('card')
        //HtmlHelper.equalHeights(cards, true)
    }
    
    componentDidUpdate() {
        let cards = document.getElementsByClassName('card')
        //HtmlHelper.equalHeights(cards, true)
    }
    
    componentWillUnmount() {
        if (typeof this.onChange === 'function') {
            this.store.removeChangeListener(this.onChange)
            
            //delete this.onChange // Don't think that's necessary
        }
    }
    
    componentWillReceiveProps(newProps) {
        this.onChange()
    }
    
	// ProductBrowser.onChange
    onChange() {
        // Default sort by sort order
        // TODO: Make it configurable
        let sort = this.props.sortAlgorithm // default | numeric | unsorted | more to come
        
        // Grab our items and update our component state whenever the BrowserStore is updated
        let items = this.store.getItems(sort)
        let categories = this.store.getCategories()
        let options = this.store.getOptions()
		
		/*console.log('product browser state change detected')
		console.log(categories)
		console.log(items)
		console.log(options)*/

        this.setState({
            categories: categories,
            items: items,
            options: options
        })
    }

    reset() {
        this.props.stepper.start()
    }

    onCatalogChange() {
        /*var steps = that.steps,
            step = that.step,
            menuItem = that.menu.dataSource.at(step),
            type = (typeof menuItem !== 'undefined') ? menuItem.type : null,
            item = e.sender.select(),
            id = item.attr('data-id'),
            entityType = item.attr('data-entity'),
            productConfig,
            optionsConfig,
            productOptionId

        console.log('catalog browser change event triggered')
        console.log('selected item item of type: ' + entityType + ' with id: ' + id + '... storing id to view-model')
        console.log(item)
        if (typeof entityType !== 'undefined') {
            // Execute before next
            if (steps.hasOwnProperty(step) && steps[step].hasOwnProperty('before')) {
                productConfig = viewModel.get('product_config')

                console.log('applying step callbacks before setting the product...')
                var fn = steps[step].before // This would be the 'after' event handler callback
                fn({
                    viewModel: viewModel,
                    product: productConfig || null,
                    step: step || false,
                    item: item || null
                })
            }

            if (entityType === 'category') {
                viewModel.set('category_id', id)
            } else {
                productConfig = viewModel.get('product_config')

                // If product configuration does not exist, then create one
                if (typeof productConfig === 'undefined' || !(productConfig instanceof kendo.data.ObservableObject)) {
                    productConfig = new kendo.data.ObservableObject()
                    viewModel.set('product_config', productConfig)
                }

                switch (entityType) {
                    case 'product':
                        optionsConfig = viewModel.get('product_config.option')

                        viewModel.set('product_config.product_id', id)

                        // Changed products, so clear any options if they exist
                        if (typeof optionsConfig !== 'undefined' && optionsConfig instanceof kendo.data.ObservableObject) {
                            viewModel.set('product_config.option', undefined)
                        }

                        break

                    case 'option':
                        optionsConfig = viewModel.get('product_config.option')

                        // If option configuration does not exist, then create one
                        if (typeof optionsConfig === 'undefined') {
                            optionsConfig = new kendo.data.ObservableObject()
                            viewModel.set('product_config.option', optionsConfig)
                        }

                        if (type === 'select' || type === 'checkbox') {
                            productOptionId = item.attr('data-product-option-id')
                            // We have to add a prefix - kendo datasources use dot notation to reference data items
                            optionsConfig.set('product_option_' + productOptionId, id) // Single select
                            //optionsConfig.set('product_option_' + productOptionId, id) // TODO: Multiple select
                        } else if (type === 'date' || type == 'time' || type == 'datetime') {
                            productOptionId = item.attr('data-id')

                            var scheduler = item.find('.product-option-scheduler-widget').first().data('kendoScheduler')
                            var slot = scheduler.select()

                            // TODO: Validations!
                            if (slot.hasOwnProperty('start')) {
                                optionsConfig.set('product_option_' + productOptionId, slot.start) // Date
                                // TODO: This isn't necessarily the best place for this but it will suffice for now it's alright...
                                //that.getAvailableTracks(null, slot.start)
                            }
                        }

                        break
                }
            }
        }*/
    }

    applyFilters(filterValue) {
        var that = this,
            steps = that.steps,
            step = that.step // - 1 // For some reason this is in place on the tablet
            // Might be due to the tablet's ajax call for data... step has changed by the time databinding occurs
            // TODO: Confirm that the way we're doing this is alright

        //console.log('applying filters for step ' + step)
        //if (step === -1) return false // For some reason this is in place on the tablet

        if (steps[step].hasOwnProperty('filter')) {
            //console.log('step has filter')
            //console.log(steps[step].filter)
            var target = steps[step].filter.target,
                filters = (typeof target.filter() !== 'undefined') ? target.filter().filters : []
                filter = $.extend(true, steps[step].filter.filter, { value: filterValue })

            if (filters.length > 0) {
                var exists = false
                // TODO: Make a helper? Yeah...
                $.each(filters, function (idx, obj) {
                    // TODO: Add customization -- do we append? Or overwrite
                    // We can do that some other time
                    // TODO: Support multiple filters
                    if (obj.field === filter.field) {
                        $.extend(true, filters[idx], filter)
                        exists = true
                    }
                })

                if (!exists) {
                    filters.push(filter)
                }
            } else {
                filters.push(filter)
            }

            target.filter(filters)
        }
    }

    applyFilters() {
        console.log('catalog is databound')
        //console.log(that.catalog)

        //console.log('calling applyFilters()')
        that.applyFilters(id)
        if (steps.hasOwnProperty(step) && steps[step].hasOwnProperty('filtersApplied')) {
            console.log('applying filtersApplied callback before moving to the next step...')
            var fn = steps[step].filtersApplied // This would be the 'after' event handler callback
            fn({
                viewModel: viewModel,
                product: productConfig || null,
                step: step || false,
                item: item || null
            })
        }

        // Rebind
        kendo.unbind(that.catalog.element, viewModel)
        kendo.bind(that.catalog.element, viewModel)
    }

    configureRow(rowComponent) {
        let that = this
        let fn = null
        
        // Configure product browser row
        if (this.props.hasOwnProperty('onItemClicked') &&
            typeof this.props.onItemClicked === 'function') {

            // Wrap the function in a generic handler so we can pass in custom args
            let callback = fn = this.props.onItemClicked
            fn = function() {
                // What's the current step?
                let step = that.store.getConfig()

                // Make sure there's a next step before calling it into action
                // Also, subtract a step to account for zero index
                if (that.props.stepper.currentStep < (that.props.stepper.steps.length - 1)) {
                    that.props.stepper.next()
                }

                // Execute our handler
                callback(...arguments)
            }
        } else {
            fn = this.props.onItemClicked
        }

        rowComponent.defaultProps.onItemClicked = fn
        rowComponent.defaultProps.onAddToCartClicked = this.props.onAddToCartClicked // Shortcut - quick add to cart
        rowComponent.defaultProps.stepper = this.props.stepper

        return rowComponent
    }

    render() {
        // Render ProductBrowser
        let rowComponent = this.configureRow(this.props.customRowComponent)
        let item = this.props.item || null
		
		console.log('product browser render triggered')
		console.log(this.state)

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
                
                {this.props.displayTitle && (
                    <div>
                        <hr />                
                        <h4 className='browser-product-title'>{this.props.title}</h4>
                    </div>
                )}
                
                {Object.keys(this.state.items).length > 0 && item !== null && (
                <div className='browser-content row'>
                    <Col xs={12}>
                        <FormGroup>
                            <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                            <Well>
                                <Row>
                                    <Col sm={6}>
                                        <Box margin={{top: 'none'}}>
                                            <Box pad={{vertical: 'small'}}
                                                direction='row'
                                                align='center'
                                                justify='between'>
                                                <Label size='small'>Retail Price</Label>
                                                <Paragraph size='large' margin='none'>
                                                    <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                                                </Paragraph>
                                            </Box>
                                            <Box pad={{vertical: 'small'}}
                                                direction='row'
                                                align='center'
                                                justify='between'
                                                separator='top'>
                                                <Label size='small'>Rating</Label>
                                                {/*<StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />*/}
                                            </Box>
                                        </Box>
                                    </Col>
                                    <Col sm={6}>
                                        <Box pad={{vertical: 'small'}}
                                            direction='row'
                                            align='center'
                                            justify='between'>
                                            <Label size='small'>Status</Label>
                                            <Paragraph size='large' margin='none'>
                                                <strong style={{ fontSize: '1rem' }}>{/*item.stock_status*/}</strong>
                                            </Paragraph>
                                        </Box>
                                        <Box margin={{top: 'none'}}>
                                            <Box pad={{vertical: 'small'}}
                                                direction='row'
                                                align='center'
                                                justify='between'
                                                separator='top'>
                                                <Label size='small'>Quantity</Label>
                                                <Paragraph size='large' margin='none'>
                                                    <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                                                </Paragraph>
                                            </Box>
                                        </Box>
                                    </Col>
                                </Row>
                            </Well>
                        </FormGroup>
                    </Col>
                </div>
                )}
                
                {this.props.children && !(Object.keys(this.state.items).length > 0) && (
                <div className='browser-content row'>
                    <Col sm={6}>
                        {item !== null && (
                        <FormGroup>
                            <ControlLabel><h4>{this.props.title}</h4></ControlLabel>
                            <Well>
                                <Row>
                                    <Col xs={12}>
                                        <Box margin={{top: 'none'}}>
                                            <Box pad={{vertical: 'small'}}
                                                direction='row'
                                                align='center'
                                                justify='between'>
                                                <Label size='small'>Retail Price</Label>
                                                <Paragraph size='large' margin='none'>
                                                    <strong style={{ fontSize: '1.5rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                                                </Paragraph>
                                            </Box>
                                            <Box pad={{vertical: 'small'}}
                                                direction='row'
                                                align='center'
                                                justify='between'
                                                separator='top'>
                                                <Label size='small'>Rating</Label>
                                                {/*<StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />*/}
                                            </Box>
                                        </Box>
                                        <Box pad={{vertical: 'small'}}
                                            direction='row'
                                            align='center'
                                            justify='between'>
                                            <Label size='small'>Status</Label>
                                            <Paragraph size='large' margin='none'>
                                                <strong style={{ fontSize: '1rem' }}>{/*item.stock_status*/}</strong>
                                            </Paragraph>
                                        </Box>
                                        <Box margin={{top: 'none'}}>
                                            <Box pad={{vertical: 'small'}}
                                                direction='row'
                                                align='center'
                                                justify='between'
                                                separator='top'>
                                                <Label size='small'>Quantity</Label>
                                                <Paragraph size='large' margin='none'>
                                                    <strong style={{ fontSize: '1rem' }}>{item.quantity}</strong>
                                                </Paragraph>
                                            </Box>
                                        </Box>
                                    </Col>
                                </Row>
                            </Well>
                        </FormGroup>
                        )}
                    </Col>
                    <Col sm={6}>
                        {this.props.children}
                    </Col>
                </div>
                )}
                
                {this.props.children && (Object.keys(this.state.items).length > 0) && (
                <div className='browser-content row'>
                    <Col sm={6}>
                        {/*item !== null && (
                        <FormGroup>
                            <ControlLabel>Product Details</ControlLabel>
                            <Well>
                                <Box margin={{top: 'none'}}>
                                    <Paragraph size='large' margin='none'>
                                        <h3>{this.props.title}</h3>
                                    </Paragraph>
                                    
                                    <Box pad={{vertical: 'small'}}
                                        direction='row'
                                        align='center'
                                        justify='between'
                                        separator='top'>
                                        <Label size='small' uppercase>Retail Price</Label>
                                        <Paragraph size='large' margin='none'>
                                            <strong style={{ fontSize: '1.7rem' }}>${parseFloat(item.price).toFixed(2)}</strong>
                                        </Paragraph>
                                    </Box>
                                    <Box pad={{vertical: 'small'}}
                                        direction='row'
                                        align='center'
                                        justify='between'
                                        separator='top'>
                                        <Label size='small' uppercase>Status</Label>
                                        <Paragraph size='large' margin='none'>
                                            <strong style={{ fontSize: '1.3rem' }}>Some Stock Status</strong>
                                        </Paragraph>
                                    </Box>
                                    <Box pad={{vertical: 'small'}}
                                        direction='row'
                                        align='center'
                                        justify='between'
                                        separator='top'>
                                        <Label size='small' uppercase>Qty Available</Label>
                                        <Paragraph size='large' margin='none'>
                                            <strong style={{ fontSize: '1.3rem' }}>{item.quantity}</strong>
                                        </Paragraph>
                                    </Box>
                                    <Box pad={{vertical: 'small'}}
                                        direction='row'
                                        align='center'
                                        justify='between'
                                        separator='top'>
                                        <Label size='small' uppercase>Average Review</Label>
                                        <StarRating name='react-star-rating' size={20} totalStars={5} rating={item.rating} />
                                    </Box>
                                </Box>
                            </Well>
                        </FormGroup>
                        )*/}
                        <Grid fluid={true}>
                            <Griddle
                                showFilter              = {this.props.displayTextFilter}
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
                                initialSort             = {this.props.initialSort}
                                resultsPerPage          = {12}
                                customRowComponent      = {rowComponent}
                                results                 = {this.state.items}
                            />
                        </Grid>
                    </Col>
                    <Col sm={6}>
                        {this.props.children}
                    </Col>
                </div>
                )}
                    
                {!this.props.children && (
                <div className='browser-content row'>
                    <Grid fluid={true}>
                        <Griddle
                            showFilter              = {this.props.displayTextFilter}
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
                )}
            </div>
        )
    }

}

ProductBrowser.propTypes = {
    onItemClicked: React.PropTypes.func,
    onFilterSelected: React.PropTypes.func,
    onStepClicked: React.PropTypes.func
}