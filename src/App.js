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
import { toast, ToastContainer } from 'react-toastify'
import { Auth } from "aws-amplify"

import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'

import { Connect } from "aws-amplify-react"
import { graphqlOperation, API, Storage } from "aws-amplify"

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

class AuthButton extends React.Component {

  render() {
    const {
      handleAuthentication,
      authState,
      activeItem,
      username
    } = this.props
    let action = "login"
    console.log("butto", username)

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
    const {
      authState,
      username,
      handleAuthentication
    } = this.props
    return (
      <Menu stackable inverted>
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
          <RecipeAdd { ...this.props } />
          <Menu.Item
            href="https://github.com/darrylcousins/aws-nautilus"
            target="_blank">
            <Icon name="github" />
          </Menu.Item>
          <AuthButton
            authState={ authState }
            username={ username }
            handleAuthentication={ handleAuthentication }
            activeItem={ activeItem }
            handleItemClick={ this.handleItemClick } />
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
      this.setState({ newTitle: "" })
    } catch (error) {
      console.log("Caught error: ", error)
      toast.error("Create failed")
    }
  }

  render() {
    const { newTitle } = this.state
    const { authState } = this.props
    if ( authState === "signedIn") {
      return (
        <Menu.Item>
          <Input
            loading={ false }
            type='text'
            placeholder='Enter Recipe Title'
            icon='plus'
            iconPosition='left'
            action={{ content: 'Add', onClick: this.handleAddRecipe }}
            name='recipeTitle'
            value={ newTitle }
            onChange={ this.handleRecipeTitle }
          />
        </Menu.Item>
      )
    }
    return null
  }
}

class S3ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uploading: false }
  }

  uploadFile = async (file) => {
    const fileName = UUID.v4();

    const result = await Storage.put(
      fileName, file, {
          customPrefix: { public: 'uploads/' },
          metadata: { recipeid: this.props.recipeId }
        }
      )

    console.log('Uploaded file: ', result);
  }

  onChange = async (e) => {
    this.setState({uploading: true});
    let files = [];
    for (var i=0; i<e.target.files.length; i++) {
      files.push(e.target.files.item(i));
    }
    await Promise.all(files.map(f => this.uploadFile(f)));

    this.setState({uploading: false});
  }

  render() {
    return (
      <Fragment>
        <Button
          basic
          disabled={this.state.uploading}
          name={ this.state.uploading ? 'Uploading...' : 'Add Images' }
          onClick={() => document.getElementById('add-image-file-input').click()}
          ><Icon name="image" />Add Images</Button>
        <input
          id='add-image-file-input'
          type="file"
          accept='image/*'
          multiple
          onChange={ this.onChange }
          style={{ display: 'none' }}
        />
      </Fragment>
    )
  }
}

class RecipeUpdate extends Component {

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

class RecipeDelete extends Component {

  constructor(props) {
    super()
    this.handleDelete = this.handleDelete.bind(this)
    this.state = { modalOpen: false }
  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  handleCancel = () => this.handleClose()

  async handleDelete() {

    const data = { id: this.props.id }

    const Toast = ({ entry }) => (
        <Fragment>
          <span>{ entry.title }</span> deleted. <Icon name="check" />
        </Fragment>
    )

    try {
      const result = await API.graphql(graphqlOperation(mutations.deleteRecipe, {input: data}))
      const entry = result.data.deleteRecipe
      console.log("Deleted: ", entry)
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
          <Button onClick={ this.handleCancel } color='red' inverted>
            <Icon name='remove' /> Cancel
          </Button>
          <Button onClick={ this.handleDelete } color='green' inverted>
            <Icon name='checkmark' /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

class Controls extends Component {

  render() {
    const { authState, card } = this.props
    if ( authState === "signedIn" ) {
      return (
        <Card.Content extra>
          <div className='ui three buttons'>
            <RecipeUpdate
              { ...this.props }
              item={ card.item }
              id={ card.id }
              header={ card.header }
            />
            <S3ImageUpload recipeId={ card.id } />
            <RecipeDelete
              { ...this.props }
              id={ card.id }
              header={ card.header }
            />
          </div>
        </Card.Content>
      )
    }
    return null
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
      { this.props.items.map((card) => (
        <Card key={ card.header }>
          <Card.Content>
            <Card.Header>{ card.item.title }</Card.Header>
            <Card.Meta>{ card.meta }</Card.Meta>
            <Card.Description>
              <div>
                { card.photos }
              </div>
              <div>
                { card.user }
              </div>
              <div>
                { card.description }
              </div>
            </Card.Description>
          </Card.Content>
          <Controls { ...this.props } card={ card } />
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
      this.setState({ username: user.username })
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
    console.log(username)

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
