
describe('lib/log', () => {
  let mock
  let log

  beforeEach(() => {
    mock = {
      'pubsub-js': {
        subscribe: jasmine.createSpy('subscribe spy')
      },
      'app/globals': {
        console: {
          info: jasmine.createSpy('console info spy'),
          error: jasmine.createSpy('console error spy')
        }
      }
    }
    log = require('inject!./log')(mock)
  })

  it('should be an object', () => {
    expect(log).toBeObject()
  })

  describe('recordEvents', () => {
    it('should subscribe to \'app\' events', () => {
      const recordEvents = log.recordEvents

      recordEvents()

      expect(mock['pubsub-js'].subscribe).toHaveBeenCalled()
      expect(mock['pubsub-js'].subscribe.calls.argsFor(0)[0]).toEqual('app')
    })

    it('should log \'app.error\' events to console.error', () => {
      log.recordEvents()
      // Call the event handler
      const errorPayload = { some: 'error' }
      mock['pubsub-js'].subscribe.calls.argsFor(0)[1]('app.error.someerror', errorPayload)

      expect(mock['app/globals'].console.error).toHaveBeenCalledWith('app.error.someerror', errorPayload)
    })

    it('should log other events to console.info', () => {
      log.recordEvents()
      // Call the event handler
      const payload = { some: 'info' }
      mock['pubsub-js'].subscribe.calls.argsFor(0)[1]('app.some.event', payload)

      expect(mock['app/globals'].console.info).toHaveBeenCalledWith('app.some.event', payload)
    })
  })
})
