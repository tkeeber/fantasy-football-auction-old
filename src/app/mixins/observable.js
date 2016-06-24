import {EventEmitter} from 'events'

export {observe as decorate}

// implementation
function observe (api) {
  Object.assign(api, EventEmitter.prototype)
  api.addListener = wrapAddRemoveListener(api, 0, addFirstListener, api.addListener.bind(api))
  api.removeListener = wrapAddRemoveListener(api, 1, removeLastListener, api.removeListener.bind(api))
  api.on = api.addListener
  return api
}

function wrapAddRemoveListener (emitter, count, wrapped, original) {
  return function wrappedAddRemoveListener (event, handler) {
    if (emitter.listeners(event).length === count) {
      wrapped(emitter, event, handler)
    } else {
      original(event, handler)
    }
  }
}

function addFirstListener (emitter, event, handler) {
  emitter.emit(`willaddfirst${event}listener`)
  EventEmitter.prototype.addListener.call(emitter, event, handler)
  emitter.emit(`didaddfirst${event}listener`)
}

function removeLastListener (emitter, event, handler) {
  emitter.emit(`willremovelast${event}listener`)
  EventEmitter.prototype.removeListener.call(emitter, event, handler)
  emitter.emit(`didremovelast${event}listener`)
}
