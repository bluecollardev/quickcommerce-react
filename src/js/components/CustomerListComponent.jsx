import assign from 'object-assign'

import React, { Component } from 'react'

import { Col, Row, Modal } from 'react-bootstrap'
//import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Checkbox, Radio } from 'react-bootstrap'
import { Jumbotron } from 'react-bootstrap'

// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'

//import OmniSearch from './search/OmniSearch.jsx'
import CustomerPicker from './customer/CustomerPickerAlt.jsx'
import SignInForm from './account/SignInForm.jsx'
//import CreditCardForm from './payment/CreditCardForm.jsx'
import CustomerProfile from './customer/AuthenticatedCustomerFullProfile.jsx'
import CustomerFilter from './filter/CustomerFilter.jsx'

import LoginStore from '../stores/LoginStore.jsx'
import UserStore from '../stores/UserStore.jsx'

import CustomerSearchActions from '../actions/CustomerSearchActions.jsx'
import CustomerSearchStore from '../stores/CustomerSearchStore.jsx'

import CustomerListActions from '../actions/CustomerListActions.jsx'
import CustomerListStore from '../stores/CustomerListStore.jsx'

import CustomerStore from '../stores/CustomerStore.jsx'
import CheckoutStore from '../stores/CheckoutStore.jsx'

//import { withStyles } from 'material-ui/styles'

import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'

import Table, {
	TableBody,
	TableHead,
	TableRow,
	TableCell
} from 'material-ui/Table'

import {
	SortingState, SelectionState, 
	FilteringState, PagingState, 
	EditingState,
	GroupingState, ColumnOrderState,
	LocalFiltering, LocalGrouping, 
	LocalPaging, LocalSorting, 
	RowDetailState as DxRowDetailState
} from '@devexpress/dx-react-grid'

import { 
	Grid as DxGrid, 
	TableView as DxTableView, 
	TableHeaderRow as DxTableHeaderRow, 
	TableRowDetail as DxTableRowDetail,
	TableFilterRow, TableSelection, TableGroupRow, 
	TableEditColumn, TableEditRow,
	PagingPanel, GroupingPanel
} from '@devexpress/dx-react-grid-material-ui'

import { AppBar, Paper, Typography, Divider } from 'material-ui'

import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Tabs, { Tab } from 'material-ui/Tabs'

import DoneIcon from 'material-ui-icons/Done'
import PauseIcon from 'material-ui-icons/PauseCircleOutline'
import LoopIcon from 'material-ui-icons/Loop'
import HelpIcon from 'material-ui-icons/HelpOutline'

import { withStyles } from 'material-ui/styles'

import { 
	generateRows,
	employeeValues,
	employeeTaskValues 
} from '../utils/Generator'

// TODO: Actually map the fields...
/*import customerFieldNames from '../forms/CustomerInfoFields.jsx'
import addressFieldNames from '../forms/AddressFields.jsx'
import dealFieldNames from '../forms/DealFields.jsx'*/

import customerFieldNames from '../mappings/CustomerInfoMappings.jsx'
import addressFieldNames from '../mappings/AddressMappings.jsx'
import dealFieldNames from '../mappings/DealMappings.jsx'

import DeleteIcon from 'material-ui-icons/Delete'
import EditIcon from 'material-ui-icons/Edit'
import SaveIcon from 'material-ui-icons/Save'
import CancelIcon from 'material-ui-icons/Cancel'
import OpenInNewIcon from 'material-ui-icons/OpenInNew'

const customerCommands = {
	add: (onClick, allowAdding) => (
		<div style={{ textAlign: 'center' }}>
		  <Button
			color='primary'
			onClick={onClick}
			title='Create new row'
			disabled={!allowAdding}>
			New
		  </Button>
		</div>
	),
	edit: onClick => (
		<IconButton onClick={() => window.location.hash = 'customer/2/edit'} title='Edit row'>
		  <EditIcon />
		</IconButton>
	),
	delete: onClick => (
		<IconButton onClick={onClick} title='Delete row'>
		  <DeleteIcon />
		</IconButton>
	),
	commit: onClick => (
		<IconButton onClick={onClick} title='Save changes'>
		  <SaveIcon />
		</IconButton>
	),
	cancel: onClick => (
		<IconButton onClick={onClick} title='Cancel changes'>
		  <CancelIcon />
		</IconButton>
	)
}

