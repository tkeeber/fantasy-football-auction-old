/* eslint max-nested-callbacks: 0 */

describe('lib/errors', () => {
  let errors
  let mock
  let onErrorSpy
  beforeEach(() => {
    onErrorSpy = jasmine.createSpy('onerror spy')
    mock = {
      'pubsub-js': {
        publish: jasmine.createSpy('publish spy')
      },
      'app/globals': {
        w: {
          onerror: onErrorSpy
        }
      }
    }
    errors = require('inject!./errors')(mock)
  })

  it('should be an object', () => {
    expect(errors).toBeObject()
  })

  describe('monitor', () => {
    beforeEach(() => {
      errors.monitor()
      mock['app/globals'].w.onerror('msg', 'file', 'lineNo', 'colNo', new Error('meh'))
    })

    it('calls the original window.onerror', () => {
      expect(onErrorSpy).toHaveBeenCalledWith('msg', 'file', 'lineNo', 'colNo', new Error('meh'))
    })

    it('publishes \'app.error.uncaught\'', () => {
      expect(mock['pubsub-js'].publish).toHaveBeenCalled()
      expect(mock['pubsub-js'].publish.calls.argsFor(0)[0]).toEqual('app.error.uncaught')
    })
  })
})
