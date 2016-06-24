/* eslint max-nested-callbacks: 0 */

// 3rd party modules
const Immutable = require('immutable')

// spec
describe('stores/lib/dismissMessage', () => {

  let mock
  let shared

  beforeEach(() => {
    mock = {
      'pubsub-js': {
        subscribe: () => {},
        unsubscribe: () => {}
      }
    }
    shared = {
      mockStore: {
        addListener() {},
        emit() {}
      },
      mockShared: {
        data: Immutable.fromJS({
          message: '',
          isLoading: false,
          ssbts: []
        })
      },
      dismissMessage: require('inject!./dismissMessage')(mock).dismissMessage
    }
  })

  it('should be an object', () => {
    expect(shared.dismissMessage).toBeObject()
  })

  describe('subscribe(eventType)', () => {

    beforeEach(() => {
      shared.register = shared.dismissMessage.subscribe('app.foo.dismissMessage')
    })

    it('should return a function to bind functionality to a store', () => {
      expect(shared.register).toBeFunction()
    })

    describe('register(store, shared)', () => {

      describe('when invoked', () => {

        beforeEach(() => {
          spyOn(shared.mockStore, 'addListener')
          shared.register(shared.mockStore, shared.mockShared)
          shared.setUp = shared.mockStore.addListener.calls.first()
          shared.setUpEventName = shared.setUp.args[0]
          shared.setUpEventHandler = shared.setUp.args[1]
          shared.tearDown = shared.mockStore.addListener.calls.mostRecent()
          shared.tearDownEventName = shared.tearDown.args[0]
          shared.tearDownEventHandler = shared.tearDown.args[1]
        })

        it('should register handlers to activate the feature', () => {
          expect(shared.setUpEventName).toEqual('didaddfirstchangelistener')
          expect(shared.setUpEventHandler).toBeFunction()
        })

        it('should register handlers to tear down the feature', () => {
          expect(shared.tearDownEventName).toEqual('didremovelastchangelistener')
          expect(shared.tearDownEventHandler).toBeFunction()
        })

        describe('when store is activated', () => {

          beforeEach(() => {
            spyOn(mock['pubsub-js'], 'subscribe')
            shared.setUpEventHandler()
            shared.onDismissMessage = mock['pubsub-js'].subscribe.calls.mostRecent()
            shared.onDismissMessageEventName = shared.onDismissMessage.args[0]
            shared.onDismissMessageEventHandler = shared.onDismissMessage.args[1]
          })

          it('should listen for requests to dismiss an message', () => {
            expect(shared.onDismissMessageEventName).toEqual('app.foo.dismissMessage')
            expect(shared.onDismissMessageEventHandler).toBeFunction()
          })

          describe('when a request is made to dismiss an message', () => {
            beforeEach(() => {
              spyOn(shared.mockStore, 'emit')
              shared.mockShared.data = shared.mockShared.data.set('message', 'wut?')
              shared.onDismissMessageEventHandler()
            })

            it('should put the store back into a default state', () => {
              expect(shared.mockStore.emit).toHaveBeenCalledWith('change')
              expect(shared.mockShared.data.toJS()).toEqual({
                message: '',
                isLoading: false,
                ssbts: []
              })
            })

          })

          describe('when store is deactivated', () => {

            beforeEach(() => {
              spyOn(mock['pubsub-js'], 'unsubscribe')
              shared.tearDownEventHandler()
            })

            it('should stop listening for requests to lock an SSBT', () => {
              expect(mock['pubsub-js'].unsubscribe).toHaveBeenCalledWith(shared.onDismissMessageEventHandler)
            })

          })

        })

      })

    })

  })

})
