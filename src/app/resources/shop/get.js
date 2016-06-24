import { interpolateConstant } from 'app/lib/constants'
import { http } from 'app/lib/http'

export function getShop (payload) {
  const url = interpolateConstant('COMMISSIONING_ENDPOINT_SHOP', {
    shopId: payload.shopId
  })
  return http.get(url)
}
