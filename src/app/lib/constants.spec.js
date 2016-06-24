/* eslint max-nested-callbacks: 0 */

import { getConstant, interpolateConstant } from './constants'

describe('lib/constants', () => {

  it('should export things', () => {
    expect(getConstant).toBeFunction()
    expect(interpolateConstant).toBeFunction()
  })

  it('gets a constant', () => {
    expect(getConstant('REQUEST_TIMEOUT_SECONDS')).toEqual(60)
  })

  it('throws if the constant does not exist', () => {
    expect(() => {
      getConstant('NONEXISTANT')
    }).toThrow()
  })

  it('interpolates constants', () => {
    expect(interpolateConstant('COMMISSIONING_ENDPOINT_SHOP', { shopId: 'my-shop-id'})).toEqual('api/v2/api/shops/my-shop-id/')
  })
})
