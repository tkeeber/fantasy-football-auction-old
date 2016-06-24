import { getConstant } from 'app/lib/constants'
import { http } from 'app/lib/http'

export function commission (payload) {
  const url = getConstant('COMMISSIONING_ENDPOINT_COMMISSION')
  return http.post(url, {
    shopId: payload.shopId,
    dallasId: payload.dallasId
  })
}
