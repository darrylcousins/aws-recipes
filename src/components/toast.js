/**
 * @file Provides `Toast` fragment
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Fragment } from 'react'
import { Icon } from 'semantic-ui-react'

export const Toast = ({ entry, message }) => (
    <Fragment>
      <span>{ entry.title }</span> { message }. <Icon name="check" />
    </Fragment>
)
