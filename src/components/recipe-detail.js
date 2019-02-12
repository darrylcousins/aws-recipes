/**
 * @file Provides a `profile` page
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import marked from 'marked'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faList from '@fortawesome/fontawesome-free-solid/faList'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

import Loading from './loading'
import Error from './error'

import * as queries from '../graphql/queries'

import { Connect } from "aws-amplify-react"
import { graphqlOperation } from "aws-amplify"

export default class RecipeDetail extends React.Component {

  render() {
    const vars = {
      id: this.props.match.params.id
    }
    return (
      <Connect
        query={ graphqlOperation(queries.getRecipe, vars) }
        variables={ vars }>
        {({ data, loading, errors }) => {
          if (loading) return <Loading />
          if (errors.length) return <Error data={ errors } />

          return (
            <Fragment>
              <ul className="list fr">
                <li className="dib mr2">
                  <Link
                    className="f6 f5-ns b db link dim"
                    to={ `/recipes/` }>
                    <FontAwesomeIcon icon={ faList } color="navy" />
                  </Link>
                </li>
                <li className="dib mr2">
                  <Link
                    className="f6 f5-ns b db link dim"
                    to={ `/recipes/${ this.props.match.params.id }/edit` }>
                    <FontAwesomeIcon icon={ faEdit } color="navy" />
                  </Link>
                </li>
                <li className="dib mr2">
                  <Link
                    className="f6 f5-ns b db link dim"
                    to={ `/recipes/${ this.props.match.params.id }/delete` }>
                    <FontAwesomeIcon icon={ faTrashAlt } color="navy" />
                  </Link>
                </li>
                <li className="dib mr2">
                  <Link
                    className="f6 f5-ns b db link dim"
                    to={ `/recipes/create` }>
                    <FontAwesomeIcon icon={ faPlus } color="red" />
                  </Link>
                </li>
              </ul>
              <h1 className="navy">{ data.getRecipe.title }</h1>
              <p className="f8 dark-gray i">{ data.byline }</p>
              <div
                className="f8 dark-gray i"
                dangerouslySetInnerHTML={{ __html: marked(data.getRecipe.byline) }} />
              <div>
                <strong className="db mb2 small-caps">ingredients:</strong>
                { data.getRecipe.ingredients.map((item, idx) => (
                  <div
                    key={ idx }
                    className="ml2 db">{ item }</div>
                ))}
              </div>
              <strong className="db mt2 small-caps">method:</strong>
              <div
                dangerouslySetInnerHTML={{ __html: marked(data.getRecipe.method) }} />
              <div className="small-caps">
                <span>created: </span>
                <span className="f6">{ new Date(data.getRecipe.ctime).toLocaleString() }</span>
              </div>
              <div className="small-caps">
                <span>last modified: </span>
                <span className="f6">{ new Date(data.getRecipe.mtime).toLocaleString() }</span>
              </div>
            </Fragment>
          )
        }}
      </Connect>
    )
  }
}
