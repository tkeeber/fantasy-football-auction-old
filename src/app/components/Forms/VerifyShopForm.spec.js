import React from 'react'
import Immutable from 'immutable'
import { shallow, mount } from 'enzyme'

import { Link } from 'react-router'

import { VerifyShopForm } from './VerifyShopForm'
import { ShopInfo } from 'app/components'

describe('<VerifyShopForm />', function () {
  let wrapper
  let props

  beforeEach(function () {
    props = {
      shop: Immutable.fromJS({
        shopId: 'my-shop-id',
        shopName: 'Shop Name'
      })
    }
    wrapper = shallow(
      <VerifyShopForm {...props} />
    )
  })

  describe('rendering', () => {

    it('renders a ShopInfo', () => {
      expect(wrapper.find(ShopInfo).length).toEqual(1)
      expect(wrapper.find(ShopInfo).props().shop).toEqual(props.shop)
    })

    it('renders a continue link', () => {
      expect(wrapper.find(Link).at(0).props().to).toEqual('/shops/my-shop-id/')
    })

    it('renders a start over link', () => {
      expect(wrapper.find(Link).at(1).props().to).toEqual('/')
    })
  })

  describe('focusing on the continue button', () => {
    let VerifyShopForm
    let mock

    it('should set focus on the continue button when mounted', () => {
      const focusSpy = jasmine.createSpy('focus spy')
      mock = {
        'react-dom': {
          findDOMNode: () => ({
            focus: focusSpy
          })
        }
      }
      VerifyShopForm = require('inject!./VerifyShopForm')(mock).VerifyShopForm
      props = {
        shop: Immutable.fromJS({
          shopId: 'my-shop-id'
        })
      }
      wrapper = mount(
        <VerifyShopForm {...props} />
      )
      expect(focusSpy).toHaveBeenCalledWith()
    })
  })
})
