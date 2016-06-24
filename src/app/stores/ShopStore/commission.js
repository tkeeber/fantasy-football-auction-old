import PubSub from 'pubsub-js'

import { commission as commissionResource } from 'app/resources/shop'

// public
export const commission = {
  register: register
}

function register (store, shared) {
  store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
  store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

  function didAddFirstChangeListener () {
    PubSub.subscribe('app.shop.commission', onCommissionSsbt)
  }

  function didRemoveLastChangeListener () {
    PubSub.unsubscribe(onCommissionSsbt)
  }

  function onCommissionSsbt (topic, payload) {
    shared.data = shared.data.set('isLoading', true)
    store.emit('change')

    commissionResource(payload)
      .then(onGetSuccess, onGetError)
      .then(onComplete)

    function onGetSuccess () {
      shared.data = shared.data.set('message', 'SSBT with Dallas ID: ' + payload.dallasId + ' has been successfully added to this branch.')
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
