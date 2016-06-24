import PubSub from 'pubsub-js'
import Immutable from 'immutable'

// public
export const clearShop = {
  register: register
}

function register (store, shared) {
  store.addListener('didaddfirstchangelistener', didAddFirstChangeListener)
  store.addListener('didremovelastchangelistener', didRemoveLastChangeListener)

  function didAddFirstChangeListener () {
    PubSub.subscribe('app.shop.clear', onClearShop)
  }

  function didRemoveLastChangeListener () {
    PubSub.unsubscribe(onClearShop)
    shared.data = shared.data.merge({
      error: '',
      message: '',
      isLoading: false,
      shop: {}
    })
  }

  function onClearShop (topic, payload) {
    shared.data = shared.data.set('isLoading', true)
    shared.data = shared.data.set('shop', Immutable.fromJS({}))
    store.emit('change')
  }
}
