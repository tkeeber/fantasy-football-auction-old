import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

import { ShopInfo } from './index'

describe('<ShopInfo />', function () {
  let wrapper
  let props = {
    shop: Immutable.fromJS({
      shopId: 'my-shop-id'
    })
  }

  beforeEach(function () {
    wrapper = shallow(
      <ShopInfo {...props} />
    )
  })

  it('should render the shop details', () => {
    expect(wrapper.text()).toContain('my-shop-id')
  })
})
