/**
 * @file Provides the `App`
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Component, Fragment } from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import {
  Header,
  Input,
  Menu,
  Container,
  Card,
  Loader,
  Button,
  Modal,
  Form,
  TextArea,
  Icon
} from 'semantic-ui-react'
import UUID from 'uuid'
import _ from 'lodash'
import { toast, ToastContainer } from 'react-toastify'

import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'

import { Connect } from "aws-amplify-react"
import { graphqlOperation, API } from "aws-amplify"

import 'react-toastify/dist/ReactToastify.min.css'
import './App.css'

const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

const Error = (errors) => {
  console.log('In error componenent', errors)
  return (
    <Fragment>
      <h3>Error</h3>
      <ul className="list">
        {  errors.data.map((error, idx) =>
          <li key={ idx }>
            <strong className="db mb2">{ error.errorType }</strong>
            <span className="db mb2">{ error.message }</span>
            <em className="db">{ error.path }</em>
          </li>
        )}
      </ul>
    </Fragment>
  )
}

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
      <Menu stackable inverted>
        <Menu.Item
          name="recipes"
          active={ activeItem === "recipes" }
          onClick={ this.handleItemClick }>
          Recipes&nbsp;<small>v0.1.0</small>
        </Menu.Item>
        <Menu.Menu position="right">
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

class RecipeUpdateModal extends Component {

  constructor(props) {
    super()
    this.handleUpdate = this.handleUpdate.bind(this)
    this.defaultInput = {
          id: "",
          title: "",
          byline: "",
          ingredients: "",
          ctime: null,
          mtime: null
    }
    this.state = {
      modalOpen: false,
      input: Object.assign({}, this.defaultInput)
    }
  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({
    modalOpen: false,
    input: Object.assign({}, this.defaultInput)
  })

  handleInputChange = (e) => {
    const target = e.target
    const value = target.value
    const name = target.name
    console.log(name, value)
    let input = this.state.input
    input[name] = value
    this.setState({ input: input })
  }

  async handleUpdate() {

    const { input } = this.state
    const { item } = this.props

    const Toast = ({ entry }) => (
        <Fragment>
          <span>{ entry.title }</span> updated. <Icon name="check" />
        </Fragment>
    )

    const now = new Date()
    input.mtime = now
    input.ctime = item.ctime
    input.id = item.id
    input.title = input.title ? input.title: item.title
    input.byline = input.byline ? input.byline: item.byline
    input.ingredients = input.ingredients ? input.ingredients: item.ingredients
    input.method = input.method ? input.method: item.method

    try {
      const result = await API.graphql(graphqlOperation(mutations.updateRecipe, {input: input}))
      const entry = result.data.updateRecipe
      console.log("Result: ", entry)
      toast.success(<Toast entry={ entry } />, {
        onClose: this.props.successCallback
      })
    } catch (error) {
      console.log("Caught error: ", error)
      toast.error("Update failed")
    } finally {
      this.setState({ modalOpen: false })
    }
  }

  render() {
    const { id, header, item } = this.props
    const { input } = this.state
    return (
      <Modal
        trigger={ <Button
                    basic
                    id={ id }
                    name={ header }
                    onClick={ this.handleOpen }><Icon name="edit" />Edit</Button>
                    }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic size='small'>
        <Header icon='edit' content={ `Edit ${ header }` } />
        <Modal.Content>
          <Form inverted>
            <Form.Input
              required
              label="Title"
              name="title"
              value={ input.title ? input.title : header}
              onChange={ this.handleInputChange }
            />
            <Form.Field
              required
              control={ TextArea }
              label="Byline"
              name="byline"
              value={ input.byline ? input.byline : item.byline}
              onChange={ this.handleInputChange }
            />
            <Form.Field
              required
              control={ TextArea }
              label="Ingredients"
              name="ingredients"
              value={ input.ingredients ? input.ingredients : item.ingredients}
              onChange={ this.handleInputChange }
            />
            <Form.Field
              required
              control={ TextArea }
              label="Method"
              name="method"
              value={ input.method ? input.method : item.method}
              onChange={ this.handleInputChange }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={ this.handleClose }
            color='red'
            inverted>
            <Icon name='remove' /> Cancel
          </Button>
          <Button
            onClick={ this.handleUpdate }
            color='green'
            inverted>
            <Icon name='checkmark' /> Save
          </Button>
        </Modal.Actions>
      </Modal>
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
      id: id
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
        <Header icon='trash' content={ `Delete ${ header }` } />
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
            <Card.Header>{card.item.title}</Card.Header>
            <Card.Meta>{card.meta}</Card.Meta>
            <Card.Description>{card.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <RecipeUpdateModal
                { ...this.props }
                item={ card.item }
                id={ card.id }
                header={ card.header }
              />
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

  render() {
    const { searchTerm } = this.props
    let search = searchTerm ? { title: { contains: searchTerm } } : null
    let variables = { filter: null }
    if (search) variables.filter = search

    return (
      <Connect
        query={ graphqlOperation(queries.listRecipes, variables) }
        >
        {({ data, loading, errors }) => {
          if (loading) return <Loader active />
          if (errors.length) return <Error data={ errors } />

          const cards = data.listRecipes.items.map(item => ({
            item: item,
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
    searchTerm: "",
    listKey: UUID.v4()
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
              key={ listKey }
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
