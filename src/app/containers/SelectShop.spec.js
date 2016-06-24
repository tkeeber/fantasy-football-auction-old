import React from 'react'
import { shallow } from 'enzyme'

import { Component } from './SelectShop'
import { CreateManagerForm } from 'app/components'

describe('<SelectShop />', function () {
  let wrapper
  let props

  beforeEach(function () {
    props = {
      router: {
        push: jasmine.createSpy('router push spy')
      }
    }
    wrapper = shallow(
      <Component {...props} />
    )
  })

  it('should render a SelectShopForm', () => {
    expect(wrapper.find(CreateManagerForm).length).toEqual(1)
  })

  it('should navigate to the verify page when the rendered form is submitted', () => {
    wrapper.find(CreateManagerForm).props().onSubmit({
      shopId: 'selected-shop-id'
    })

    expect(props.router.push).toHaveBeenCalledWith('/shops/selected-shop-id/verify')
  })
})
