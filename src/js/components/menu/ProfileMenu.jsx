import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Avatar from 'material-ui/Avatar'
import List, { ListItem, ListItemText } from 'material-ui/List'

import AuthenticatedComponent from '../AuthenticatedComponent.jsx'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService
}))
@observer
class ProfileMenu extends Component {
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
            this.props.authService.logout()
        } catch (err) {
            console.log('Error logging out', err)
        }
        
        window.location.hash = '/account/login' // TODO: Use history
    }
    
    render() {
        if (this.props.loggedIn) {
            return (
				<div className='logo'>
					<ListItem button>
						<Avatar src='https://i.pinimg.com/736x/61/6e/c3/616ec3042d9fd9525f118c222c783802---actors-james-bond-actors.jpg' />
						<ListItemText
							primary = {<div><a href='#/account/edit'>James Bond</a></div>}
							secondary = {<div><a href='#/account/logout' onClick={this.doLogout}>Sign Out</a></div>} />
					</ListItem>
				</div>
            )
        } else {
            return null
        }
    }   
}

export default AuthenticatedComponent(ProfileMenu)
export { ProfileMenu }