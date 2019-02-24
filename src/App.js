/**
 * @file Provides the `App`
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import UUID from 'uuid'
import { ToastContainer } from 'react-toastify'

import { Auth } from "aws-amplify"

import { HeaderMenu } from './components/menu'
import { RecipeListLoader } from './components/list'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "guest",
      searchTerm: "",
      listKey: UUID.v4()
    }
  }

  componentDidMount() {
    Auth.currentUserInfo().then( user => {
      if ( user ) this.setState({ username: user.username })
    })
  }

  handleSearch = (value) => this.setState({ searchTerm: value })
  // the magic arbitary change to force reload on the recipe list
  onRecipeListChange = () => {
    this.setState({ listKey: UUID.v4() })
  }

  render() {
    const {
      searchTerm,
      listKey,
      username
    } = this.state
    const { authState, handleAuthentication } = this.props

    return (
      <Router>
        <Container>
          <ToastContainer
            autoClose={ 1000 }
          />
          <Route
            path='/'
            render = { props => <HeaderMenu
              { ...props }
              successCallback={ this.onRecipeListChange }
              searchTerm={ searchTerm }
              authState={ authState }
              username= { username }
              handleAuthentication={ handleAuthentication }
              handleSearch={ this.handleSearch } />
              }
            />
          <Route
            exact
            path='/'
            render = { props => <RecipeListLoader
              { ...props }
              key={ listKey }
              authState={ authState }
              successCallback={ this.onRecipeListChange }
              searchTerm={ searchTerm } />
              }
            />
      </Container>
      </Router>
    )
  }
}

export default App
