// 3rd party modules
import PubSub from 'pubsub-js'

// public
export let dismissMessage = {
  subscribe: createMessageDismisser
}

// implementation
function createMessageDismisser (eventType) {
  return function register (store, shared) {
    store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
    store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

    function didAddFirstChangeListener () {
      PubSub.subscribe(eventType, onDismissMessage)
    }

    function didRemoveLastChangeListener () {
      PubSub.unsubscribe(onDismissMessage)
    }

    function onDismissMessage () {
      shared.data = shared.data.merge({
        message: ''
      })
      store.emit('change')
    }
  }
}
