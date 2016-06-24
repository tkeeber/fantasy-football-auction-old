import React from 'react'
import { shallow } from 'enzyme'

import { ErrorNotification } from './ErrorNotification'

describe('<ErrorNotification />', function () {
  let wrapper
  let props = {
    message: 'error message'
  }

  beforeEach(function () {
    wrapper = shallow(
      <ErrorNotification {...props} />
    )
  })
  
  it('should render the error message', () => {
    expect(wrapper.text()).toContain('error message')
  })
  
  it('should render a Dismiss button', () => {
    expect(wrapper.find('button').length).toEqual(1)
    expect(wrapper.find('button').text()).toEqual('Dismiss')
  })
})
