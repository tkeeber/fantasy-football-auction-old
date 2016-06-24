/* eslint max-nested-callbacks: 0 */

describe('lib/json', () => {
  let json

  beforeEach(() => {
    json = require('./json')
  })

  it('should be an object', () => {
    expect(json).toBeObject()
  })

  it('parses JSON', () => {
    const value = `
    {
      "some": "value"
    }
    `
    expect(json.parse(value)).toEqual({
      some: 'value'
    })
  })

  it('parses to null if the value is falsy', () => {
    expect(json.parse(null)).toEqual(null)
    expect(json.parse('')).toEqual(null)
    expect(json.parse(false)).toEqual(null)
  })

  it('does not throw if the JSON is invalid', () => {
    const invalidJSON = `
    {
      "some": "value"
    }}}}}}
    `
    expect(() => {
      json.parse(invalidJSON)
    }).not.toThrow()
    expect(json.parse(invalidJSON).message).toContain('Unexpected token')
  })

  it('serialises objects to JSON', () => {
    expect(json.stringify({ some: 'value'})).toEqual('{"some":"value"}')
  })
})
