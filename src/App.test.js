/**
 * @file Provides App testing
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
