/**
 * @file Provides `HeaderMenu` fragments
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { Menu, Input, Icon } from 'semantic-ui-react'

import { AuthButton } from './auth'
import { RecipeAdd } from './add'

const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

export class HeaderMenu extends React.Component {

  constructor(props) {
    super()
    this.triggerChange = this.triggerChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.state = {
      activeItem: "recipes",
      searchInputValue: props.searchTerm
    }
  }

  componentWillMount = () => this.searchTimer = null

  handleRef = (c) => this.inputRef = c

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    this.props.history.push("/")
  }

  handleSearchInput = (e, { value }) => {
    clearTimeout(this.searchTimer)
    this.setState({ searchInputValue: value })
    this.searchTimer = setTimeout(this.triggerChange, WAIT_INTERVAL)
  }

  handleKeyDown = (e) => {
    if (e.keyCode === ENTER_KEY) this.triggerChange()
  }

  triggerChange = () => this.props.handleSearch(this.state.searchInputValue)

  render() {
    const {
      activeItem,
      searchInputValue
    } = this.state
    const {
      authState,
      username,
      handleAuthentication
    } = this.props
    return (
      <Menu stackable inverted>
        <Menu.Item
          name="recipes"
          active={ activeItem === "recipes" }
          onClick={ this.handleItemClick }>
          Recipes&nbsp;<small>v0.1.0</small>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              loading={ false }
              icon='search'
              autoFocus={ true }
              id="searchTerm"
              ref={ this.handleRef }
              type="text"
              onChange={ this.handleSearchInput }
              onKeyDown={ this.handleKeyDown }
              value={ searchInputValue }
              placeholder='Search Recipes' />
          </Menu.Item>
          <RecipeAdd { ...this.props } />
          <Menu.Item
            href="https://github.com/darrylcousins/aws-nautilus"
            target="_blank">
            <Icon name="github" />
          </Menu.Item>
          <AuthButton
            authState={ authState }
            username={ username }
            handleAuthentication={ handleAuthentication }
            activeItem={ activeItem }
            handleItemClick={ this.handleItemClick } />
        </Menu.Menu>
      </Menu>
    )
  }
}
