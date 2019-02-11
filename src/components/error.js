/**
 * @file Provides an `Error` object
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'

export default (errors) => {
  console.log('In error componenent', errors)
  return (
    <Fragment>
      <h3>Error</h3>
      <ul className="list">
        {  errors.data.map((error, idx) =>
          <li key={ idx }>
            <strong className="db mb2">{ error.errorType }</strong>
            <span className="db mb2">{ error.message }</span>
            <em className="db">{ error.path }</em>
          </li>
        )}
      </ul>
    </Fragment>
  )
}

