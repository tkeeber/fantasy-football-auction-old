const env = 'api'
const COMMISSIONING = {
  COMMISSIONING_ENDPOINT_SHOP: env + '/v2/api/shops/{shopId}/',
  COMMISSIONING_ENDPOINT_COMMISSION: env + '/v2/api/ssbts',
  COMMISSIONING_ENDPOINT_DECOMMISSION: env + '/v2/api/ssbts/{dallasId}?installStatus=DECOMMISSIONED',
  COMMISSIONING_ENDPOINT_INSTALL: env + '/v2/api/completeInstall/{dallasId}',

  // general
  REQUEST_TIMEOUT_SECONDS: 60
}

export function getConstant (name) {
  const value = COMMISSIONING[name]
  if (typeof value === 'undefined') {
    throw new Error(`COMMISSIONING["${name}"] is undefined`)
  }
  return value
}

export function interpolateConstant (name, values) {
  return Object.keys(values)
    .reduce((template, token) => template.split(`{${token}}`).join(values[token]),
      getConstant(name))
}
