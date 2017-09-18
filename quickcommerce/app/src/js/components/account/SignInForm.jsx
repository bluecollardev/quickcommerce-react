import axios from 'axios'

import React, { Component } from 'react'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import Auth from '../../services/AuthService.jsx'
import AuthenticatedComponent from '../AuthenticatedComponent.jsx'
import FormComponent from '../FormComponent.jsx'

import CheckoutStore from '../../stores/CheckoutStore.jsx'

export default AuthenticatedComponent(FormComponent(class SignInForm extends Component {
    constructor(props) {
        super(props)
        
        this.onSubmit = this.onSubmit.bind(this)
        this.onCreate = this.onCreate.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
        this.onError = this.onError.bind(this)
        
        this.toggleRemember = this.toggleRemember.bind(this)
        this.forgetAccount = this.forgetAccount.bind(this)
        this.rememberAccount = this.rememberAccount.bind(this)
        
        this.onLogout = this.onLogout.bind(this)
        this.doLogin = this.doLogin.bind(this)
        this.doLogout = this.doLogout.bind(this)
        
        this.renderErrors = this.renderErrors.bind(this)
        
        this.getDisplayName = this.getDisplayName.bind(this)
        this.getFullName = this.getFullName.bind(this)
        
        let account = ''
        let password = ''
        let remember = 0
        
        if (typeof localStorage.getItem('remember') === 'string' && 
            typeof localStorage.getItem('account') === 'string') {
            account = localStorage.getItem('account')
            password = localStorage.getItem('password')
            remember = Number(localStorage.getItem('remember'))
        }
        
        this.state = {
            remember: remember,
            displayName: '',
            fullName: '',
            account: account,
            password: password,
            errors: {}
        }
    }
    
    componentDidMount() {
        if (this.props.loggedIn) {
            let state = {}
            
            if (typeof this.props.user !== 'undefined' && 
                this.props.user !== null) {
                state = this.props.user
                state.fullName = this.getFullName(this.props.user) 
                state.displayName = this.getDisplayName(this.props.user)
            }
            
            this.setState(state)
        }
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevProps !== this.props) {
            if (this.props.loggedIn) {
                let state = {}
                
                if (typeof this.props.user !== 'undefined' && 
                    this.props.user !== null) {
                    state = this.props.user
                    state.fullName = this.getFullName(this.props.user) 
                    state.displayName = this.getDisplayName(this.props.user)
                }
                
                this.setState(state)
            }
        }
    }
    
    getDisplayName(account) {
        if (typeof account !== 'undefined' && account !== null) {
            return account['display_name']
        }
        
        return ''
    }
    
    getFullName(account) {
        if (typeof account !== 'undefined' && account !== null) {
            return [account['firstname'], account['middlename'], account['lastname']].join(' ')
        }
        
        return ''
    }
    
    toggleRemember() {
        this.setState({
            remember: !this.state.remember
        })
    }
    
    rememberAccount(formData) {
        localStorage.setItem('remember', 1)
        localStorage.setItem('account', formData['account'])
        localStorage.setItem('password', formData['password']) // TODO: Use a hash...
    }
    
    forgetAccount() {
        localStorage.removeItem('remember')
        localStorage.removeItem('account')
        localStorage.removeItem('password')
    }
    
    /*startLogoutTimer() {
        var that = this,
            page = that.getPage(),
            moduleElement = $('#' + that.getId()),
            viewModel = that.getViewModel(),
            loginButton = moduleElement.find('[name=loginButton]').first();
            
        that.dataBind();
        
        //kendo.bind(loginPopup, viewModel); // TODO: Where is this login popup?
        
        viewModel.set('email', '');
        viewModel.set('password', '');
        
        // TODO: This needs to be unit tested -- test these
        //that.doLoginCheck();
        
        moduleElement.find('.loginTrigger').bind('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Window widgets append themselves by default to 
            // <body>, even if the appendTo parameter has been
            // specified - Kendo FAIL
            kendo.unbind(loginPopup);
            kendo.bind(loginPopup, viewModel);
        });
        
        // IDK why we would have more than one but leave in the first anyway...
        
        // TODO: Check this, we don't wanna duplicate functionality
        if (loginButton.length > 0) {
            loginButton.data('kendoButton').bind('click', function (e) {
                var loginPopup = $(document.body).find('[name=loginPopup]').first(), //moduleElement.find('#loginPopup'),
                    loginWindow = loginPopup.data('kendoWindow');
                
                that.doLogin();
                loginWindow.close();
            });
        }
        
        // TODO: Implement a page.hasModule?
        // NOTE: Also, activityMonitor should be a plugin, not a module, as it has no layout (plugins haven't been implemented yet in kPaged framework)
        if (!page.hasOwnProperty('getActivityMonitor') || typeof page.getActivityMonitor !== 'function') {
            var registeredModules = App.getConfig('modules');
            if (registeredModules.has('activityMonitor')) {
                // Module will self-register itself to the page/target (should be a requirement of plugins)
                App.Page.Layout.Module(App.getCurrent(), App.getConfig('modules').get('activityMonitor'));
            }
        }
        
        // NOTE: Optional coupling - I'd like to take the logic and split it out into their own methods... later though
        if (page.hasOwnProperty('getActivityMonitor') && typeof page.getActivityMonitor === 'function') {
            var autoLogoutPopup = $(document.body).find('[name=autoLogoutPopup]').first(),
                autoLogoutWindow = autoLogoutPopup.data('kendoWindow'),
                monitor = page.getActivityMonitor();
                
            // TODO: Add values to config
            monitor.setIdleTimeout(10000); // Set to 1 min
            monitor.setAwayTimeout(20000); // Set to 15 mins
            
            autoLogoutWindow.bind('open', function (e) {
                var startInt = 15;
                var msg = $('.timeoutMessage');
                msg.html(msg.html().replace(/%{logoutIn}/, '<span class="textTimer">' + startInt + '</span>'));
                
                // TODO: Add timers property for arbitrary intervals/timeouts on activityMonitor?
                var timer = $('.textTimer');
                monitor.countdownTimer = setInterval(function () {
                    startInt--;
                    timer.text(startInt.toString());
                    if (startInt === 0) {
                        clearInterval(monitor.countdownTimer);
                    }
                }, 1000);
                
                monitor.logoutTimer = setTimeout(function () {
                    that.doLogout();
                    autoLogoutWindow.close();
                }, 15000);
            });
            
            var continueButton = autoLogoutPopup.find('[name=continueButton]').first().data('kendoButton'),
                logoutButton = autoLogoutPopup.find('[name=logoutButton]').first().data('kendoButton');
            
            continueButton.bind('click', function () {
                clearInterval(monitor.countdownTimer);
                clearTimeout(monitor.logoutTimer);
                
                autoLogoutWindow.close();
            });
            
            logoutButton.bind('click', function () {
                clearInterval(monitor.countdownTimer);
                clearTimeout(monitor.logoutTimer);
                
                that.doLogout();
                autoLogoutWindow.close();
            });
            
            // TODO: As noted in module (plugin!), let's use the event handler
            document.onIdle = function () {
                console.log('on idle');
            };
            
            document.onAway = function () {
                var handler = (page.hasOwnProperty('getAuthHandler')) ? page.getAuthHandler() : null,
                    isLogged = false;
                    
                if (typeof handler !== 'undefined' && handler !== null) {
                    isLogged = (handler.doLoginCheck() !== false) ? true : isLogged;
                }
                
                console.log('on away');
                
                if (isLogged) autoLogoutWindow.center().open();
            };
            
            document.onBack = function () {
                console.log('on back');
            };
            
            // Trigger event binding manually - document is not yet available on initialized event
            // TODO: This shouldn't be necessary once I implement a proper kPaged plugin system
            monitor.initJQuery();
        }
        
        page.setAuthHandler(that);
        that.getSession();
        // TODO: Check auth -- not sure what's best; in the page, embedded in the module?
        //loginWindow.center().open();
    }*/
    
    doLogin() {
        this.props.triggerAction((formData) => {
            Auth.login(
                formData['account'], 
                formData['password'], 
                this.onSuccess, 
                this.onError
            ).catch(function(err) {
                console.log('Error logging in', err)
            })
            
            if (this.state.remember) {
                this.rememberAccount(formData)
            } else {
                this.forgetAccount()
            }
        })
	}
    
	doLogout() {
        try {
            Auth.logout()
        } catch (err) {
            console.log('Error logging out', err)
        }
        
        window.location.hash = '/account/login' // TODO: Use history
    }
    
    onSubmit(e) {
        e.preventDefault()
        e.stopPropagation()
        
        //if (typeof this.props.onSubmit === 'undefined') return false;
        
        // Should I change the name of callback to beforeSubmit?
        console.log('executing onSubmit callback')
        if (typeof this.props.onSubmit === 'function') {
            console.log('execute handler')
            var fn = this.props.onSubmit
            fn.call(this, e)
        }
        
        this.doLogin()
    }
    
    onCreate(e) {
        e.preventDefault()
        e.stopPropagation()
        
        if (typeof this.props.onCreate === 'undefined') return false;
        
        console.log('executing onCreate callback')
        if (typeof this.props.onCreate === 'function') {
            var fn = this.props.onCreate
            fn.call(this, e)
        }
    }
    
    onLogout(e) {
        e.preventDefault()
        e.stopPropagation()
        
        //if (typeof this.props.onLogout === 'undefined') return false;
        
        // Should I change the name of callback to beforeLogout?
        console.log('executing onLogout callback')
        if (typeof this.props.onLogout === 'function') {
            console.log('execute handler')
            var fn = this.props.onLogout
            fn.call(this, e)
        }
        
        this.doLogout()
    }
    
    onSuccess(response) {
        console.log('executing onLoginSuccess')
        if (typeof this.props.onLoginSuccess === 'function') {
            console.log('execute handler')
            var fn = this.props.onLoginSuccess
            fn.call(this, response)
        }
    }
    
    onError(response) {
        console.log('executing onError')
        if (typeof this.props.onError === 'function') {
            console.log('execute handler')
            var fn = this.props.onError
            fn.call(this, response)
        }
        
        this.setState({
            errors: response.error
        })
    }
    
    renderErrors() {
        let errors = []
        let count = Object.keys(this.state.errors).length
        let idx = 1
        
        if (typeof this.state.errors !== 'string' && count > 0) {
            for (let error in this.state.errors) {
                errors.push(<strong>{this.state.errors[error]}</strong>)
                if (idx < count) {
                    errors.push(<br/>)
                }
                
                idx++
            }
        } else if (typeof this.state.errors === 'string') {
            errors.push(<strong>{this.state.errors}</strong>)
        }
        
        return errors
    }
    
    render() {
        if (this.props.loggedIn) {
            return (
                <div className='account-welcome'>
                    <h3 style={{textAlign: 'center', whiteSpace: 'nowrap'}}>{/*<i className='fa fa-user'></i>&nbsp;*/}
                    Welcome, <span style={{ fontWeight: 'bold' }}>{this.state.fullName}</span>!
                    </h3>
                    {this.props.displayActions && (
                    <a style={{
                        float: 'right',
                        marginTop: '1rem',
                        fontSize: '1.3rem'
                    }}
                    onClick={this.onLogout}>Sign Out</a>
                    )}
                </div>
            )
        } else {
            return (
                <div className='signin-form'>
                    {Object.keys(this.state.errors).length > 0 && (
                    <Alert bsStyle='danger' style={{
                        textAlign: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        {this.renderErrors()}
                    </Alert>
                    )}
                    <form>
                        <FormGroup className='display-block'>
                            <ControlLabel>Username (E-mail Address)</ControlLabel>
                            <FormControl name='account' type='text' {...this.props.fields('account', this.state.account)} />
                        </FormGroup>
                        
                        <FormGroup className='display-block'>
                            <ControlLabel>Password</ControlLabel>
                            <FormControl type='password' {...this.props.fields('password', this.state.password)} />
                        </FormGroup>
                        
                        <FormGroup className='display-block'>
                            {this.props.displayActions && (
                            <Button block onClick={this.onCreate}>
                                <h4><i className='fa fa-user-plus' /> Create Account</h4>
                            </Button>
                            )}
                            <Button block bsStyle='success' onClick={this.onSubmit}>
                                <h4><i className='fa fa-sign-in' /> Sign In</h4>
                            </Button>
                        </FormGroup>
                        <FormGroup style={{ display: 'flex', alignItems: 'center' }}>
                            <FormControl onClick={this.toggleRemember} style={{ display: 'inline-block', width: '24px', marginRight: '1rem' }} type='checkbox' checked={this.state.remember} />
                            <ControlLabel style={{ display: 'inline-block', paddingTop: '0.35rem' }}>Remember Me</ControlLabel>
                        </FormGroup>
                    </form>
                </div>
            )
        }
    }   
}))