// 3rd party modules
import PubSub from 'pubsub-js'

// public
let dismissError = {
  subscribe: createErrorDismisser
}

export {dismissError}

// implementation
function createErrorDismisser (eventType) {
  return function register (store, shared) {
    store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
    store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

    function didAddFirstChangeListener () {
      PubSub.subscribe(eventType, onDismissError)
    }

    function didRemoveLastChangeListener () {
      PubSub.unsubscribe(onDismissError)
    }

    function onDismissError () {
      shared.data = shared.data.merge({
        error: ''
      })
      store.emit('change')
    }
  }
}
