/* eslint max-nested-callbacks: 0 */

// modules
let mock = {
  'app/lib/constants': {
    getConstant () {}
  },
  'app/globals': {
    XMLHttpRequest () {},
    performance: {
      now () {}
    },
    Promise: window.Promise.bind(window)
  }
}

// subject
let shared = {
  httpLib: require('inject?app/lib/constants,app/globals!./index')(mock).http,
  xhr: {}
}

// spec
describe('lib/http', () => {
  beforeEach(() => {
    shared.xhr = {
      open () {},
      send () {},
      setRequestHeader () {}
    }
  })

  it('should be an object', () => {
    expect(shared.httpLib).toBeObject()
  })

  describe('get(url)', () => {
    describe('when provided a url', () => {
      beforeEach((done) => {
        spyOn(shared.xhr, 'open')
        spyOn(mock['app/globals'], 'XMLHttpRequest').and.callFake(() => shared.xhr)
        spyOn(mock['app/lib/constants'], 'getConstant').and.returnValue(12345)
        shared.xhr.send = () => {
          // make async otherwise shared.thenable will not be assigned
          // until after the nested describes have all run
          setTimeout(done, 0)
        }
        shared.thenable = shared.httpLib.get('/some/endpoint')
      })

      it('should request text', () => {
        expect(shared.xhr.responseType).toEqual('text')
      })

      it('should GET the correct url', () => {
        expect(shared.xhr.open).toHaveBeenCalledWith('GET', '/some/endpoint')
      })

      it('should set the correct request timeout in milliseconds', () => {
        expect(mock['app/lib/constants'].getConstant).toHaveBeenCalledWith('REQUEST_TIMEOUT_SECONDS')
        expect(shared.xhr.timeout).toEqual(12345 * 1000)
      })

      describe('when a response arrives', () => {
        describe('when server is unreachable', () => {
          beforeEach((done) => {
            shared.xhr.status = 0
            shared.xhr.statusText = ''
            shared.xhr.onerror()
            shared.onReject = jasmine.createSpy('http.get() onReject')
              .and
              .callFake(done)
            shared.thenable.then(null, shared.onReject)
          })

          it('should throw the expected error', () => {
            expect(shared.onReject).toHaveBeenCalledWith(new Error('Address unreachable, could be offline or CORS'))
          })
        })

        describe('when timing out', () => {
          beforeEach((done) => {
            shared.xhr.status = 0
            shared.xhr.statusText = ''
            shared.xhr.ontimeout()
            shared.onReject = jasmine.createSpy('http.get() onReject')
              .and
              .callFake(done)
            shared.thenable.then(null, shared.onReject)
          })

          it('should throw the expected error', () => {
            expect(shared.onReject).toHaveBeenCalledWith(new Error('Client timed out after 12345 seconds'))
          })
        })

        describe('when server errors', () => {
          describe('when error is a block of HTML from Tomcat', () => {
            beforeEach(() => {
              shared.tomcatError = require('../../../contracts/tomcat-error.html.js')
              shared.xhr.status = 500
              shared.xhr.statusText = 'Internal Server Error'
            })

            describe('when document structure is a format we do NOT understand', () => {

              beforeEach((done) => {
                shared.xhr.response = shared.tomcatError.replace(/<u>/g, '')
                shared.xhr.onload()
                shared.onReject = jasmine.createSpy('http.get() onReject')
                  .and
                  .callFake(done)
                shared.thenable.then(null, shared.onReject)
              })

              it('should throw a generic error', () => {
                expect(shared.onReject).toHaveBeenCalledWith(new Error('Server failed with reason "Internal Server Error"'))
              })
            })

            describe('when document structure is a format we DO understand', () => {

              beforeEach((done) => {
                shared.xhr.response = shared.tomcatError
                shared.xhr.onload()
                shared.onReject = jasmine.createSpy('http.get() onReject')
                  .and
                  .callFake(done)
                shared.thenable.then(null, shared.onReject)
              })

              it('should throw the error sent by Tomcat', () => {
                expect(shared.onReject).toHaveBeenCalledWith(new Error('Request processing failed; nested exception is GatewayException [httpStatus=400, errorCode=INVALID_INPUT, message=Barcode not found]'))
              })
            })
          })

          describe('when no information is provided', () => {
            beforeEach((done) => {
              shared.xhr.status = 500
              shared.xhr.statusText = 'Internal Server Error'
              shared.xhr.onload()
              shared.onReject = jasmine.createSpy('http.get() onReject')
                .and
                .callFake(done)
              shared.thenable.then(null, shared.onReject)
            })

            it('should throw the expected error', () => {
              expect(shared.onReject).toHaveBeenCalledWith(new Error('Server failed with reason "Internal Server Error"'))
            })
          })
        })

        describe('when url is not found', () => {
          beforeEach((done) => {
            shared.xhr.status = 404
            shared.xhr.statusText = 'File not found'
            shared.xhr.onload()
            shared.onReject = jasmine.createSpy('http.get() onReject')
              .and
              .callFake(done)
            shared.thenable.then(null, shared.onReject)
          })

          it('should throw the expected error', () => {
            expect(shared.onReject).toHaveBeenCalledWith(new Error('Server failed with reason "File not found"'))
          })
        })

        describe('when invalid JSON is received', () => {
          beforeEach((done) => {
            shared.xhr.status = 200
            shared.xhr.statusText = 'OK'
            shared.xhr.response = '{ "wut?": ,,, }'
            shared.xhr.onload()
            shared.onReject = jasmine.createSpy('http.get() onReject')
              .and
              .callFake(done)
            shared.thenable.then(null, shared.onReject)
          })

          it('should throw the expected error', () => {
            expect(shared.onReject).toHaveBeenCalledWith(new Error('Server returned invalid JSON'))
          })
        })

        describe('when valid JSON is received', () => {
          beforeEach((done) => {
            shared.xhr.status = 200
            shared.xhr.statusText = 'OK'
            shared.xhr.response = '{ "some": "data" }'
            shared.xhr.onload()
            shared.onResolve = jasmine.createSpy('http.get() onResolve')
              .and
              .callFake(done)
            shared.thenable.then(shared.onResolve)
          })

          it('should throw the expected error', () => {
            expect(shared.onResolve).toHaveBeenCalledWith({
              some: 'data'
            })
          })
        })
      })
    })
  })
})
