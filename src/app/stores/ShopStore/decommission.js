import PubSub from 'pubsub-js'

import { decommission as decommissionResource } from 'app/resources/shop'

// public
export const decommission = {
  register: register
}

function register (store, shared) {
  store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
  store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

  function didAddFirstChangeListener () {
    PubSub.subscribe('app.shop.decommission', onDecommissionSsbt)
  }

  function didRemoveLastChangeListener () {
    PubSub.unsubscribe(onDecommissionSsbt)
  }

  function onDecommissionSsbt (topic, payload) {
    shared.data = shared.data.set('isLoading', true)
    store.emit('change')

    decommissionResource(payload)
      .then(onGetSuccess, onGetError)
      .then(onComplete)

    function onGetSuccess () {
      shared.data = shared.data.set('message', 'SSBT with Dallas ID: ' + payload.dallasId + ' has been successfully decommissioned.')
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
