import React, { Component } from 'react'

import LoginStore from '../stores/LoginStore.jsx'
import AuthService from '../services/AuthService.jsx'

export default class AuthenticatedApp extends Component {
        constructor(props) {
        super(props)

        this.state = this.getLoginState()
    }

    getLoginState() {
        return {
            loggedIn: LoginStore.isLoggedIn()
        }
    }

    componentDidMount() {
        this.changeListener = this.onChange.bind(this)
        LoginStore.addChangeListener(this.changeListener)
    }

    onChange() {
        this.setState(this.getLoginState())
    }

    componentWillUnmount() {
        LoginStore.removeChangeListener(this.changeListener)
    }

    render() {
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

    logout(e) {
        e.preventDefault()
        AuthService.logout()
    }

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
