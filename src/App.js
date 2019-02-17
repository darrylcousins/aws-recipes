/**
 * @file Provides the `App`
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Switch
} from 'react-router-dom'
import {
  Grid,
  Header,
  Input,
  List,
  Segment,
  Menu,
  Container,
  Card,
  Dimmer,
  Loader,
  Button,
  Modal,
  Icon
} from 'semantic-ui-react'
import UUID from 'uuid'
import _ from 'lodash'
import { toast, ToastContainer } from 'react-toastify'

import Error from './components/error'
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import * as subscriptions from './graphql/subscriptions'

import { Connect } from "aws-amplify-react"
import { graphqlOperation, API } from "aws-amplify"

import RecipeCreate from './components/recipe-create'
import RecipeDetail from './components/recipe-detail'
import RecipeUpdate from './components/recipe-update'

import 'react-toastify/dist/ReactToastify.min.css'
import './App.css'

const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

class HeaderMenu extends React.Component {

  constructor(props) {
    super()
    this.triggerChange = this.triggerChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.state = {
      activeItem: "recipes",
      searchInputValue: props.searchTerm
    }
  }

  componentWillMount = () => this.searchTimer = null

  handleRef = (c) => this.inputRef = c

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    this.props.history.push("/")
  }

  handleSearchInput = (e, { value }) => {
    clearTimeout(this.searchTimer)
    this.setState({ searchInputValue: value })
    this.searchTimer = setTimeout(this.triggerChange, WAIT_INTERVAL)
  }

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) this.triggerChange()
  }

  triggerChange = () => this.props.handleSearch(this.state.searchInputValue)

  render() {
    const {
      activeItem,
      searchInputValue
    } = this.state
    return (
      <Menu secondary stackable>
        <Menu.Item
          name="recipes"
          active={ activeItem === "recipes" }
          onClick={ this.handleItemClick }>
          Recipes&nbsp;<small>v0.1.0</small>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              loading={ false }
              icon='search'
              autoFocus={ true }
              id="searchTerm"
              ref={ this.handleRef }
              type="text"
              onChange={ this.handleSearchInput }
              onKeyDown={ this.handleKeyDown }
              value={ searchInputValue }
              placeholder='Search Recipes' />
          </Menu.Item>
          <Menu.Item>
            <RecipeAdd { ...this.props } />
          </Menu.Item>
          <Menu.Item
            name="login"
            active={ activeItem === "login" }
            onClick={ this.handleItemClick }>
            <Icon name="sign-in" />Login
          </Menu.Item>
          <Menu.Item
            href="https://github.com/darrylcousins/aws-nautilus"
            target="_blank">
            <Icon name="github" />Github
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

class RecipeAdd extends Component {

  state = { newTitle: "" }

  handleRecipeTitle = (e, { value }) => this.setState({ newTitle: value })
  handleAddRecipe = (e) => this.addRecipe(this.state.newTitle)

  async addRecipe(title) {
    const data = { title: title }
    const now = new Date()

    data.id = UUID.v4()
    data.ctime = now
    data.mtime = now
    data.byline = "Please edit and add byline"
    data.ingredients = "Please edit and add ingredients"
    data.method = "Please edit and add method"

    const Toast = ({ entry }) => (
        <Fragment>
          <span>{ entry.title }</span> created. <Icon name="check" />
        </Fragment>
    )

    try {
      const result = await API.graphql(graphqlOperation(mutations.createRecipe, {input: data}))
      const entry = result.data.createRecipe
      console.log("Result: ", entry)
      toast.success(<Toast entry={ entry } />, {
        onClose: this.props.successCallback
      })
    } catch (error) {
      console.log("Caught error: ", error)
      toast.error("Create failed")
    }
  }

  render() {
    const { recipeTitle } = this.state
    return (
      <Input
        loading={ false }
        type='text'
        placeholder='Enter Recipe Title'
        icon='plus'
        iconPosition='left'
        action={{ content: 'Add', onClick: this.handleAddRecipe }}
        name='albumName'
        value={ recipeTitle }
        onChange={ this.handleRecipeTitle }
      />
    )
  }
}

class RecipeDeleteModal extends Component {

  constructor(props) {
    super()
    this.handleDelete = this.handleDelete.bind(this)
    this.state = {
      modalOpen: false
    }
  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  handleCancel = () => this.setState({ modalOpen: false })

  async handleDelete() {

    const { id, header } = this.props
    const data = {
      id: id,
      title: header
    }

    const Toast = ({ entry }) => (
        <Fragment>
          <span>{ entry.title }</span> deleted. <Icon name="check" />
        </Fragment>
    )

    try {
      const result = await API.graphql(graphqlOperation(mutations.deleteRecipe, {input: data}))
      const entry = result.data.deleteRecipe
      console.log("Result: ", entry)
      toast.success(<Toast entry={ entry } />, {
        onClose: this.props.successCallback
      })
    } catch (error) {
      console.log("Caught error: ", error)
      toast.error("Delete failed")
    } finally {
      this.setState({ modalOpen: false })
    }
  }


  render() {
    const { id, header } = this.props
    return (
      <Modal
        trigger={ <Button
                    basic
                    id={ id }
                    name={ header }
                    onClick={ this.handleOpen }><Icon name="delete" />Delete</Button>
                    }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic size='small'>
        <Header icon='trash' content='Delete Recipe' />
        <Modal.Content>
          <p>
            Are you sure you want to delete the recipe <strong>{ header }?</strong>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={ this.handleCancel }
            color='red'
            inverted>
            <Icon name='remove' /> Cancel
          </Button>
          <Button
            onClick={ this.handleDelete }
            color='green'
            inverted>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

class RecipeList extends Component {

  handleEdit = (e) => {
    this.props.history.push(`/recipes/${ e.target.id }/${ e.target.name }/edit`)
  }
  handleDelete = (e) => {
    this.props.history.push(`/recipes/${ e.target.id }/${ e.target.name }/delete`)
  }

  render() {
    return (
      <Card.Group centered>
      {_.map(this.props.items, card => (
        <Card key={card.header}>
          <Card.Content>
            <Card.Header>{card.header}</Card.Header>
            <Card.Meta>{card.date}</Card.Meta>
            <Card.Description>{card.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button
                basic
                id={ card.id }
                name={ card.header }
                onClick={ this.handleEdit }><Icon name="edit" />Edit</Button>
              <RecipeDeleteModal
                { ...this.props }
                id={ card.id }
                header={ card.header }
              />
            </div>
          </Card.Content>
        </Card>
      ))}
      </Card.Group>
    )
  }
}

class RecipeListLoader extends Component {

  onNewRecipe = (prev, { onCreateRecipe }) => {
    // subscription not working!!
    let updated= Object.assign({}, prev)
    updated.listRecipes.items = prev.listRecipes.items.concat([onCreateRecipe])
    console.log("New Data: " + onCreateRecipe)
    console.log("Updated query: " + updated)
    return updated
  }

  render() {
    const { searchTerm } = this.props
    let search = searchTerm ? { title: { contains: searchTerm } } : null
    let variables = { filter: null}
    if (search) variables.filter = search

    return (
      <Connect
        query={ graphqlOperation(queries.listRecipes, variables) }
        subscription={ graphqlOperation(subscriptions.onCreateRecipe) }
        onSubscriptionMsg={ this.onNewRecipe }
        >
        {({ data, loading, errors }) => {
          if (loading) return <Loader active />
          if (errors.length) return <Error data={ errors } />

          const cards = data.listRecipes.items.map(item => ({
            header: item.title,
            meta: "Last updated: " + new Date(item.mtime).toLocaleString(),
            description: item.byline,
            id: item.id
          }))

          return (
            <RecipeList { ...this.props } items={ cards } />
          )
        }}
      </Connect>
    )
  }
}

class App extends Component {

  state = {
    searchTerm: ""
  }

  handleSearch = (value) => this.setState({ searchTerm: value })
  // attempt to reload list on create and delete
  onRecipeListChange = () => {
    console.log("On recipe change detected")
  }

  render() {
    const {
      searchTerm
    } = this.state

    return (
      <Router>
        <Container>
          <ToastContainer
            autoClose={ 2000 }
          />
          <Route
            path='/'
            render = { props => <HeaderMenu
              { ...props }
              successCallback={ this.onRecipeListChange }
              searchTerm={ searchTerm }
              handleSearch={ this.handleSearch } />
              }
            />
          <Route
            exact
            path='/'
            render = { props => <RecipeListLoader
              { ...props }
              successCallback={ this.onRecipeListChange }
              searchTerm={ searchTerm } />
              }
            />
          <Switch>
            <Route path="/recipes/:id/:title/edit" component={ RecipeUpdate } />
            <Route exact path="/recipes/create" component={ RecipeCreate } />
            <Route path="/recipes/:id/:title" component={ RecipeDetail } />
          </Switch>
      </Container>
      </Router>
    )
  }
}

export default App
