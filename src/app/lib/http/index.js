// 3rd party modules
import PubSub from 'pubsub-js'

// modules
import {getConstant} from 'app/lib/constants'
import {Promise, performance, XMLHttpRequest} from 'app/globals'
import {stringify} from 'app/lib/json'
import {onData} from './onData'
import {onError} from './onError'
import {onTimeout} from './onTimeout'

// public
let http = {
  get: request.bind(null, 'GET'),
  post: request.bind(null, 'POST'),
  put: request.bind(null, 'PUT')
}

export {http}

// implementation
let requestId = 0

function request (method, url, data) {
  return new Promise(
    function sendHttpRequest (resolve, reject) {
      const id = ++requestId
      const perf = performance.now()
      const body = stringify(data)

      let xhr = new XMLHttpRequest()
      xhr.responseType = 'text'
      xhr.timeout = getConstant('REQUEST_TIMEOUT_SECONDS') * 1000
      xhr.onload = attachHandler(onData)
      xhr.onerror = attachHandler(onError)
      xhr.ontimeout = attachHandler(onTimeout)

      PubSub.publish('app.http.willrequest', {body, id, method, url})
      xhr.open(method, url)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xhr.send(body)

      function attachHandler (handler) {
        return function () {
          return handler(id, method, url, xhr).then(resolve, reject).then(onComplete)
        }
      }

      function onComplete () {
        const durationInMs = performance.now() - perf
        PubSub.publish('app.http.didcomplete', {durationInMs, id, method, url})
      }
    }
  )
}