const dealCommands = {
	add: (onClick, allowAdding) => (
		<div style={{ textAlign: 'center' }}>
		  <Button
			color='primary'
			onClick={() => window.location.hash = 'retail/create'}
			title='Create new row'
			disabled={!allowAdding}>
			New
		  </Button>
		</div>
	),
	edit: onClick => {
		// Test onClick for CustomerListComponent
		return (
			<IconButton onClick={() => window.location.hash = 'retail/edit'} title='Edit row'>
			  <OpenInNewIcon />
			</IconButton>
		)
	},
	delete: onClick => (
		<IconButton onClick={onClick} title='Delete row'>
		  <DeleteIcon />
		</IconButton>
	),
	commit: onClick => (
		<IconButton onClick={onClick} title='Save changes'>
		  <SaveIcon />
		</IconButton>
	),
	cancel: onClick => (
		<IconButton onClick={onClick} title='Cancel changes'>
		  <CancelIcon />
		</IconButton>
	)
}

/*const TabContainer = (props) => {
	return <div style={{ padding: 20 }}>{props.children}</div>
}*/

const TaskIcon = ({ status }) => {
	switch (status) {
		case 'Deferred': return <PauseIcon />
		case 'In Progress': return <LoopIcon />
		case 'Need Assistance': return <HelpIcon />
		default: return <DoneIcon />
	}
}

const TabContainer = ({ rows }) => {
	const lastItemIndex = rows.length - 1

	return (
		<List style={{ height: 'auto' }}>
			{rows.map((item, index) => {
				const key = index
				const status = item.status
				return (
					<div key={key}>
						<ListItem dense>
						  <ListItemText primary={item.subject} />
						  <ListItemSecondaryAction>
							<IconButton aria-label={status}>
							  <TaskIcon status={status} />
							</IconButton>
						  </ListItemSecondaryAction>
						</ListItem>
						{index < lastItemIndex && <Divider />}
					</div>
				)
			})}
		</List>
	)
}

class GridDetailContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lowPriorityTasks: this.findTasks('Low'),
			normalPriorityTasks: this.findTasks('Normal'),
			highPriorityTasks: this.findTasks('High'),
		}

		this.state.value = this.firstSelectedItem()
		this.handleChange = this.handleChange.bind(this)
	}

	findTasks(priority) {
		return this.props.data.tasks.filter(task => task.priority === priority)
	}

	firstSelectedItem() {
		let result = 0
		const { lowPriorityTasks, normalPriorityTasks } = this.state

		if (!lowPriorityTasks.length) {
			result = normalPriorityTasks.length ? 1 : 2
		}

		return result
	}
	
	handleChange(event, value) {
		this.setState({ value })
	}
	
	render() {
		const { lowPriorityTasks, normalPriorityTasks, highPriorityTasks, value } = this.state
		const { data, classes } = this.props
		console.log('are we rendering the deal info?')
		console.log(lowPriorityTasks)
		console.log(normalPriorityTasks)
		console.log(highPriorityTasks)
		return (
		  <div>
			<Paper>
				<AppBar position='static' color='inherit'>
					<Tabs
						value={value}
						onChange={this.handleChange}
						fullWidth>
						<Tab label={`Low (${lowPriorityTasks.length})`} disabled={!lowPriorityTasks.length} />
						<Tab label={`Normal (${normalPriorityTasks.length})`} disabled={!normalPriorityTasks.length} />
						<Tab label={`High (${highPriorityTasks.length})`} disabled={!highPriorityTasks.length} />
					</Tabs>
				</AppBar>
				{value === 0 && <TabContainer rows={lowPriorityTasks} />}
				{value === 1 && <TabContainer rows={normalPriorityTasks} />}
				{value === 2 && <TabContainer rows={highPriorityTasks} />}
			</Paper>
		  </div>
		)
	}
}

/*GridDetailContainerBase.propTypes = {
	data: PropTypes.shape().isRequired,
	classes: PropTypes.object.isRequired,
}*/

//const GridDetailContainer = withStyles(styles, { name: 'ThemingDemo' })(GridDetailContainerBase)
//const GridDetailContainer = (GridDetailContainerBase)

