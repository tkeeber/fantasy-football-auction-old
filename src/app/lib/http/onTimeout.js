// 3rd party modules
import PubSub from 'pubsub-js'

// public
export function onTimeout (id, method, url, xhr) {
  PubSub.publish('app.http.didtimeout', { id, url })
  return fail(`Client timed out after ${xhr.timeout / 1000} seconds`)
}

function fail (reason) {
  return Promise.reject(new Error(reason))
}
