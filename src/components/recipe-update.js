/**
 * @file Provides an `Update Glossary Entry` form component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Form } from 'react-form'
import { toast } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faList from '@fortawesome/fontawesome-free-solid/faList'
import faEye from '@fortawesome/fontawesome-free-solid/faEye'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'

import Input from './form/input.js'
import TextArea from './form/textarea.js'
import Message from './form/message.js'
import Style from './form/style'
import Loading from './loading'
import Error from './error'
import { ListStyle } from '../utils/style'

import * as queries from '../graphql/queries'
import * as mutations from '../graphql/mutations'

import { Connect } from "aws-amplify-react"
import { API, graphqlOperation } from "aws-amplify"

export default class RecipeUpdate extends React.Component {

  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  validate(data) {
    // test for empty fields do it here rather than at field level
    let required = {
      title: "Title",
      byline: "Byline",
      method: "Method",
      ingredients: "Ingredients",
    }
    let ret = Object()
    for (var key in required) {
      if (required.hasOwnProperty(key) && data.hasOwnProperty(key)) {
        if (!data[key] || data[key].trim() === '') {
          ret[key] = Object()
          ret[key]["error"] = `${ required[key] } is a required field`
          ret[key]["warning"] = `Please enter a ${ required[key].toLowerCase() }`
        } else {
          ret[key] = Object()
          ret[key]["success"] = true
        }

      }
    }
    return ret
  }

  async onSubmit(data, e, formApi) {

    // update the modified time stamp
    data.mtime = new Date()

    // store as list
    data.ingredients = data.ingredients.split("\n")

    const Toast = ({ entry }) => (
        <Fragment>
          <span>{ entry.title }</span> updated. <FontAwesomeIcon icon={ faCheck } />
        </Fragment>
    )

    try {
      const result = await API.graphql(graphqlOperation(mutations.updateRecipe, {input: data}))
      const entry = result.data.updateRecipe
      console.log("Result: ", entry)
      toast.success(<Toast entry={ entry } />, {
        onClose: () =>  this.props.history.push(`/recipes/`)
      })
    } catch (error) {
      console.log("Caught error: ", error)
      toast.error("Update failed")
    }
  }

  render() {

    const vars = {
      id: this.props.match.params.id,
    }
    return (
      <Connect
        query={ graphqlOperation(queries.getRecipe, vars) }
        variables={ vars }>
        {({ data, loading, errors }) => {
          if (loading) return <Loading />
          if (errors.length) return <Error data={ errors } />

          console.log(data.getRecipe.ingredients)
          return (
            <Fragment>
              <div className="fr">
                <ul className="list" style={ ListStyle }>
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
                      to={ `/recipes/${ this.props.match.params.id }` }>
                      <FontAwesomeIcon icon={ faEye } color="navy" />
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
              </div>
              <h1 className="navy">Edit { data.getRecipe.title }</h1>
              <Form onSubmit={ this.onSubmit }
                validate={ this.validate }
                defaultValues={
                  {
                    id: this.props.match.params.id,
                    title: data.getRecipe.title,
                    byline: data.getRecipe.byline,
                    method: data.getRecipe.method,
                    ingredients: data.getRecipe.ingredients.join('\n'),
                  }
                }
                  >
                {formApi => (
                  <form
                    onSubmit={ formApi.submitForm }
                    id="recipe-update-form"
                    className={ Style.form }>
                    <div>{ formApi.errors && <Message name="__all__" type="error" messages={ formApi.errors }/> }</div>
                    <Input
                      formApi={ formApi }
                      name="title"
                      title="Title"
                      help_text="Recipe title."
                    />
                    <TextArea
                      formApi={ formApi }
                      name="byline"
                      title="Byline"
                      help_text="Introductory text for the recipe."
                    />
                    <TextArea
                      formApi={ formApi }
                      name="ingredients"
                      title="Ingredients"
                      help_text="Ingredients - use a newline for each ingredient."
                    />
                    <TextArea
                      formApi={ formApi }
                      name="method"
                      title="Method"
                      help_text="Recipe method"
                      rows="4"
                      cols="20"
                    />
                    <div className="fr">
                      <button
                        type="submit"
                        className={ Style.buttonDefault }
                      >Update
                      </button>
                    </div>
                  </form>
                )}
              </Form>
            </Fragment>
          )
        }}
      </Connect>
    )
  }
}
