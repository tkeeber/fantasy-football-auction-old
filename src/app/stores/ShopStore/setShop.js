import PubSub from 'pubsub-js'
import Immutable from 'immutable'

import { getShop } from 'app/resources/shop'

// public
export const setShop = {
  register: register
}

function register (store, shared) {
  store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
  store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

  function didAddFirstChangeListener () {
    PubSub.subscribe('app.shop.set', onSetShop)
  }

  function didRemoveLastChangeListener () {
    PubSub.unsubscribe(onSetShop)
    shared.data = shared.data.merge({
      error: '',
      isLoading: false,
      shop: Immutable.Map()
    })
  }

  function onSetShop (topic, payload) {
    shared.data = shared.data.set('isLoading', true)
    store.emit('change')

    getShop(payload)
      .then(onGetSuccess, onGetError)
      .then(onComplete)

    function onGetSuccess (shop) {
      shared.data = shared.data.merge({shop: Immutable.Map(shop)})
    }

    function onGetError (err) {
      shared.data = shared.data.merge({
        error: err.message,
        shop: Immutable.Map()
      })
    }

    function onComplete () {
      shared.data = shared.data.set('isLoading', false)
      store.emit('change')
    }
  }
}
