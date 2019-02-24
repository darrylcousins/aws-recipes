/**
 * @file Provides `Auth` fragments
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export class AuthButton extends React.Component {

  render() {
    const {
      handleAuthentication,
      authState,
      activeItem,
      username
    } = this.props
    let action = "login"

    if (authState === "signedIn") {
      action = "logout"
      return (
        <Menu.Item
          name="logout"
          active={ activeItem === "logout" }
          onClick={ () => handleAuthentication(action) }>
          <Icon name="sign-out" />Logout { username }
        </Menu.Item>
      )
    }
    return (
      <Menu.Item
        name="login"
        active={ activeItem === "login" }
        onClick={ () => handleAuthentication(action) }>
        <Icon name="sign-in" />Login
      </Menu.Item>
    )
  }
}
