import React from 'react'
import { shallow, mount } from 'enzyme'
import Immutable from 'immutable'
import { Header } from 'app/components'

describe('<Shop />', function () {
  let mock
  let props
  let wrapper

  beforeEach(() => {
    mock = {
      'pubsub-js': {
        publish: jasmine.createSpy('pubsub publish spy')
      },
      'app/stores': {
        ShopStore: {
          addListener: jasmine.createSpy('add listener spy'),
          removeListener: jasmine.createSpy('remove listener spy'),
          get: jasmine.createSpy('shop store get spy').and.returnValue(Immutable.fromJS({
            shop: 'mockShop'
          }))
        }
      }
    }
  })

  describe('inner component', () => {
    let Component
    beforeEach(() => {
      props = {
        params: {
          shopId: 'my-shop-id'
        }
      }
      Component = require('inject!./Shop')(mock).Component
    })

    it('renders children, passing down any props', () => {
      props = Object.assign({}, props, { some: 'prop' })
      wrapper = mount(
        <Component {...props}>
          <div />
        </Component>
      )

      expect(wrapper.find('div').length).toEqual(1)
      expect(wrapper.find('div').props()).toEqual(props)
    })

    it('can render multiple children', () => {
      props = Object.assign({}, props, { some: 'prop' })
      wrapper = mount(
        <Component {...props}>
          <div />
          <div />
        </Component>
      )

      expect(wrapper.find('div').length).toEqual(2)
      expect(wrapper.find('div').at(0).props()).toEqual(props)
      expect(wrapper.find('div').at(1).props()).toEqual(props)
    })
  })

  describe('store connected component', () => {
    let Connector
    beforeEach(function () {
      Connector = require('inject!./Shop')(mock).Connector
      props = Object.assign({}, props, { some: 'prop' })
      wrapper = mount(
        <Connector {...props}>
          <div />
        </Connector>
      )
    })

    it('adds a listener to ShopStore', () => {
      expect(mock['app/stores'].ShopStore.addListener).toHaveBeenCalled()
    })

    it('cleans up the listener when unmounted', () => {
      wrapper.unmount()
      expect(mock['app/stores'].ShopStore.removeListener).toHaveBeenCalled()
    })

    it('provides children with the shop id from the ShopStore', () => {
      expect(mock['app/stores'].ShopStore.get).toHaveBeenCalled()
      expect(wrapper.find('div').at(0).props().some).toEqual('prop')
      expect(wrapper.find('div').at(0).props().shop).toEqual('mockShop')

    })
  })

  describe('Route', () => {
    let Route
    beforeEach(() => {
      props = {
        params: {
          shopId: 'my-shop-id'
        }
      }
      Route = require('inject!./Shop')(mock).Route
    })

    it('uses the shopId param passed to it by the router to publish \'app.shop.set\'', () => {
      wrapper = mount(
        <Route {...props} />
      )

      expect(mock['pubsub-js'].publish).toHaveBeenCalledWith('app.shop.set', { shopId : 'my-shop-id'})
    })

    it('calls \'app.shop.clear\' on unmount', () => {
      wrapper = mount(
        <Route {...props} />
      )

      wrapper.unmount()

      expect(mock['pubsub-js'].publish).toHaveBeenCalledWith('app.shop.clear')
    })
  })
})
