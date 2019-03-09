/**
 * @file Provides `RecipePhotoUpload` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import {
  Header,
  Button,
  Modal,
  Placeholder,
  Image,
  Icon
} from 'semantic-ui-react'
import UUID from 'uuid'
import { toast } from 'react-toastify'

import * as mutations from '../graphql/mutations'

import { graphqlOperation, API, Storage } from "aws-amplify"

import { Toast } from './toast'

export const PREFIX = "uploads/"

export class RecipePhoto extends React.Component {

  constructor(props) {
    super(props)
    this.state = { loading: true, src: null }
    this.getPhoto = this.getPhoto.bind(this)
    this.loadPhoto = this.loadPhoto.bind(this)
    this.placeholder = "https://s3.amazonaws.com/awsrecipes4a7ca1dbafd144a2b2de840a7e9aff3b/public/uploads/wireframe.png"
  }

  componentDidMount() {
    setTimeout( () => this.getPhoto(), 2000 )
  }

  loadPhoto(src) {
    const self = this
    let image = new window.Image()
    image.onload = () => {
      self.setState({ src: src, loading: false })
    }
    image.src = src
  }

  async getPhoto() {
    const { item } = this.props
    const photos = JSON.parse(item.photos)
    if (photos.length === 0) {
      this.loadPhoto(this.placeholder)
    } else {
      const key = photos[0]
      Storage.get(PREFIX + key)
        .then(result => {
          this.loadPhoto(result)
        })
        .catch(err => {
          this.loadPhoto(this.placeholder)
          toast.error("An error occurred")
        })
    }
  }

  render() {
    const { loading, src } = this.state
    if ( loading ) {
      return (
        <div
          style={ {
            float: "right",
            } }>
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        </div>
      )
    } else {
      return (
        <Image { ...this.props } src={ src } />
      )
    }
  }
}

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

  async uploadFile(ob) {
    const { item } = this.props
    Storage.put(
      ob.fileName, ob.file, {
          customPrefix: { public: "public/" + PREFIX },
          level: "public",
          metadata: { recipeid: item.id }
        }
      ).then (result => console.log(PREFIX, result))
        .catch(err => console.log(PREFIX, err))

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

    await Promise.all(files.map(item => this.uploadFile(item)))

    const input = Object.assign({}, this.props.item)
    input.photos = JSON.stringify(photos)
    input.mtime = new Date()

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
                    id={ `upload-${ item.id }` }
                    title="Add Or Update Photo"
                    name={ item.header }
                    icon="image outline"
                    onClick={ this.handleOpen } />
                    }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        >
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
