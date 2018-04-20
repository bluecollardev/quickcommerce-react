import AccountCircleIcon from 'material-ui-icons/AccountCircle'

import Avatar from 'material-ui/Avatar'
import { ListItem, ListItemText } from 'material-ui/List'
import React, { Component } from 'react'

import { TabPanes } from 'react-bootstrap'

/*@inject(deps => ({
 actions: deps.actions,
 authService: deps.authService
 }))
 @observer*/
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
    return (
      <div>
        <ListItem button>
          {!!this.props.loggedIn && (
            <Avatar>
              <AccountCircleIcon/>
            </Avatar>
          )}

          {!this.props.loggedIn && (<Avatar src='https://i.pinimg.com/736x/61/6e/c3/616ec3042d9fd9525f118c222c783802---actors-james-bond-actors.jpg'/>)}

          {!!this.props.loggedIn && (
            <ListItemText
              secondary={<span><a href='#/account/login' onClick={this.showSignInForm}>Sign In</a></span>}
            />
          )}

          {!!this.props.loggedIn && (
            <ListItemText
              secondary={<span><a href='#/account/register' onClick={this.showRegistrationForm}>New Account</a></span>}
            />
          )}

          {!this.props.loggedIn && (
            <ListItemText
              primary={<span><a href='#/account/edit'>John Smith</a></span>}
              secondary={<span><a href='#/account/logout' onClick={this.doLogout}>Sign Out</a></span>}
            />
          )}
        </ListItem>
      </div>
    )
  }
}

export default ProfileMenu
export { ProfileMenu }
