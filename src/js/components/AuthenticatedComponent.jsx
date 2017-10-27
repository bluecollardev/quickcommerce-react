import assign from 'object-assign'

import React, { Component } from 'react'

import LoginStore from '../stores/LoginStore.jsx'
import UserStore from '../stores/UserStore.jsx'

// TODO: Split out customers, add logic to another HoC
export default (ComposedComponent) => {
    return class AuthenticatedComponent extends Component {
        static willTransitionTo(transition) {
            if (!LoginStore.isLoggedIn()) {
                //transition.redirect('/login', {}, {'nextPath' : transition.path})
            }
        }

        constructor(props) {
            super(props)
            
            this.state = assign({},
                this.getLoginState(),
                this.getUserState())
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
                userToken: LoginStore.userToken,
                loggedIn: LoginStore.isLoggedIn(),
                user: UserStore.user
            }
        }
        
        onChange() {
			this.setState(
                assign({},
                    this.getLoginState(),
                    this.getUserState())
            )
        }

        componentDidMount() {
            this.changeListener = this.onChange.bind(this)
            LoginStore.addChangeListener(this.changeListener)
            UserStore.addChangeListener(this.changeListener)
        }
        
        componentWillUnmount() {
            if (typeof this.changeListener === 'function') {
                LoginStore.removeChangeListener(this.changeListener)
                UserStore.removeChangeListener(this.changeListener)
                
                delete this.changeListener
            }
        }

        render() {			
			return (
                <ComposedComponent
                    {...this.props}
                    user = {this.state.user}
                    userToken = {this.state.userToken}
                    loggedIn = {this.state.loggedIn} />
            )
        }
    }
}