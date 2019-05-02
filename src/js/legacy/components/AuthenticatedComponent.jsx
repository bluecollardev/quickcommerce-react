import assign from 'object-assign'

import React, { Component } from 'react'
import {inject, observer, Provider} from 'mobx-react'

export default (ComposedComponent) => {
    @inject(deps => ({
        actions: deps.actions,
        authService: deps.authService,
        customerService: deps.customerService,
        loginStore: deps.loginStore,
        userStore: deps.userStore
    }))
    @observer
    // Wrapping this class is causing issues
    class AuthenticatedComponent extends Component {
        static willTransitionTo(transition) {
            if (!this.props.loginStore.isLoggedIn()) {
                //transition.redirect('/login', {}, {'nextPath' : transition.path})
            }
        }

        constructor(props) {
            super(props)
            
            this.state = assign({},
                this.getLoginState(),
                this.getUserState()
            )
        }

        getLoginState() {
            return {
                loggedIn: this.props.loginStore.isLoggedIn(),
                userToken: this.props.loginStore.userToken,
                user: this.props.loginStore.user
            }
        }
        
        getUserState() {
            return {
                loggedIn: this.props.loginStore.isLoggedIn(),
                userToken: this.props.loginStore.userToken,
                user: this.props.userStore.user
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
            this.props.loginStore.addChangeListener(this.changeListener)
            this.props.userStore.addChangeListener(this.changeListener)
        }
        
        componentWillUnmount() {
            if (typeof this.changeListener === 'function') {
                this.props.loginStore.removeChangeListener(this.changeListener)
                this.props.userStore.removeChangeListener(this.changeListener)
                
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
    
    return AuthenticatedComponent
}