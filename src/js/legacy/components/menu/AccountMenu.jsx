import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import AuthenticatedComponent from '../AuthenticatedComponent.jsx'

@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService
}))
@observer
class AccountMenu extends Component {
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
                <div className='row actionButtons'>
                    <ul>
                        {/*<li tabIndex='3'><a href='#/account/edit' className='btn no-bs-style' id='account-button'><i className='fa fa-user'></i><br />
                        </a></li>*/}
                        <li tabIndex='4'><a href='#/settings' className='btn no-bs-style'><i className='fa fa-fw fa-gear' /><br />
                        </a></li>
                        <li tabIndex='5'><a href='#/account/logout' className='btn no-bs-style' id='logout-button' onClick={this.doLogout}><i className='fa fa-sign-out'></i><br />
                        </a></li>
                        <li tabIndex='6'><a href='#/' className='btn no-bs-style' id='orders-button'><i className='fa fa-clipboard'></i><br />
                        </a></li>
                    </ul>
                </div>
            )
        } else {
            return (
                <div className='row actionButtons'>
                    <ul>
                        <li tabIndex='3'><a href='#/' className='btn no-bs-style'><i className='fa fa-fw fa-gear' /><br />
                        </a></li>
                        <li tabIndex='4'><a href='#/account/login' className='btn no-bs-style' id='login-button'><i className='fa fa-sign-in'></i><br />
                        </a></li>
                        {/*<li tabIndex='4'><a href='#/account/register' className='btn no-bs-style' id='account-button'><i className='fa fa-user'></i><br />
                        </a></li>*/}
                        <li tabIndex='6'><a href='#/' className='btn no-bs-style' id='orders-button'><i className='fa fa-clipboard'></i><br />
                        </a></li>
                    </ul>
                </div>
            )
        }
    }   
}

export default AuthenticatedComponent(AccountMenu)
export { AccountMenu }