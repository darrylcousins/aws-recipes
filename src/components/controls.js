/**
 * @file Provides `Controls` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Button } from 'semantic-ui-react'

import { RecipePhotoUpload } from './photos'
import { RecipeUpdate } from './update'
import { RecipeDelete } from './delete'

export class Controls extends React.Component {

  render() {
    const { authState, card } = this.props
    if ( authState === "signedIn" ) {
      return (
        <Button.Group
          size="medium"
          color="blue">
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
          </Button.Group>
      )
    }
    return null
  }
}
