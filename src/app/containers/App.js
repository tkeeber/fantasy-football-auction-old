import React, { PropTypes } from 'react'

import { Header } from 'app/components'

export const App = (props) => (
  <main className='c-main'>
    <Header />
    {props.children}
  </main>
)

App.propTypes = {
  children: PropTypes.object.isRequired
}
