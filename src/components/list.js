/**
 * @file Provides `RecipeList` components
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Connect } from "aws-amplify-react"
import { Card, Loader, Image, Placeholder } from 'semantic-ui-react'
import { toast } from 'react-toastify'

import * as queries from '../graphql/queries'

import { graphqlOperation, Storage } from "aws-amplify"

import { Error } from './error'
import { Controls } from './controls'
import { PREFIX } from './photos'

class RecipePhoto extends React.Component {

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
        <Placeholder style={{ height: '196px' }}>
          <Placeholder.Image rectangular />
        </Placeholder>
      )
    } else {
      return (
        <Image src={ src } />
      )
    }
  }
}

class RecipeList extends React.Component {

  handleEdit = (e) => {
    this.props.history.push(`/recipes/${ e.target.id }/${ e.target.name }/edit`)
  }
  handleDelete = (e) => {
    this.props.history.push(`/recipes/${ e.target.id }/${ e.target.name }/delete`)
  }

  render() {

    return (
      <Card.Group centered doubling itemsPerRow={3} stackable>
      { this.props.items.map((card) => (
        <Card key={ card.header }>
          <RecipePhoto item={ card.item } />
          <Card.Content>
            <Card.Header>{ card.item.title }</Card.Header>
            <Card.Meta>{ card.meta }</Card.Meta>
            <Card.Description>
              { card.description }
            </Card.Description>
          </Card.Content>
          <Controls { ...this.props } card={ card } />
        </Card>
      ))}
    </Card.Group>
    )
  }
}

export class RecipeListLoader extends React.Component {

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
