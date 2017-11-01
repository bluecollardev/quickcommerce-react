import React, { Component } from 'react'

class AuthenticatedApp extends Component {
    constructor(props) {
        super(props)

        this.state = this.getLoginState()
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

    componentDidMount() {
        this.changeListener = this.onChange.bind(this)
        this.props.loginStore.addChangeListener(this.changeListener)
    }

    onChange() {
        // onChange handler for AuthenticatedApp
        this.setState(this.getLoginState())
    }

    componentWillUnmount() {
        this.props.loginStore.removeChangeListener(this.changeListener)
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
        this.props.authService.logout()
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

export default AuthenticatedApp