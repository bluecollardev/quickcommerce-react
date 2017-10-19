import assign from 'object-assign'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'
import { Jumbotron } from 'react-bootstrap'

// Higher order component adds Auth functions
import AuthenticatedComponent from './AuthenticatedComponent.jsx'
import AccountComponent from './AccountComponent.jsx'

export default AuthenticatedComponent(class AuthenticatedAccountComponent extends Component {
    render() {
		return (
			<AccountComponent 
				...this.props />
		)
	}
})