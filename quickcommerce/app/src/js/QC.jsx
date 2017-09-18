/**
 * The actual QuickCommerce app
 */

import { DragDropContext } from 'react-dnd'
import { HashRouter, Switch, Route } from 'react-router-dom';
import HTML5Backend        from 'react-dnd-html5-backend'

import { Alert, Table, Grid, Col, Row, Thumbnail, Modal, Accordion, Panel, HelpBlock } from 'react-bootstrap'
import { Tabs, Tab, TabContent, TabContainer, TabPanes } from 'react-bootstrap'
//import { Nav, Navbar, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
//import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { Button, Checkbox, Radio } from 'react-bootstrap'

import { bubble as MainMenu, fallDown as CustomerMenu } from 'react-burger-menu'

import AuthenticatedApp from './components/AuthenticatedApp.jsx'

import TopMenu from './components/menu/TopMenu.jsx'
import AccountMenu from './components/menu/AccountMenu.jsx'

import PosPage from './pages/PosPage'
import SettingPage from './pages/SettingPage'
import HomePage from './pages/HomePage'
import AccountPage from './pages/AccountPage'
import ProductPage from './pages/ProductPage'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import ContentBlog from './pages/ContentBlog'
import ContentArticle from './pages/ContentArticle'

import LoginActions from './actions/LoginActions.jsx'
import UserActions from './actions/UserActions.jsx'

import Auth from './services/AuthService.jsx'
import CustomerService from './services/CustomerService.jsx'

console.log('QC API endpoint: ' + QC_API)

try {
    // TODO: Expire!
    let userToken = sessionStorage.getItem('userToken') || false
    if (userToken === false) {
        // This is triggered on the first page load, we don't know if the user is logged in or not
        Auth.getToken() // Fetch a token and store it for future requests
    } else {
        // Attempt to fetch the account, if the user is logged in we'll store it
        Auth.fetchAccount()
    }

} catch (err) {
    console.log(err)
}


class QC extends AuthenticatedApp {
    constructor(props) {
        super(props)
		
		this.onHashChange = this.onHashChange.bind(this)
		//this.toggleSearch = this.toggleSearch.bind(this)
    }

    componentWillMount() {
		window.addEventListener('hashchange', this.onHashChange)
		this.onHashChange()
	}
	
	componentWillUnmount() {
		window.removeEventListener('hashchange', this.onHashChange)
	}
	
	onHashChange() {
		// Force login
		if (!this.state.loggedIn) {
			window.location.hash = '/account/login'
		}

	}

    render() {
        return (
            <AuthenticatedApp>
                <div id='outer-container'>
                    <main id='page-wrap'>
                        <Col xs={12}>
                            <HashRouter>
                                <div className='react-app-wrapper'>
                                    <Route path='/' component={PosPage}/>
                                    
                                    <Switch>
                                        <Route path='/account/login' component={AccountPage}/>
                                        <Route path='/account/edit' component={AccountPage}/>
                                        <Route path='/account/edit' component={AccountPage}/>
                                        <Route exact path='/settings' component={SettingPage}/>
                                    </Switch>
                                </div>
                            </HashRouter>
                        </Col>
                    </main>
                </div>
            </AuthenticatedApp>
        )
    }
}

QC.defaultProps = {
    // Customize config settings
    baseUrl: '', //App.getRootWebsitePath(true),
    //serviceUrl: 'http://sd-otb.vest.technology/',
    serviceUrl: QC_BASE_URI,
    //serviceUrl: 'http://php5519.deathstar/quickcommerce/',
    //systemUrl: baseUrl + 'vendor/kpaged/core/', // Don't forget the trailing slash!
    //libUrl: baseUrl + 'vendor/kpaged/lib/', // Don't forget the trailing slash!
    //appUrl: baseUrl + 'app/',
    //templateUrl: appUrl + 'templates/',
    //moduleUrl: appUrl + 'modules/',
    //blockUrl: appUrl + 'vendor/kpaged/blocks/',
    debug: false, // Enable debugging
    customer: null, //{ blocks: false, modules: false, pages: true }; // Enable profiling
    profile: false //{ blocks: false, modules: false, pages: true }; // Enable profiling
}

module.exports = DragDropContext(HTML5Backend)(QC)
