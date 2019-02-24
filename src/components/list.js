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

class RecipeList extends React.Component {

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
                { card.item.user } { card.item.photos }
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
