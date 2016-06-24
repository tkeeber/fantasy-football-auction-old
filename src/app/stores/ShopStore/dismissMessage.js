import { dismissMessage as dismiss } from 'app/stores/lib/dismissMessage'

export const dismissMessage = {
  register: dismiss.subscribe('app.shop.dismissmessage')
}
