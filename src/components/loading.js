/**
 * @file Provides an `Loading` object
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'

export default () => {
  return <FontAwesomeIcon icon={ faSpinner } color="navy" className="loader" />
}
