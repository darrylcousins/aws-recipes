/**
 * @file Provides `RecipeUpdate` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import {
  Header,
  Button,
  Modal,
  Form,
  TextArea,
  Icon
} from 'semantic-ui-react'
import { toast } from 'react-toastify'

import * as mutations from '../graphql/mutations'

import { graphqlOperation, API } from "aws-amplify"

import { Toast } from './toast'

export class RecipeUpdate extends React.Component {

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

    input.mtime = new Date()
    input.ctime = item.ctime
    input.id = item.id
    input.user = item.user
    input.photos = item.photos
    input.title = input.title ? input.title: item.title
    input.byline = input.byline ? input.byline: item.byline
    input.ingredients = input.ingredients ? input.ingredients: item.ingredients
    input.method = input.method ? input.method: item.method

    try {
      const result = await API.graphql(graphqlOperation(mutations.updateRecipe, {input: input}))
      const entry = result.data.updateRecipe
      console.log("Result: ", entry)
      toast.success(<Toast entry={ entry } message="updated" />, {
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
    const { item } = this.props
    const { input } = this.state
    return (
      <Modal
        trigger={ <Button
                    basic
                    id={ `update-${ item.id }` }
                    name={ item.title }
                    onClick={ this.handleOpen }><Icon name="edit" />Update</Button>
                    }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic size='small'>
        <Header icon='edit' content={ `Edit ${ item.title }` } />
        <Modal.Content>
          <Form inverted>
            <Form.Input
              required
              label="Title"
              name="title"
              value={ input.title ? input.title : item.title }
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
