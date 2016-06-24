// modules
var shared = {}
var mock = {}

// subject
var observable = require('./observable')

// spec
describe('mixins/observable', () => {

  it('should be an object', () => {
    expect(observable).toBeObject()
  })

  describe('decorate(object)', () => {

    describe('when supplied an object', () => {

      beforeEach(() => {
        shared.emitter = observable.decorate({})
      })

      it('should provide the expected API', () => {
        expect(shared.emitter.addListener).toBeFunction()
        expect(shared.emitter.emit).toBeFunction()
        expect(shared.emitter.removeListener).toBeFunction()
      })

      describe('emitter.addListener(fn)', () => {

        beforeEach(() => {
          shared.handler = jasmine.createSpy('handler')
        })

        describe('when lifecycle methods ARE defined', () => {

          beforeEach(() => {
            shared.handlerCountAtCallTime = {}
            createLifecycleSpy('willaddfirstchangelistener')
            createLifecycleSpy('didaddfirstchangelistener')
            createLifecycleSpy('willremovelastchangelistener')
            createLifecycleSpy('didremovelastchangelistener')
          })

          describe('when the first listener is added', () => {

            beforeEach(() => {
              shared.emitter.addListener('change', shared.handler)
            })

            it('should invoke emitter.willAddFirstListener directly before', () => {
              expect(shared.willaddfirstchangelistener).toHaveBeenCalled()
              expect(shared.handlerCountAtCallTime.willaddfirstchangelistener).toEqual(0)
            })

            it('should invoke emitter.didAddFirstListener directly after', () => {
              expect(shared.didaddfirstchangelistener).toHaveBeenCalled()
              expect(shared.handlerCountAtCallTime.didaddfirstchangelistener).toEqual(1)
            })

            describe('when an event is emitted', () => {

              beforeEach(() => {
                shared.emitter.emit('change', 123456)
              })

              it('should provide each handler with the event payload', () => {
                expect(shared.handler).toHaveBeenCalledWith(123456)
              })

            })

            describe('when the last listener is removed', () => {

              beforeEach(() => {
                shared.emitter.removeListener('change', shared.handler)
              })

              it('should invoke emitter.willRemoveLastListener directly before', () => {
                expect(shared.willremovelastchangelistener).toHaveBeenCalled()
                expect(shared.handlerCountAtCallTime.willremovelastchangelistener).toEqual(1)
              })

              it('should invoke emitter.didRemoveLastListener directly after', () => {
                expect(shared.didremovelastchangelistener).toHaveBeenCalled()
                expect(shared.handlerCountAtCallTime.didremovelastchangelistener).toEqual(0)
              })

            })

          })

        })

        describe('when lifecycle methods are NOT defined', () => {

          describe('when the first listener is added', () => {

            beforeEach(function() {
              try {
                shared.emitter.addListener('change', shared.handler)
              } catch (e) {
                shared.didError = true
              }
            })

            it('should not error for missing lifecycle methods', () => {
              expect(shared.didError).not.toBeTrue()
            })

            describe('when an event is emitted', () => {

              beforeEach(() => {
                shared.emitter.emit('change', 654321)
              })

              it('should provide each handler with the event payload', () => {
                expect(shared.handler).toHaveBeenCalledWith(654321)
              })

            })

            describe('when the last listener is removed', () => {

              beforeEach(function() {
                try {
                  shared.emitter.removeListener('change', shared.handler)
                } catch (e) {
                  shared.didError = true
                }
              })

              it('should not error for missing lifecycle methods', () => {
                expect(shared.didError).not.toBeTrue()
              })

            })

          })

        })

      })

    })

  })

  // helpers
  function createLifecycleSpy(name) {
    shared[name] = jasmine.createSpy(name + ' handler')
      .and
      .callFake(() => {
        shared.handlerCountAtCallTime[name] = shared.emitter.listeners('change').length
      })
    shared.emitter.addListener(name, shared[name])
  }

})
