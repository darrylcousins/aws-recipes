/**
 * @file Provides root of the App
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

// Global amplify configure!!
import Amplify from "aws-amplify"
import aws_config from "./aws-exports"
import { SignIn } from 'aws-amplify-react'
import { Authenticator } from "aws-amplify-react"

import App from './App'
import { CustomSignIn } from './Auth'
import './index.css'

Amplify.configure(aws_config)

// theme failed
const Theme = {
  SignInButton: { 'backgroundColor': 'blue' }
}

class AppWithAuth extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = { authState: null }
    this.handleAuthStateChange = this.handleAuthStateChange.bind(this)
  }


  handleAuthStateChange(state) {
    this.setState({ authState: state })
    console.log("in index.js", state)
  }

  render() {
    return (
    <Fragment>
      <Authenticator
        onStateChange={ this.handleAuthStateChange }
        theme={ Theme }
      >
        <App authState={ this.state.authState } />
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
