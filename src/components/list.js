/**
 * @file Provides `RecipeList` components
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Connect } from "aws-amplify-react"
import { Card, Loader } from 'semantic-ui-react'

import * as queries from '../graphql/queries'

import { graphqlOperation } from "aws-amplify"

import { Error } from './error'
import { Controls } from './controls'
import { RecipePhoto } from './photos'

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
        <Card
          onClick={ () => this.props.selectRecipe(card.id) }
          title={ card.header }
          key={ card.header }>
          <RecipePhoto item={ card.item } />
          <Card.Content>
            <Card.Header>{ card.item.title }</Card.Header>
            <Card.Meta>{ card.meta }</Card.Meta>
            <Card.Description>
              { card.description }
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Controls { ...this.props } card={ card } />
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
    )
  }
}

export class RecipeListLoader extends React.Component {

  render() {
    const { searchTerm, selectRecipe } = this.props
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
            <RecipeList
              { ...this.props }
              selectRecipe={ selectRecipe }
              items={ cards } />
          )
        }}
      </Connect>
    )
  }
}
