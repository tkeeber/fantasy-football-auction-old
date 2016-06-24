import Immutable from 'immutable'
// import { clearShop } from './clearShop'

describe('lib/ShopStore/clearShop', () => {

  let mock
  let store
  let clearShop
  let shared = {
    data: Immutable.fromJS({})
  }

  beforeEach(() => {
    mock = {
      'pubsub-js': {
        subscribe: jasmine.createSpy('subscribe spy'),
        unsubscribe: jasmine.createSpy('unsubscribe spy')
      }
    }
    clearShop = require('inject!./clearShop')(mock).clearShop
    store = {
      addListener: jasmine.createSpy('addListener spy'),
      emit: jasmine.createSpy('emit spy')
    }
  })

  describe('on register', () => {
    beforeEach(() => {
      clearShop.register(store, shared)
    })

    it('adds didaddfirstchangelistener and didremovelastchangelistener handlers', () => {
      expect(store.addListener.calls.count()).toEqual(2)
      expect(store.addListener.calls.argsFor(0)[0]).toEqual('didaddfirstchangelistener')
      expect(store.addListener.calls.argsFor(1)[0]).toEqual('didremovelastchangelistener')
    })

    describe('when a firstchangelistener is added', () => {
      let didaddfirstchangelistenerHandler

      beforeEach(() => {
        didaddfirstchangelistenerHandler = store.addListener.calls.argsFor(0)[1]
        didaddfirstchangelistenerHandler()
      })

      it('subscribes to \'app.shop.clear\'', () => {
        expect(mock['pubsub-js'].subscribe.calls.count()).toEqual(1)
        expect( mock['pubsub-js'].subscribe.calls.argsFor(0)[0]).toEqual('app.shop.clear')
      })

      describe('when \'app.shop.clear\' is published', () => {
        let pubsubHandler
        beforeEach(() => {
          pubsubHandler = mock['pubsub-js'].subscribe.calls.argsFor(0)[1]
          pubsubHandler()
        })

        it('sets isLoading to true and shop to an empty object in shared', () => {
          expect(shared.data.get('isLoading')).toEqual(true)
          expect(shared.data.get('shop')).toEqual(Immutable.Map({}))
        })

        it('emits a change on the store', () => {
          expect(store.emit).toHaveBeenCalledWith('change')
        })

        describe('on didremovelastchangelistener', () => {
          let didremovelastchangelistenerHandler

          beforeEach(() => {
            didremovelastchangelistenerHandler = store.addListener.calls.argsFor(1)[1]
            didremovelastchangelistenerHandler()
          })

          it('unsubscribes the \'app.shop.clear\' handler', () => {
            expect(mock['pubsub-js'].unsubscribe).toHaveBeenCalledWith(pubsubHandler)
          })

          it('resets shared', () => {
            expect(shared.data.get('isLoading')).toEqual(false)
            expect(shared.data.get('error')).toEqual('')
            expect(shared.data.get('message')).toEqual('')
            expect(shared.data.get('shop')).toEqual(Immutable.Map({}))
          })
        })
      })
    })
  })
})