export default AuthenticatedComponent(class CustomerListComponent extends Component {
    constructor(props) {
        super(props)
        
        this.onLoginSuccess = this.onLoginSuccess.bind(this)
        this.onProfileCreate = this.onProfileCreate.bind(this)
        this.onProfileSelect = this.onProfileSelect.bind(this)
        this.hideCustomerSearchModal = this.hideCustomerSearchModal.bind(this)
        
        this.state = {
            profileCreate: true,
            profileEdit: false,
			customerSearch: true,
			customerColumns: [
				{ name: customerFieldNames.DISPLAY_NAME, title: 'Name' },
				//{ name: customerFieldNames.GENDER, title: 'Gender' },
				{ name: addressFieldNames.CITY, title: 'City' },
				{ name: customerFieldNames.TELEPHONE, title: 'Phone' },
				{ name: customerFieldNames.EMAIL, title: 'Email' }
			],
			dealColumns: [
				//{ name: dealFieldNames.DEAL_NUMBER, title: 'Deal No.' },
				{ name: dealFieldNames.DEAL_ID, title: 'Deal No.' },
				//{ name: dealFieldNames.REF_NUMBER, title: 'Reference No.' },
				{ name: 'agent', title: 'Agent' },
				{ name: dealFieldNames.DATE_CREATED, title: 'Created' },
				{ name: 'lenders', title: 'Lenders' }
			],
			//rows: CustomerListStore.getItems(), //generateRows({ length: 22 }),
			customerRows: [],
			expandedCustomerRows: [],
			expandedDealRows: [],
			allowedPageSizes: [5, 10, 15]
        }
		
		this.changeCustomerDetails = expandedCustomerRows => this.setState({ expandedCustomerRows })
		this.changeDealDetails = expandedDealRows => this.setState({ expandedDealRows })
		
		this.rowTemplate = ({ row }) => {
			//const { dealColumns, allowedPageSizes } = this.state
			const { dealColumns, expandedDealRows, allowedPageSizes } = this.state
			
			let data = []
			if (row.hasOwnProperty('deals') && 
				row.deals instanceof Array) {
				data = row.deals
			}
			
			if (!(data.length > 0)) {
				return null
			}
			
			// TODO: Auto-format data
			data = data.map(row => {
				// TODO: Detect date object type
				if (row.hasOwnProperty('creationDate')) {
					let date = row.creationDate
					date = new Date(date.year, date.month, date.day).toDateString()
					row.creationDate = (date === 'Invalid Date') ? '' : date
					
					row = assign({}, row, { 
						tasks: generateRows({
							columnValues: employeeTaskValues,
							length: Math.floor(Math.random() * 4) + 30
						})
					})
				}
				
				return row
			})
			
			console.log('data rows')
			console.log(data)
			
			return (
				<DxGrid
					rows={data}
					columns={dealColumns}>
					<ColumnOrderState defaultOrder={dealColumns.map(column => column.name)} />
					
					{/*<FilteringState
					  defaultFilters={[]}
					/>*/}
					<SortingState
					  defaultSorting={[
						{ columnName: 'name', direction: 'asc' },
						{ columnName: 'city', direction: 'asc' },
					  ]}
					/>
					{/*<GroupingState
					  defaultGrouping={[]}
					  defaultExpandedGroups={[]}
					/>*/}
					<PagingState
					  defaultCurrentPage={0}
					  defaultPageSize={10}
					/>
					{/*<LocalFiltering />*/}
					<LocalSorting />
					{/*<LocalGrouping />*/}
					{/*<LocalPaging />*/}
					<SelectionState
					  defaultSelection={[]}
					/>
					<DxRowDetailState
						expandedRows={expandedDealRows}
						onExpandedRowsChange={this.changeDealDetails} />
					<DxTableView 
						tableCellTemplate={({ row, column, style }) => {
							if (column.name === 'complete') {
								return (
									<ProgressBarCell value={row.complete * 100} style={style} />
								)
							} else if (column.name === '{{highlighted}}') {
								return (
									<HighlightedCell align={column.align} value={row.amount} style={style} />
								)
							} else if (column.name === 'lenders') {
								return (
									<div style={{
										display: 'flex',
										justifyContent: 'flex-start'
									}}>
										<div style={{
											display: 'flex',
											flexDirection: 'column'
										}}>
											<Button style={{
												backgroundColor: 'green',
												color: 'white'
											}}>AP</Button>
											<select>
												<option>TD</option>
											</select>
										</div>
										&nbsp;
										<div style={{
											display: 'flex',
											flexDirection: 'column'
										}}>
											<Button style={{
												backgroundColor: 'gold',
												color: 'white'
											}}>CA</Button>
											<select>
												<option>RBC</option>
											</select>
										</div>
										&nbsp;
										<div style={{
											display: 'flex',
											flexDirection: 'column'
										}}>
											<Button style={{
												backgroundColor: 'purple',
												color: 'white'
											}}>DR</Button>
											<select>
												<option>Serv</option>
											</select>
										</div>
										&nbsp;
										<div style={{
											display: 'flex',
											flexDirection: 'column'
										}}>
											<Button style={{
												backgroundColor: 'red',
												color: 'white'
											}}>DE</Button>
											<select>
												<option>SDA</option>
											</select>
										</div>
										&nbsp;
										<div style={{
											display: 'flex',
											flexDirection: 'column'
										}}>
											<Button style={{
												backgroundColor: 'lightgrey',
												color: 'black'
											}}>+</Button>
										</div>
									</div>
								)
							} else {
								return undefined
							}
						}} />
					<DxTableHeaderRow allowSorting />
					<EditingState onCommitChanges={() => { return }} />
					<TableEditRow />
					<TableEditColumn
						allowAdding
						allowEditing
						commandTemplate={({ executeCommand, id }) => {
							const template = dealCommands[id]
							if (template) {
								const allowAdding = true
								const onClick = (e) => {
									executeCommand()
									e.stopPropagation()
								}
								return template(
									onClick,
									allowAdding,
								)
							}

							return undefined
						}}
					/>
					{/*<TableFilterRow />*/}
					<DxTableRowDetail 
						template={({ row }) => {				
							console.log('dxtablerowdetail row')
							console.log(row)
							
							return (
								<GridDetailContainer
									data={row} />
							)
						}} />
				</DxGrid>				
			)
		}
    }
    
    hideCustomerSearchModal() {
        this.setState({
            customerSearch: null
        })
    }
    
    getLoginState() {
        return {
            loggedIn: LoginStore.isLoggedIn(),
            user: LoginStore.user,
            userToken: LoginStore.userToken
        }
    }
    
    getUserState() {
        return {
            loggedIn: LoginStore.isLoggedIn(),
            user: UserStore.user,
            billingAddress: UserStore.billingAddress,
            shippingAddress: UserStore.shippingAddress,
            userToken: LoginStore.userToken
        }
    }
    
    getCustomerState() {
        return {
            loggedIn: LoginStore.isLoggedIn(),
            customer: CustomerStore.customer,
            billingAddress: CustomerStore.billingAddress,
            billingAddressString: CustomerStore.billingAddressString,
            shippingAddress: CustomerStore.shippingAddress,
            shippingAddressString: CustomerStore.shippingAddressString,
            customerToken: CustomerStore.customerToken
        }
    }

    componentDidMount() {
        this.changeListener = this.onChange.bind(this)
        LoginStore.addChangeListener(this.changeListener)
        UserStore.addChangeListener(this.changeListener)
        CustomerStore.addChangeListener(this.changeListener)
        CustomerSearchStore.addChangeListener(this.changeListener)
		
		// Get initial result set
		CustomerSearchActions.search({ search: '' })
    }
	
	componentWillUnmount() {
        LoginStore.removeChangeListener(this.changeListener)
        UserStore.removeChangeListener(this.changeListener)
        CustomerStore.removeChangeListener(this.changeListener)
		CustomerSearchStore.removeChangeListener(this.changeListener)
    }

    onChange() {
		// CustomerListComponent onChange handler
		let state = assign({}, this.state, { 
			customerRows: CustomerSearchStore.getItems() || []
		})
		
        this.setState(state)
    }
    
    onLoginSuccess(e) {
        window.location.hash = '/account/edit'
    }
    
    onProfileCreate() {
        this.setState({
            profileCreate: true,
            profileEdit: false
        })
    }
    
    onProfileSelect() {
        this.setState({
            profileCreate: false,
            profileEdit: true,
            customerSearch: null
        })
    }
    
    render() {
		const { customerRows, customerColumns, expandedCustomerRows, allowedPageSizes } = this.state
		
        return (
            <div className='container-fluid'>
				{/*<Row className='searchDrawer'
					style = {{ backgroundColor: '#0071BC' }}>
                    <OmniSearch
                        title = 'Search Customers'
                        customer = {CheckoutStore.customer}
                        onCreate = {this.onProfileCreate}
                        onSelect = {this.onProfileSelect}
                        />
						<CustomerFilter
						ref = {(profile) => {this.profile = profile}}/>
				</Row>*/}
				
				<Row style={{ backgroundColor: '#0071bc' }}>
					<Col xs={12}>
						<h4 className='section-heading' style={{ marginTop: '0.4rem', display: 'flex', textAlign: 'center', justifyContent: 'space-between' }}>
							<span style={{ color: 'white', alignSelf: 'center', justifySelf: 'center' }}>Customers</span> {/* TODO: make heading equal height, just dumping in empty button to fill space for now */}
							<div style={{ display: 'flex', alignItems: 'center', justifySelf: 'flex-end' }}>
								<Chip
									avatar={<Avatar>c</Avatar>}
									label='Customers'
									onClick={() => window.location.hash = '/customers'}
								  />
								 &nbsp;
								<Chip
									avatar={<Avatar>d</Avatar>}
									label='Deals'
									onClick={() => window.location.hash = '/deals'}
								  />
								<Button className='repeater-button'><h5><i className='fa' />&nbsp;</h5></Button>
							</div>
						</h4>
					</Col>
				</Row>
				<Row>
					<Col>
						<div>
							<DxGrid
								rows={customerRows}
								columns={customerColumns}>
								<ColumnOrderState defaultOrder={customerColumns.map(column => column.name)} />
								
								<FilteringState
								  defaultFilters={[]}
								/>
								<SortingState
								  defaultSorting={[
									{ columnName: 'name', direction: 'asc' },
									{ columnName: 'city', direction: 'asc' },
								  ]}
								/>
								<GroupingState
								  defaultGrouping={[]}
								  defaultExpandedGroups={[]}
								/>
								<PagingState
								  defaultCurrentPage={0}
								  defaultPageSize={10}
								/>
								<LocalFiltering />
								<LocalSorting />
								<LocalGrouping />
								<LocalPaging />
								<SelectionState
								  defaultSelection={[]}
								/>
								<DxRowDetailState
									expandedRows={expandedCustomerRows}
									onExpandedRowsChange={this.changeCustomerDetails} />
								<DxTableView 
									tableCellTemplate={({ row, column, style }) => {
										if (column.name === 'complete') {
											return (
												<ProgressBarCell value={row.complete * 100} style={style} />
											)
										} else if (column.name === '{{highlighted}}') {
											return (
												<HighlightedCell align={column.align} value={row.amount} style={style} />
											)
										} else if (column.name === 'lenders') {
											return (
												<div style={{
													display: 'flex',
													justifyContent: 'flex-start'
												}}>
													<div style={{
														display: 'flex',
														flexDirection: 'column'
													}}>
														<Button style={{
															backgroundColor: 'green',
															color: 'white'
														}}>AP</Button>
														<select>
															<option>TD</option>
														</select>
													</div>
													<div style={{
														display: 'flex',
														flexDirection: 'column'
													}}>
														<Button style={{
															backgroundColor: 'yellow',
															color: 'white'
														}}>CA</Button>
														<select>
															<option>RBC</option>
														</select>
													</div>
													<div style={{
														display: 'flex',
														flexDirection: 'column'
													}}>
														<Button style={{
															backgroundColor: 'purple',
															color: 'white'
														}}>DR</Button>
														<select>
															<option>Serv</option>
														</select>
													</div>
													<div style={{
														display: 'flex',
														flexDirection: 'column'
													}}>
														<Button style={{
															backgroundColor: 'red',
															color: 'white'
														}}>DE</Button>
														<select>
															<option>SDA</option>
														</select>
													</div>
												</div>
											)
										} else {
											return undefined
										}
									}}
									/>
								<DxTableHeaderRow allowSorting />
								<TableFilterRow rowHeight={80} />
								<DxTableRowDetail template={this.rowTemplate} />
								<EditingState onCommitChanges={() => { return }} />
								<TableEditRow />
								<TableEditColumn
									allowAdding
									allowEditing
									commandTemplate={({ executeCommand, id }) => {
									  const template = customerCommands[id]
									  if (template) {
										const allowAdding = true
										const onClick = (e) => {
										  executeCommand()
										  e.stopPropagation()
										}
										return template(
										  onClick,
										  allowAdding,
										)
									  }
									  
									  return undefined
									}}
								/>
								<PagingPanel allowedPageSizes={allowedPageSizes} />
								<TableSelection
									selectByRowClick
									highlightSelected
									showSelectionColumn={false} />
								<TableGroupRow />
								<GroupingPanel allowSorting />
							</DxGrid>
						</div>
					</Col>
				</Row>
            </div>
        )
    }
})