/**
 * @file Provides `RecipeDelete` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Modal, Button, Header, Icon } from 'semantic-ui-react'
import { graphqlOperation, API } from "aws-amplify"
import { toast } from 'react-toastify'

import { Toast } from './toast'

import * as mutations from '../graphql/mutations'

export class RecipeDelete extends React.Component {

  constructor(props) {
    super()
    this.handleDelete = this.handleDelete.bind(this)
    this.state = { modalOpen: false }
  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  handleCancel = () => this.handleClose()

  async handleDelete() {
    // don't forget to delete S3 photos

    const data = { id: this.props.item.id }

    try {
      const result = await API.graphql(graphqlOperation(mutations.deleteRecipe, {input: data}))
      const entry = result.data.deleteRecipe
      console.log("Deleted: ", entry)
      toast.success(<Toast entry={ entry } message="deleted" />, {
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
    const { item } = this.props
    return (
      <Modal
        trigger={ <Button
                    basic
                    id={ item.id }
                    name={ item.header }
                    onClick={ this.handleOpen }><Icon name="delete" />Delete</Button>
                    }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic size='small'>
        <Header icon='trash' content={ `Delete ${ item.header }` } />
        <Modal.Content>
          <p>
            Are you sure you want to delete the recipe <strong>{ item.header }?</strong>
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

