/**
 * @file Provides root of the App
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

// Global amplify configure!!
import Amplify, { Auth } from "aws-amplify"
import aws_config from "./aws-exports"
import { Authenticator, SignUp } from "aws-amplify-react"

import App from './App'
import './index.css'

Amplify.configure(aws_config)

class AppWithAuth extends React.Component {

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

ReactDOM.render(<AppWithAuth />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
