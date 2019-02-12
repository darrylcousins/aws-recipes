/**
 * @file Provides a `GlossaryEntries` page view
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import marked from 'marked'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

import Loading from './loading'
import Error from './error'
import * as queries from '../graphql/queries'

import { Connect } from "aws-amplify-react"
import { graphqlOperation } from "aws-amplify"

export default class RecipeList extends React.Component {

  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.state = { searchTerm: "" }
    this.searchInput = React.createRef()
  }

  __componentDidUpdate() {
    console.log(this.searchInput)
    if (this.searchInput.current) {
      console.log("focus?")
      this.searchInput.current.focus()
    }
  }

  handleSearch(e) {
    if (e.target.value !== this.state.searchTerm) {
      this.setState({ searchTerm : e.target.value })
    }
  }

  render() {
    var vars
    if (this.state.searchTerm) {
      vars = {
        title: {
          contains: this.state.searchTerm
        }
      }
    }
    const variables = {
      filter: vars
    }

    const SummaryList = ({ items }) => (
      items.map((entry, idx) => (
        <Fragment key={ idx }>
          <Link
            className="link db dim mb1 mt0"
            to={ `/recipes/${ entry.id }/${ entry.title }` }>
            <div className="pa1 grow">
              <h3 className="navy">
                { entry.title }
              </h3>
              <div
                className="near-black mb0"
                dangerouslySetInnerHTML={{ __html: marked(entry.byline) }} />
            </div>
          </Link>
          <div className="w-100 bb">
            <div className="fl small-caps dark-gray">
              <span>last modified: </span>
              <span className="f6">{ new Date(entry.mtime).toLocaleString() }</span>
            </div>
            <div className="fr">
              <Link
                className="ma1 f6 f5-ns b db link dim dib"
                to={ `/recipes/${ entry.id }/${ entry.title }/edit` }>
                <FontAwesomeIcon icon={ faEdit } color="navy" />
              </Link>
              <Link
                className="ma1 f6 f5-ns b db link dim dib"
                to={ `/recipes/${ entry.id }/${ entry.title }/delete` }>
                <FontAwesomeIcon icon={ faTrashAlt } color="navy" />
              </Link>
            </div>
            <div className="cf" />
          </div>
        </Fragment>
      ))
    )

    return (
      <Fragment>
        <Link
          className="f6 f5-ns b db link dim orange fr"
          to={ `/recipes/create` }>
          <FontAwesomeIcon icon={ faPlus } color="red" />
        </Link>
        <h1 className="navy">Recipes</h1>
        <label className="absolute pa0 ma0 o-0" htmlFor="searchTerm">Search term</label>
        <div className="relative mt2 mb3 dt dib w-100">
          <div className="pointer w3 bg-light-gray b--black-20 ba br-0 pa2 br2 br--left dtc dib tc">
            <FontAwesomeIcon icon={ faSearch } />
          </div>
          <input
            className="dtc pa2 b--black-20 dib bt bb bw1 w-100"
            autoFocus={ true }
            id="searchTerm"
            ref={ this.searchInput }
            type="text"
            onChange={ this.handleSearch }
            value={ this.state.searchTerm }
            placeholder="Search..." />
          <div className="pointer w2 bg-light-gray b--black-20 ba bl-0 pa2 br2 br--right dtc dib tc"
            onClick={ () => {
              this.searchInput.current.value = ''
              }}
              >
            <FontAwesomeIcon
              icon={ faTimes } />
          </div>
        </div>
        <Connect
          query={ graphqlOperation(queries.listRecipes, variables) }
          >
          {({ data, loading, errors }) => {
            if (loading) return <Loading />
            if (errors.length) return <Error data={ errors } />
            return (
              <SummaryList items={ data.listRecipes.items } />
            )
          }}
        </Connect>
      </Fragment>
    )
  }

}
