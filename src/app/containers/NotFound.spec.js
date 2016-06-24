import React from 'react'
import { shallow } from 'enzyme'

import { NotFound } from './NotFound'
import { Link } from 'react-router'

describe('<NotFound />', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow(
      <NotFound />
    )
  })

  it('should render a user friendly notification', () => {
    expect(wrapper.find('h2').text()).toEqual('Oops. That url is not recognised')
  })

  it('should render a Link back to the base route', () => {
    expect(wrapper.find(Link).length).toEqual(1)
    expect(wrapper.find(Link).props().to).toEqual('/')

  })
})
