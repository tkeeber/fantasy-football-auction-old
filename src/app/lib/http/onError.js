// 3rd party modules
import PubSub from 'pubsub-js'

// public
export function onError (id, method, url, xhr) {
  if (isConnectionError(xhr)) {
    return connectionError(id, method, url, xhr)
  }
  if (isTomcatError(xhr)) {
    return tomcatError(id, method, url, xhr)
  }
  return serverError(id, method, url, xhr)
}

function isConnectionError (xhr) {
  return xhr.status === 0
}

function connectionError (id, method, url, xhr) {
  const message = 'Address unreachable, could be offline or CORS'
  PubSub.publish('app.error.http.connection', {id, message, method, status: xhr.status, url})
  return fail(message)
}

function isTomcatError (xhr) {
  return `${xhr.response}`.indexOf('<title>Apache Tomcat') !== -1 && getErrorFromTomcat(xhr)
}

function tomcatError (id, method, url, xhr) {
  const message = getErrorFromTomcat(xhr)
  PubSub.publish('app.error.http.server', {id, message, method, status: xhr.status, url})
  return fail(message)
}

function getErrorFromTomcat (xhr) {
  const messages = `${xhr.response}`.match(/<u>([^<]+)<\/u>/g) || ['']
  return messages[0].replace(/<\/?u>/g, '')
}

function serverError (id, method, url, xhr) {
  const message = `Server failed with reason "${xhr.statusText}"`
  PubSub.publish('app.error.http.server', {id, message, method, status: xhr.status, url})
  return fail(message)
}

function fail (reason) {
  return Promise.reject(new Error(reason))
}
