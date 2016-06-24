import React from 'react'
import { shallow } from 'enzyme'

import { LoadingNotification } from './LoadingNotification'
import {LoadingIcon} from 'app/assets'

describe('<LoadingNotification />', function () {
  let wrapper

  beforeEach(function () {
    wrapper = shallow(
      <LoadingNotification />
    )
  })

  it('should render a LoadingIcon', () => {
    expect(wrapper.find(LoadingIcon).length).toEqual(1)
  })
})
