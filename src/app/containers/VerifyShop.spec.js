import React from 'react'
import { shallow, mount } from 'enzyme'
import Immutable from 'immutable'

import { Link } from 'react-router'
import {
    VerifyShopForm,
    ErrorNotification,
    LoadingNotification
} from 'app/components'

describe('<VerifyShop />', function () {
  let mock
  let Component
  let wrapper
  let props

  beforeEach(function () {
    mock = {
      'pubsub-js': {
        publish: jasmine.createSpy('on publish spy')
      }
    }
    Component = require('inject!./VerifyShop')(mock).Component
    props = {
      shop: Immutable.fromJS({
        shopId: 'my-shop-id'
      }),
      router: {
        push: jasmine.createSpy('router push spy')
      }
    }
    wrapper = shallow(
      <Component {...props} />
    )
  })

  describe('rendering', () => {
    it('renders VerifyShopForm', () => {
      expect(wrapper.find(VerifyShopForm).length).toEqual(1)
      expect(wrapper.find(VerifyShopForm).props().shop).toEqual(props.shop)
    })
  })

  describe('errors', () => {
    describe('when there is no error', () => {
      it('should not render an ErrorNotification', () => {
        expect(wrapper.find(ErrorNotification).length).toEqual(0)
      })
    })

    describe('when there is an error', () => {
      beforeEach(() => {
        props = Object.assign({}, props, { error: 'error message' })
        wrapper = shallow(
          <Component {...props} />
        )
      })

      it('renders the error message in an ErrorNotification', () => {
        expect(wrapper.find(ErrorNotification).length).toEqual(1)
        expect(wrapper.find(ErrorNotification).props().message).toEqual('error message')
      })

      it('does not render VerifyShopForm', () => {
        expect(wrapper.find(VerifyShopForm).length).toEqual(0)
      })

      describe('when the error is dismissed', () => {
        it('should publish \'app.shop.dismisserror\'', () => {
          wrapper.find(ErrorNotification).props().onDismiss()

          expect(mock['pubsub-js'].publish).toHaveBeenCalledWith('app.shop.dismisserror')
        })
        it('should navigate the user back to the select shop screen', () => {
          wrapper.find(ErrorNotification).props().onDismiss()

          expect(props.router.push).toHaveBeenCalledWith('/')
        })
      })
    })
  })

  describe('loading', () => {
    describe('when not loading', () => {
      it('should not render an LoadingNotification', () => {
        expect(wrapper.find(LoadingNotification).length).toEqual(0)
      })
    })

    describe('when loading', () => {
      beforeEach(() => {
        props = Object.assign({}, props, { isLoading: true })
        wrapper = shallow(
          <Component {...props} />
        )
      })

      it('renders the error message in a LoadingNotification', () => {
        expect(wrapper.find(LoadingNotification).length).toEqual(1)
      })

      it('does not render VerifyShopForm', () => {
        expect(wrapper.find(VerifyShopForm).length).toEqual(0)
      })
    })
  })
})
