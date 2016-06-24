import React from 'react'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import { App } from 'app/containers/App'
import { Shop } from 'app/containers/Shop'
import { SelectShop } from 'app/containers/SelectShop'
import { VerifyShop } from 'app/containers/VerifyShop'
import { ViewShop } from 'app/containers/ViewShop'
import { NotFound } from 'app/containers/NotFound'

// public
export const Routes = () => (
  <Router history={hashHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={SelectShop} />
      <Route path='shops/:shopId' component={Shop}>
        <IndexRoute component={ViewShop} />
        <Route path='verify' component={VerifyShop} />
      </Route>
    </Route>
    <Route path='*' component={NotFound} />
  </Router>
)
