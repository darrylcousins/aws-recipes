/**
 * @file Provides `PhotoDetail` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Container, Header, Loader, Icon } from 'semantic-ui-react'
import marked from 'marked'
import { Connect } from "aws-amplify-react"
import { graphqlOperation } from "aws-amplify"

import * as queries from '../graphql/queries'

import { Error } from './error'
import { Controls } from './controls'
import { RecipePhoto } from './photos'

export class RecipeDetail extends React.Component {

  render() {
    const { selectRecipe, currentRecipe } = this.props
    const vars = {
      id: currentRecipe
    }
    return (
      <Connect
        query={ graphqlOperation(queries.getRecipe, vars) }
        variables={ vars }>
        {({ data, loading, errors }) => {
          if (loading) return <Loader active />
          if (errors.length) return <Error data={ errors } />

          const item = data.getRecipe

          return (
            <Container
              className="bb mb3 pb3">
              <Controls { ...this.props } card={ { item: item } } />
              <RecipePhoto
                item={ item }
                centered
                bordered
                className="br2"
                floated="right"
                size="medium" />
              <Header as="h1">
              <Icon.Group
                className="mr3"
              >
                <Icon
                  link
                  onClick={ () => selectRecipe(null) }
                  title="Back to recipes"
                  name="file outline" />
                <Icon
                  link
                  onClick={ () => selectRecipe(null) }
                  corner="bottom left"
                  title="Back to recipes"
                  name="arrow circle left" />
              </Icon.Group>
                { item.title }</Header>
              <div
                style={ {
                  marginLeft: "2em"
                } }>
                <div>
                  <i
                    className="gray i fw1"
                    dangerouslySetInnerHTML={{ __html: marked(item.byline) }} />
                </div>
                <Header as="h4">Ingredients:</Header>
                <div
                  dangerouslySetInnerHTML={{ __html: marked(item.ingredients) }} />
                <Header as="h4">Method:</Header>
                <div
                  dangerouslySetInnerHTML={{ __html: marked(item.method) }} />
              </div>
            </Container>
          )
        }}
      </Connect>
    )
  }
}
