/* eslint max-params: 0 */

// 3rd party modules
import PubSub from 'pubsub-js'

// modules
import {w as window} from 'app/globals'

// implementation
export function monitor (options = {}) {
  const original = window.onerror || function () {}
  window.onerror = catchAll

  function catchAll (msg, file, lineNo, colNo, err = new Error()) {
    PubSub.publish('app.error.uncaught', {
      columnNumber: colNo,
      fileName: file,
      lineNumber: lineNo,
      message: msg,
      stack: getStackTrace(err.stack)
    })
    // if window.onerror was set, call the original
    original(msg, file, lineNo, colNo, err)
    // default browser behaviour is to return false, which
    // allows the error to continue as normal.
    return options.suppress === true
  }
}

function getStackTrace (stack = '') {
  const trace = stack.split('\n    at ')
  return trace.slice(1, trace.length)
}
