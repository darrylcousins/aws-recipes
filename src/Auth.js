/**
 * @file Provides the `Authentication` components
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import {
  Button,
  Form,
  Icon
} from 'semantic-ui-react'
import { SignIn } from 'aws-amplify-react'

export class CustomSignIn extends SignIn {
  constructor(props) {
    super(props);
    this._validAuthStates = ["signIn", "signedOut", "signedUp"];
  }

  render() {
    return (
      <Form>
        <Form.Input
          required
          label="Username"
          name="username"
          id="username"
          placeholder="Username"
          type="text"
          onChange={ this.handleInputChange }
        />
        <Form.Input
          required
          label="Password"
          name="password"
          id="password"
          placeholder="********"
          type="password"
          onChange={ this.handleInputChange }
        />
        <Button
          onClick={ () => super.SignIn() }
          color='blue'>
          <Icon name='checkmark' /> Login
        </Button>
        <Button
          onClick={ () => super.changeState("forgotPassword") }
          color='blue'>
          <Icon name='checkmark' /> Reset Password
        </Button>
        <Button
          onClick={ () => super.changeState("signUp") }
          color='blue'>
          <Icon name='checkmark' /> Create Account
        </Button>
      </Form>
    )
  }
}
