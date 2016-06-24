import React from 'react'
import ReactDOM from 'react-dom'

import { document } from 'app/globals'
import { recordEvents } from 'app/lib/log'
// import {monitor} from 'app/lib/errors'

import { Routes } from './routes'

// boot
recordEvents()

// monitor({
//   suppress: true
// })

ReactDOM.render(<Routes />, document.getElementById('app'))
