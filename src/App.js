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
import { RecipeDetail } from './components/detail'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      username: "",
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

  selectRecipe = (id) => this.setState({ currentRecipe: id })

  render() {
    const {
      searchTerm,
      listKey,
      username,
      currentRecipe
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
              selectRecipe={ this.selectRecipe }
              handleSearch={ this.handleSearch } />
              }
            />
          <Route
            path='/'
            render = { () => {
              if (currentRecipe) return <RecipeDetail
                    currentRecipe={ currentRecipe }
                    authState={ authState }
                    selectRecipe={ this.selectRecipe } />
              return null
            } } />
          <Route
            path='/'
            render = { props => <RecipeListLoader
              { ...props }
              key={ listKey }
              authState={ authState }
              selectRecipe={ this.selectRecipe }
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
