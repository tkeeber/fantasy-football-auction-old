// 3rd party modules
import PubSub from 'pubsub-js'

// modules
import {parse} from 'app/lib/json'
import {onError} from './onError'

// public
export function onData (id, method, url, xhr) {
  if (isError(xhr)) {
    return onError(id, method, url, xhr)
  }
  let response = parse(xhr.response)
  if (isJsonError(response)) {
    return jsonError(id, method, url, xhr)
  }
  return Promise.resolve(response)
}

function isError (xhr) {
  return xhr.status >= 400
}

function isJsonError (response) {
  return response instanceof Error
}

function jsonError (id, method, url, xhr) {
  const message = 'Server returned invalid JSON'
  PubSub.publish('app.error.http.server', {id, message, method, status: xhr.status, url})
  return Promise.reject(new Error(message))
}
