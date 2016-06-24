import React from 'react'
import { shallow } from 'enzyme'

import { Header } from './index'

describe('<Header />', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow(
      <Header />
    )
  })

  it('should render with a title', () => {
    expect(wrapper.text()).toEqual('Football Auction')
  })
})
