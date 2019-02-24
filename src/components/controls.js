/**
 * @file Provides `Controls` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Card } from 'semantic-ui-react'

import { RecipePhotoUpload } from './photos'
import { RecipeUpdate } from './update'
import { RecipeDelete } from './delete'

export class Controls extends React.Component {

  render() {
    const { authState, card } = this.props
    if ( authState === "signedIn" ) {
      return (
        <Card.Content extra>
          <div className='ui three buttons'>
            <RecipeUpdate
              { ...this.props }
              item={ card.item }
            />
            <RecipePhotoUpload
              { ...this.props }
              item={ card.item }
            />
            <RecipeDelete
              { ...this.props }
              item={ card.item }
            />
          </div>
        </Card.Content>
      )
    }
    return null
  }
}
