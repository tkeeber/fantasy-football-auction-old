import Immutable from 'immutable'
import { setShop } from './setShop'
import { clearShop } from './clearShop'
import { commission } from './commission'
import { decommission } from './decommission'
import { install } from './install'
import { dismissError } from './dismissError'
import { dismissMessage } from './dismissMessage'
import { decorate } from 'app/mixins/observable'

// modules
const features = [
  setShop,
  clearShop,
  commission,
  decommission,
  install,
  dismissError,
  dismissMessage
]

// private
let shared = {
  data: Immutable.fromJS({
    error: '',
    message: '',
    isLoading: false,
    shop: {}
  })
}

// public
export const ShopStore = decorate({
  get: () => shared.data
})

// implementation
features.forEach(
  (feature) => feature.register(ShopStore, shared)
)
