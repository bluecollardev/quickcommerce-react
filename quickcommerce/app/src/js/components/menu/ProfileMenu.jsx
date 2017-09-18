import axios from 'axios'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';

import Auth from '../../services/AuthService.jsx'
import AuthenticatedComponent from '../AuthenticatedComponent.jsx'

export default AuthenticatedComponent(class AccountMenu extends Component {
    constructor(props) {
        super(props)
        
        this.doLogout = this.doLogout.bind(this)
    }
    
    componentDidMount() {
        if (this.props.loggedIn) {
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
        }
    }
    
    doLogout(e) {
        e.preventDefault()
        e.stopPropagation()
        
        try {
            Auth.logout()
        } catch (err) {
            console.log('Error logging out', err)
        }
        
        window.location.hash = '/account/login' // TODO: Use history
    }
    
    render() {
        if (this.props.loggedIn) {
            return (
				<div className='logo'>
					<ListItem
						primaryText = {<div><a href='#/account/edit'>James Bond</a></div>}
						secondaryText = {<div><a href='#/account/logout' onClick={this.doLogout}>Sign Out</a></div>}
						leftAvatar={<Avatar src='https://i.pinimg.com/736x/61/6e/c3/616ec3042d9fd9525f118c222c783802---actors-james-bond-actors.jpg' />}
						/>
				</div>
            )
        } else {
            return null
        }
    }   
})