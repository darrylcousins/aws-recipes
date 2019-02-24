/**
 * @file Provides `RecipePhotoUpload` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import {
  Header,
  Button,
  Modal,
  Icon
} from 'semantic-ui-react'
import UUID from 'uuid'
import { toast } from 'react-toastify'

import * as mutations from '../graphql/mutations'

import { graphqlOperation, API, Storage } from "aws-amplify"

import { Toast } from './toast'

export class RecipePhotoUpload extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false,
      uploading: false
    }
    this.uploadFile = this.uploadFile.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  async uploadFile(item) {
    const result = await Storage.put(
      item.fileName, item.file, {
          customPrefix: { public: 'uploads/' },
          metadata: { recipeid: this.props.recipeId }
        }
      )

    console.log('Uploaded file: ', result)
  }

  async testUpload(item) {
    console.log(item.file, item.fileName)
  }

  async onChange(e) {
    this.setState({ uploading: true })
    let files = []
    let photos = []

    for (var i = 0; i < e.target.files.length; i++) {
      let fileName = UUID.v4()
      files.push({ file: e.target.files[i], fileName: fileName })
      photos.push(fileName)
    }

    await Promise.all(files.map(item => this.testUpload(item)))

    const input = Object.assign({}, this.props.item)
    input.photos = JSON.stringify(photos)

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
      this.setState({ uploading: false, modalOpen: false })
    }

  }

  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })

  render() {
    const { item } = this.props
    return (
      <Modal
        trigger={ <Button
                    basic
                    id={ item.id }
                    name={ item.header }
                    onClick={ this.handleOpen }><Icon name="image" />Photos</Button>
                    }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic size='small'>
        <Header icon='trash' content="Upload Photos" />
        <Modal.Content>
          <p>
            Select photos from your computer for the recipe <strong>{ item.header }.</strong>
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={ this.handleClose } color='red' inverted>
            <Icon name='remove' /> Cancel
          </Button>
          <Button
            disabled={this.state.uploading}
            name={ this.state.uploading ? 'Uploading...' : 'Add Images' }
            onClick={() => document.getElementById('add-image-file-input').click()}
            color="green"
            inverted
            ><Icon name="image" />Add Images</Button>
          <input
            id='add-image-file-input'
            type="file"
            accept='image/*'
            multiple
            onChange={ this.onChange }
            style={{ display: 'none' }}
          />
        </Modal.Actions>
      </Modal>
    )
  }
}
