import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

/**
 * An application container that injects a minimum set of services etc into 
 * React's context so they can be shared freely with nested components. 
 * All QC apps should generally be wrapped in this HoC.
 * @prop dispatcher required
 * @prop actions required authActions settingActions
 * @prop services required authService settingService
 * @prop stores required
 * @prop maggings optional
 * @prop i8ln optional
 */
 
/**
 * App dependencies passed in via Mobx's Provider HoC are injected into our component as props using a wrapper (Mobx injector HoC).
 */
@inject(deps => ({
    actions: deps.actions,
    authService: deps.authService,
    settingService: deps.authService,
    loginStore: deps.loginStore,
    settingStore: deps.settingStore,
    mappings: deps.mappings, // Per component or global scope?
    translations: deps.translations, // i8ln transations
    roles: deps.roles, // App level roles, general authenticated user (not customer!)
    userRoles: deps.userRoles, // Shortcut or implement via HoC?
    user: deps.user, // Shortcut or implement via HoC?
}))
class AuthenticatedApp extends Component {
    constructor(props) {
        super(props)

        this.changeListener = this.onChange.bind(this)
        
        this.state = this.getLoginState()
    }
    
    hasScrollbar() {
        if (typeof window.innerWidth === 'number') {
            return window.innerWidth > document.documentElement.clientWidth
        }

        let rootElem = document.documentElement || document.body
        
        let overflowStyle
        if (typeof rootElem.currentStyle !== 'undefined') {
            overflowStyle = rootElem.currentStyle.overflow
        }

        overflowStyle = overflowStyle || window.getComputedStyle(rootElem, '').overflow

        let overflowYStyle
        if (typeof rootElem.currentStyle !== 'undefined') {
            overflowYStyle = rootElem.currentStyle.overflowY
        }

        overflowYStyle = overflowYStyle || window.getComputedStyle(rootElem, '').overflowY

        let contentOverflows = rootElem.scrollHeight > rootElem.clientHeight
        let overflowShown    = /^(visible|auto)$/.test(overflowStyle) || /^(visible|auto)$/.test(overflowYStyle)
        let alwaysShowScroll = overflowStyle === 'scroll' || overflowYStyle === 'scroll'

        return (contentOverflows && overflowShown) || (alwaysShowScroll)
    }

    componentDidMount() {
        this.props.settingStore.addChangeListener(this.changeListener)
        this.props.loginStore.addChangeListener(this.changeListener)
    }

    componentWillUnmount() {
        this.props.settingStore.removeChangeListener(this.changeListener)
        this.props.loginStore.removeChangeListener(this.changeListener)
    }
    
    onChange() {
        // onChange handler for AuthenticatedApp
        this.setState(this.getLoginState())
    }
    
    getLoginState() {
        let loggedIn = false
        let loginStore = this.props.loginStore || null
        
        if (loginStore !== null && loginStore.isLoggedIn()) {
            loggedIn = loginStore.isLoggedIn()
        }
        
        return {
            loggedIn: loggedIn
        }
    }

    render() {
        // AuthenticatedApp render
        return (
            <div className='app-container'>
                {/*<nav className='navbar navbar-default'>
                    <div className='navbar-header'>
                        <a className='navbar-brand' href='/'>React Flux app with JWT authentication</a>
                    </div>
                    {this.headerItems}
                </nav>*/}
                {this.props.children}
            </div>
        )
    }
    
    // Just a shortcut
    logout(e) {
        e.preventDefault()
        this.props.authService.logout()
    }

    // Not used, just for confirmation when I was building the auth components, I will strip this out later
    get headerItems() {
        if (!this.state.loggedIn) {
            return (
                <pre>Not Logged</pre>
            )
        } else {
            return (
                <pre>Logged</pre>
            )
        }
    }
}

export default AuthenticatedApp