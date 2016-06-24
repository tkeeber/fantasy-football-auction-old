import { interpolateConstant } from 'app/lib/constants'
import { http } from 'app/lib/http'

export function install (payload) {
  const url = interpolateConstant('COMMISSIONING_ENDPOINT_INSTALL', {
    dallasId: payload.dallasId
  })
  return http.post(url, {})
}
