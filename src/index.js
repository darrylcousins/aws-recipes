/**
 * @file Provides root of the App
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

// Global amplify configure!!
import Amplify from "aws-amplify"
import aws_config from "./aws-exports"

import { AppWithAuth } from './Auth'

import 'react-toastify/dist/ReactToastify.min.css'
import 'semantic-ui-css/semantic.min.css'

Amplify.configure(aws_config)

ReactDOM.render(<AppWithAuth />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
