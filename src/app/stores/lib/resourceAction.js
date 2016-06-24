// 3rd party modules
import PubSub from 'pubsub-js'

// public
let resourceAction = {
  subscribe: createResourceAction
}

export {resourceAction}

// implementation
function createResourceAction ({ eventType, onError = noOp, onSuccess = noOp, promise, shared, store }) {
  store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
  store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

  function didAddFirstChangeListener () {
    PubSub.subscribe(eventType, onEvent)
  }

  function didRemoveLastChangeListener () {
    PubSub.unsubscribe(onEvent)
  }

  function onEvent (topic, evData) {
    shared.data = shared.data.set('isLoading', true)
    store.emit('change')

    promise(evData)
      .then(_onSuccess, _onError)
      .then(_onComplete)

    function _onSuccess (response) {
      onSuccess(response, evData, shared)
    }

    function _onError (err) {
      shared.data = shared.data.merge({
        error: err.message
      })
      onError(err, evData)
    }

    function _onComplete () {
      shared.data = shared.data.set('isLoading', false)
      store.emit('change')
    }
  }
}

function noOp () {}
