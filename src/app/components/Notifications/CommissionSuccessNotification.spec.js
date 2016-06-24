import React from 'react'
import { shallow } from 'enzyme'

import { CommissionSuccessNotification } from './CommissionSuccessNotification'

describe('<CommissionSuccessNotification />', function () {
  let wrapper
  let props = {
    message: 'notification message',
    onDismiss: jasmine.createSpy('on dismiss spy')
  }

  beforeEach(function () {
    wrapper = shallow(
      <CommissionSuccessNotification {...props} />
    )
  })

  it('should render a notification for the user', () => {
    expect(wrapper.text()).toContain('notification message')
  })

  it('should render a dismiss button', () => {
    expect(wrapper.find('button').length).toEqual(1)
  })

  it('should call onDismiss when the button is clicked', () => {
    wrapper.find('button').simulate('click')

    expect(props.onDismiss).toHaveBeenCalledWith()
  })
})
