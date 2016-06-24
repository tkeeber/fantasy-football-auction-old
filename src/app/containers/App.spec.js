import React from 'react'
import { shallow } from 'enzyme'

import { App } from './App'
import { Header } from 'app/components'

describe('<App />', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow(
      <App>
        <div>Hello</div>
      </App>
    )
  })

  it('renders a Header', () => {
    expect(wrapper.find(Header).length).toEqual(1)
  })

  it('renders its children', () => {
    expect(wrapper.find('div').length).toEqual(1)
    expect(wrapper.find('div').text()).toEqual('Hello')
  })
})
