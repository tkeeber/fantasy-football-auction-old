import PubSub from 'pubsub-js'

import { install as installResource } from 'app/resources/shop'

// public
export const install = {
  register: register
}

function register (store, shared) {
  store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
  store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

  function didAddFirstChangeListener () {
    PubSub.subscribe('app.shop.install', onInstallSsbt)
  }

  function didRemoveLastChangeListener () {
    PubSub.unsubscribe(onInstallSsbt)
  }

  function onInstallSsbt (topic, payload) {
    shared.data = shared.data.set('isLoading', true)
    store.emit('change')

    installResource(payload)
      .then(onGetSuccess, onGetError)
      .then(onComplete)

    function onGetSuccess () {
      shared.data = shared.data.set('message', 'SSBT with Dallas ID: ' + payload.dallasId + ' has been successfully installed.')
    }

    function onGetError (err) {
      shared.data = shared.data.merge({
        error: err.message
      })
    }

    function onComplete () {
      shared.data = shared.data.set('isLoading', false)
      store.emit('change')
    }
  }
}
