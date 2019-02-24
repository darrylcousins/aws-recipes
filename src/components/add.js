/**
 * @file Provides `RecipeAdd` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Menu, Input } from 'semantic-ui-react'
import { graphqlOperation, API } from "aws-amplify"
import { toast } from 'react-toastify'

import { Toast } from './toast'

import * as mutations from '../graphql/mutations'

export class RecipeAdd extends React.Component {

  state = { newTitle: "" }

  handleRecipeTitle = (e, { value }) => this.setState({ newTitle: value })
  handleAddRecipe = (e) => this.addRecipe(this.state.newTitle)

  async addRecipe(title) {
    const { username } = this.props
    const now = new Date()
    // set up some reasonable defaults
    const data = {
      title: title,
      user: username,
      photos: JSON.stringify([]),
      ctime: now,
      mtime: now,
      byline: "Please edit and add byline",
      ingredients: "Please edit and add ingredients",
      method: "Please edit and add method"
    }

    try {
      const result = await API.graphql(graphqlOperation(mutations.createRecipe, {input: data}))
      const entry = result.data.createRecipe
      console.log("Result: ", entry)
      toast.success(<Toast entry={ entry } message="created" />, {
        onClose: this.props.successCallback
      })
      this.setState({ newTitle: "" })
    } catch (error) {
      console.log("Caught error: ", error)
      toast.error("Create failed")
    }
  }

  render() {
    const { newTitle } = this.state
    const { authState } = this.props
    if ( authState === "signedIn") {
      return (
        <Menu.Item>
          <Input
            loading={ false }
            type='text'
            placeholder='Enter Recipe Title'
            icon='plus'
            iconPosition='left'
            action={{ content: 'Add', onClick: this.handleAddRecipe }}
            name='recipeTitle'
            value={ newTitle }
            onChange={ this.handleRecipeTitle }
          />
        </Menu.Item>
      )
    }
    return null
  }
}
