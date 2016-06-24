import Immutable from 'immutable'

describe('lib/ShopStore/commission', () => {

  let mock
  let store
  let commission
  let shared = {
    data: Immutable.fromJS({})
  }

  beforeEach(() => {
    mock = {
      'pubsub-js': {
        subscribe: jasmine.createSpy('subscribe spy'),
        unsubscribe: jasmine.createSpy('unsubscribe spy')
      },
      'app/resources/shop': {
        commission: jasmine.createSpy('commission spy')
      }
    }
    commission = require('inject!./commission')(mock).commission
    store = {
      addListener: jasmine.createSpy('addListener spy'),
      emit: jasmine.createSpy('emit spy')
    }
  })

  describe('on register', () => {
    beforeEach(() => {
      commission.register(store, shared)
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

      it('subscribes to \'app.shop.commission\'', () => {
        expect(mock['pubsub-js'].subscribe.calls.count()).toEqual(1)
        expect( mock['pubsub-js'].subscribe.calls.argsFor(0)[0]).toEqual('app.shop.commission')
      })

      describe('when \'app.shop.commission\' is published', () => {
        let promiseResolver
        let promiseRejector
        let promise
        let pubsubHandler

        let payload = {
          dallasId: 'my-dallas-id'
        }

        beforeEach(() => {
          promise = new Promise((resolve, reject) => {
            promiseResolver = resolve
            promiseRejector = reject
          })
          pubsubHandler = mock['pubsub-js'].subscribe.calls.argsFor(0)[1]
          mock['app/resources/shop'].commission.and.returnValue(promise)

          // Execute the handler
          pubsubHandler('topic', payload)
        })

        describe('before the request returns a result', () => {
          it('passes the payload into commissionResouce', () => {
            expect(mock['app/resources/shop'].commission).toHaveBeenCalledWith(payload)
          })

          it('should set isLoading to true on shared', () => {
            expect(shared.data.get('isLoading')).toEqual(true)
          })

          it('should emit a change', () => {
            expect(store.emit).toHaveBeenCalledWith('change')
          })

          afterEach(() => {
            // Release any resouses, just in case
            promiseResolver()
          })
        })

        describe('when the commission request is successful', () => {
          beforeEach((done) => {
            store.emit.calls.reset()
            store.emit.and.callFake(done)
            promiseResolver()
          })

          it('sets isLoading to false', () => {
            expect(shared.data.get('isLoading')).toEqual(false)
          })

          it('sets message to the dallasId in the payload', () => {
            expect(shared.data.get('message')).toEqual('SSBT with Dallas ID: ' + payload.dallasId + ' has been successfully added to this branch.')
          })

          it('emits a change on the store', () => {
            expect(store.emit).toHaveBeenCalledWith('change')
          })
        })

        describe('when the commission request fails', () => {
          beforeEach((done) => {
            store.emit.calls.reset()
            store.emit.and.callFake(done)
            promiseRejector(new Error('meh'))
          })

          it('sets isLoading to false', () => {
            expect(shared.data.get('isLoading')).toEqual(false)
          })

          it('sets error', () => {
            expect(shared.data.get('error')).toEqual('meh')
          })

          it('emits a change on the store', () => {
            expect(store.emit.calls.count()).toEqual(1)
          })
        })

        describe('on didremovelastchangelistener', () => {
          let didremovelastchangelistenerHandler

          beforeEach(() => {
            didremovelastchangelistenerHandler = store.addListener.calls.argsFor(1)[1]
            didremovelastchangelistenerHandler()
          })

          it('unsubscribes the \'app.shop.commission\' handler', () => {
            expect(mock['pubsub-js'].unsubscribe).toHaveBeenCalledWith(pubsubHandler)
          })
        })
      })
    })
  })
})