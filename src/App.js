/**
 * @file Provides the `App`
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import faGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import faList from '@fortawesome/fontawesome-free-solid/faList'

import Index from './components/index'
import RecipeList from './components/recipe-list'
import RecipeCreate from './components/recipe-create'
import RecipeDetail from './components/recipe-detail'
import RecipeUpdate from './components/recipe-update'

import 'react-toastify/dist/ReactToastify.min.css'
import './tachyons.min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="w-100 sans-serif">
          <ToastContainer
            autoClose={ 2000 }
          />
          <div className="center w85">
            <header>
              <div className="w-100 pa2 ph2-ns pt3-ns pb1 bg-white">
                <div className="db dt-ns mw9 center w-100">
                  <div className="db dtc-ns v-mid tl w-50">
                    <Link to="/" className="f5 f4-ns fw6 mt0 mb1 link black-70 dib" title="Home">
                      Nautilus
                      <div className="dib">
                        <small className="nowrap f6 ml1 mt2 mt3-ns pr2 black-70 fw2">v0.1.0</small>
                      </div>
                    </Link>
                  </div>
                  <nav className="db dtc-ns v-mid w-100 tl tr-ns mt2 mt0-ns">
                    <a title="Recipes"
                      href="/recipes/"
                      className="link dim f6 fw6 link navy mr2 mr3-m mr4-l dib pointer">
                      <FontAwesomeIcon icon={ faList } color="navy" />
                      &nbsp;Recipes
                    </a>
                    <a title="Nautilus on GitHub"
                      href="https://github.com/darrylcousins/aws-nautilus"
                      className="link dim f6 fw6 link navy mr2 mr3-m mr4-l dib pointer">
                      <FontAwesomeIcon icon={ faGithub } color="navy" />
                      &nbsp;GitHub
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            <div className="ph2-ns">
              <div className="cf mw9 tc-m">
                <div className="pb2 pb3-ns pt2 mt0 black-70">
                  <div className="ph1 pv1 background-gray tl">
                    <section className="mw6 mw7-ns center pa3 ph5-ns">
                      <Route exact path="/" component={ Index } />
                      <Route exact path="/recipes" component={ RecipeList } />
                      <Switch>
                        <Route path="/recipes/:id/:title/edit" component={ RecipeUpdate } />
                        <Route exact path="/recipes/create" component={ RecipeCreate } />
                        <Route path="/recipes/:id/:title" component={ RecipeDetail } />
                      </Switch>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}

//export default App
export default App
