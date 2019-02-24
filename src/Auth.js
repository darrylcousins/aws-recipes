/**
 * @file Provides the `Authentication` components
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import { Authenticator, SignUp } from "aws-amplify-react"
import { Auth } from "aws-amplify"

import App from './App'

export class AppWithAuth extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      authenticatedUser: "guest"
    }
    this.authenticatedUserValidStates = [
      "guest",
      "authenticating",
      "authenticated"
    ]
    this.handleAuthStateChange = this.handleAuthStateChange.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
  }

  handleAuthStateChange(state) {
    switch (state) {
      case "signedIn":
        this.setState({ authState: state, authenticatedUser: "authenticated" })
        break
      default:
        this.setState({ authState: state, authenticatedUser: "guest" })
    }
  }

  handleAuthentication(action) {
    if (action === "login") {
      this.setState({
        authenticatedUser: "authenticating"
      })
    } else if (action === "logout") {
      // log out the user
      Auth.signOut()
    }
  }

  render() {
    const { authenticatedUser } = this.state
    let hideDefault = false
    if (authenticatedUser === "guest" || authenticatedUser === "authenticated") {
      hideDefault = true
    }
    return (
      <Fragment>
        <Authenticator
          authState="signIn"
          hideDefault={ hideDefault }
          hide={ [SignUp] }
          onStateChange={ this.handleAuthStateChange }
        >
          <App
            handleAuthentication={ this.handleAuthentication }
          />
        </Authenticator>
      </Fragment>
    )
  }
}
