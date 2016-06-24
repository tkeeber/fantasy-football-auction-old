/* eslint max-nested-callbacks: 0 */

// 3rd party modules
const Immutable = require('immutable')

// spec
describe('stores/lib/resourceAction', () => {

  let mock
  let shared

  beforeEach(() => {
    mock = {
      'pubsub-js': {
        subscribe() {},
        unsubscribe() {}
      }
    }
    shared = {
      promise: {
        resourceAction: {}
      },
      mockStore: {
        addListener() {},
        emit() {}
      },
      mockShared: {
        data: Immutable.fromJS({
          error: '',
          isLoading: false
        })
      },
      resourceAction: require('inject!./resourceAction')(mock).resourceAction
    }
  })

  it('should be an object', () => {
    expect(shared.resourceAction).toBeObject()
  })

  describe('subscribe({ eventType, onError, onSuccess, promise, shared, store })', () => {

    describe('when onError and onSuccess handlers are NOT provided', () => {
      describeResourceAction(false)
    })

    describe('when onError and onSuccess handlers ARE provided', () => {
      describeResourceAction(true)
    })

  })

  function describeResourceAction (hasHandlers) {
    beforeEach(() => {
      if (hasHandlers) {
        shared.options = {
          eventType: 'app.some.event',
          onError: jasmine.createSpy('onError'),
          onSuccess: jasmine.createSpy('onSuccess'),
          promise: jasmine.createSpy('promise'),
          shared: shared.mockShared,
          store: shared.mockStore
        }
      } else {
        shared.options = {
          eventType: 'app.some.event',
          promise: jasmine.createSpy('promise'),
          shared: shared.mockShared,
          store: shared.mockStore
        }
      }
      spyOn(shared.mockStore, 'addListener')
      shared.resourceAction.subscribe(shared.options)
      shared.setUpEventName = shared.mockStore.addListener.calls.first().args[0]
      shared.setUpEventHandler = shared.mockStore.addListener.calls.first().args[1]
      shared.tearDownEventName = shared.mockStore.addListener.calls.mostRecent().args[0]
      shared.tearDownEventHandler = shared.mockStore.addListener.calls.mostRecent().args[1]
    })

    it('should bind itself to the store', () => {
      expect(shared.setUpEventName).toEqual('didaddfirstchangelistener')
      expect(shared.setUpEventHandler).toBeFunction()
      expect(shared.tearDownEventName).toEqual('didremovelastchangelistener')
      expect(shared.tearDownEventHandler).toBeFunction()
    })

    describe('when the store becomes active', () => {

      beforeEach(() => {
        spyOn(mock['pubsub-js'], 'subscribe')
        shared.setUpEventHandler()
        shared.eventType = mock['pubsub-js'].subscribe.calls.mostRecent().args[0]
        shared.eventHandler = mock['pubsub-js'].subscribe.calls.mostRecent().args[1]
      })

      it('should listen for the required user action', () => {
        expect(shared.eventType).toEqual('app.some.event')
        expect(shared.eventHandler).toBeFunction()
      })

      describe('when the store becomes inactive', () => {

        beforeEach(() => {
          spyOn(mock['pubsub-js'], 'unsubscribe')
          shared.tearDownEventHandler()
        })

        it('should listen for the required user action', () => {
          expect(mock['pubsub-js'].unsubscribe).toHaveBeenCalledWith(shared.eventHandler)
        })

      })

      describe('when the provided user action is published', () => {

        beforeEach(() => {
          shared.createdPromise = new Promise((resolve, reject) => {
            shared.resolve = resolve
            shared.reject = reject
          })
          shared.options.promise.and.returnValue(shared.createdPromise)
          shared.eventHandler('app.some.event', { some: 'payload' })
        })

        it('should pass the event data to the promise factory', () => {
          expect(shared.options.promise).toHaveBeenCalledWith({ some: 'payload' })
        })

        it('should put the store in a loading state', () => {
          expect(shared.mockShared.data.toJS()).toEqual({
            error: '',
            isLoading: true
          })
        })

        describe('when the promise resolves', () => {

          beforeEach((done) => {
            shared.resolve({ some: 'response' })
            shared.eventHandler('app.some.event', { some: 'payload' })
            setTimeout(done, 0)
          })

          if (hasHandlers) {
            it('should pass the response and event data to the success handler', () => {
              expect(shared.options.onSuccess).toHaveBeenCalled()
            })
          }

          it('should put the store in a valid, non-loading state', () => {
            expect(shared.mockShared.data.toJS()).toEqual({
              error: '',
              isLoading: false
            })
          })

        })

        describe('when the promise rejects', () => {

          beforeEach((done) => {
            shared.reject(new Error('wut?'))
            shared.eventHandler('app.some.event', { some: 'payload' })
            setTimeout(done, 0)
          })

          if (hasHandlers) {
            it('should pass the response and event data to the success handler', () => {
              expect(shared.options.onError).toHaveBeenCalledWith(new Error('wut?'), { some: 'payload' })
            })
          }

          it('should put the store in a broken, non-loading state', () => {
            expect(shared.mockShared.data.toJS()).toEqual({
              error: 'wut?',
              isLoading: false
            })
          })

        })

      })

    })

  }

})
