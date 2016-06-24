import { interpolateConstant } from 'app/lib/constants'
import { http } from 'app/lib/http'

export function decommission (payload) {
  const url = interpolateConstant('COMMISSIONING_ENDPOINT_DECOMMISSION', {
    dallasId: payload.dallasId
  })
  return http.post(url, {})
}
