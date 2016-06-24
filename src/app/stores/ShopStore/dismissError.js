import {dismissError as dismiss} from 'app/stores/lib/dismissError'

export const dismissError = {
  register: dismiss.subscribe('app.shop.dismisserror')
}
