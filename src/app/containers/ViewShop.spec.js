import React from 'react'
import { shallow, mount } from 'enzyme'
import Immutable from 'immutable'

import { Link } from 'react-router'
import {
  ShopInfo,
  CommissionSuccessNotification,
  CommissioningForm,
  ErrorNotification,
  LoadingNotification
} from 'app/components'

describe('<ViewShop />', function () {
  let mock
  let ViewShop
  let wrapper
  let props

  beforeEach(function () {
    mock = {
      'pubsub-js': {
        publish: jasmine.createSpy('on publish spy')
      }
    }
    ViewShop = require('inject!./ViewShop')(mock).ViewShop
    props = {
      shop: Immutable.fromJS({
        shopId: 'my-shop-id'
      })
    }
    wrapper = shallow(
      <ViewShop {...props} />
    )
  })

  describe('rendering', () => {
    it('renders ShopInfo', () => {
      expect(wrapper.find(ShopInfo).length).toEqual(1)
      expect(wrapper.find(ShopInfo).props().shop).toEqual(props.shop)
    })

    it('renders a start over button', () => {
      const button = wrapper.find(Link).at(0)

      expect(button.props().to).toEqual('/')
    })

    it('renders a CommissioningForm', () => {
      expect(wrapper.find(CommissioningForm).length).toEqual(1)
    })
  })

  describe('commissioning', () => {
    describe('when the commissioning form is submitted', () => {
      it('should publish \'app.shop.commission\' with the dallasId and shopId', () => {
        wrapper.find(CommissioningForm).props().onSubmit({
          dallasId: 'my-dallas-id'
        })

        expect(mock['pubsub-js'].publish).toHaveBeenCalledWith('app.shop.commission', {
          shopId: 'my-shop-id',
          dallasId: 'my-dallas-id'
        })
      })
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
          <ViewShop {...props} />
        )
      })

      it('renders the error message in an ErrorNotification', () => {
        expect(wrapper.find(ErrorNotification).length).toEqual(1)
        expect(wrapper.find(ErrorNotification).props().message).toEqual('error message')
      })

      it('should still render ShopInfo', () => {
        expect(wrapper.find(ShopInfo).length).toEqual(1)
        expect(wrapper.find(ShopInfo).props().shop).toEqual(props.shop)
      })

      it('should not render CommissioningForm', () => {
        expect(wrapper.find(CommissioningForm).length).toEqual(0)
      })

      it('should publish \'app.shop.dismisserror\' when the error is dismissed', () => {
        wrapper.find(ErrorNotification).props().onDismiss()

        expect(mock['pubsub-js'].publish).toHaveBeenCalledWith('app.shop.dismisserror')
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
          <ViewShop {...props} />
        )
      })

      it('renders the error message in an LoadingNotification', () => {
        expect(wrapper.find(LoadingNotification).length).toEqual(1)
      })

      it('should still render ShopInfo and CommissioningForm', () => {
        expect(wrapper.find(ShopInfo).length).toEqual(1)
        expect(wrapper.find(ShopInfo).props().shop).toEqual(props.shop)
        expect(wrapper.find(CommissioningForm).length).toEqual(1)
      })
    })
  })

  describe('message', () => {
    describe('when there is no message', () => {
      it('should not render an CommissionSuccessNotification', () => {
        expect(wrapper.find(CommissionSuccessNotification).length).toEqual(0)
      })
    })

    describe('when there is a message', () => {
      beforeEach(() => {
        props = Object.assign({}, props, { message: 'some success message' })
        wrapper = shallow(
          <ViewShop {...props} />
        )
      })

      it('renders the message in a CommissionSuccessNotification', () => {
        expect(wrapper.find(CommissionSuccessNotification).length).toEqual(1)
        expect(wrapper.find(CommissionSuccessNotification).props().message).toEqual('some success message')
      })

      it('should still render ShopInfo', () => {
        expect(wrapper.find(ShopInfo).length).toEqual(1)
        expect(wrapper.find(ShopInfo).props().shop).toEqual(props.shop)
      })

      it('should not render CommissioningForm', () => {
        expect(wrapper.find(CommissioningForm).length).toEqual(0)
      })

      it('should publish \'app.shop.dismissmessage\' when the message is dismissed', () => {
        wrapper.find(CommissionSuccessNotification).props().onDismiss()

        expect(mock['pubsub-js'].publish).toHaveBeenCalledWith('app.shop.dismissmessage')
      })
    })
  })
})
