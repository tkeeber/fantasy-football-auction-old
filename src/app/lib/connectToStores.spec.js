import React from 'react'
import TestUtils from 'react-addons-test-utils';
import Immutable from 'immutable'
import { mount, shallow } from 'enzyme'
import { decorate } from 'app/mixins/observable'

import { connectToStores } from './connectToStores'

describe('lib/connectToStores', () => {

  const MockComponent = React.createClass({
    render () {
      return <div>blah {[...this.props].join(',')}</div>
    }
  })
  function MockStore () {
    let shared = {
      data: {}
    }
    return decorate({
      set: (data) => shared.data = data,
      get: () => shared.data
    })
  }

  let FooStore
  let BarStore
  let stores = []
  let getStateFromStores

  beforeEach(() => {
    FooStore = new MockStore()
    spyOn(FooStore, 'addListener').and.callThrough()
    spyOn(FooStore, 'removeListener').and.callThrough()
    BarStore = new MockStore()
    spyOn(BarStore, 'addListener').and.callThrough()
    spyOn(BarStore, 'removeListener').and.callThrough()
    stores = [FooStore, BarStore]
    getStateFromStores = () => ({})
  })

  afterEach(() => {})

  it('attaches store listeners when the component is mounted', () => {
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent some='prop'></ConnectedComponent>)

    expect(FooStore.addListener).toHaveBeenCalled()
    expect(FooStore.addListener.calls.argsFor(0)[0]).toEqual('change')
    expect(BarStore.addListener).toHaveBeenCalled()
    expect(BarStore.addListener.calls.argsFor(0)[0]).toEqual('change')
  })

  it('renders the child component', () => {
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent some='prop'></ConnectedComponent>)

    expect(wrapper.find(MockComponent).length).toEqual(1)
  })

  it('passed props through to the inner component', () => {
    const props = { some: 'prop' }
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent {...props}></ConnectedComponent>)

    expect(wrapper.find(MockComponent).props()).toEqual(props)
  })

  it('sets the initial props of the inner component using getStateFromStores', () => {
    const stateFromStores = { state: 'initial state from stores' }
    const getStateFromStores = () => (stateFromStores)
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent></ConnectedComponent>)

    expect(wrapper.find(MockComponent).props()).toEqual(stateFromStores)
  })

  it('merges passed props and props derived from getStateFromStores', () => {
    const stateFromStores = { state: 'initial state from stores' }
    const getStateFromStores = () => (stateFromStores)
    const props = { some: 'prop' }
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent {...props}></ConnectedComponent>)

    expect(wrapper.find(MockComponent).props()).toEqual(Object.assign({}, props, stateFromStores))
  })

  it('removes store listeners when the component is unmounted', () => {
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent some='prop'></ConnectedComponent>)

    wrapper.unmount()

    expect(FooStore.removeListener).toHaveBeenCalled()
    expect(FooStore.removeListener.calls.argsFor(0)[0]).toEqual('change')
    expect(BarStore.removeListener).toHaveBeenCalled()
    expect(BarStore.removeListener.calls.argsFor(0)[0]).toEqual('change')
  })

  it('updates the component props when it receives new props', () => {
    const getStateFromStores = () => ({})
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent some='prop'></ConnectedComponent>)

    wrapper.setProps({ some: 'new prop value'})

    wrapper.update()

    expect(wrapper.find(MockComponent).props()).toEqual({some: 'new prop value'})

  })

  it('updates the component props when the store emits', () => {
    const getStateFromStores = () => {
      return FooStore.get()
    }
    const ConnectedComponent = connectToStores(MockComponent, stores, getStateFromStores)
    const wrapper = mount(<ConnectedComponent some='prop'></ConnectedComponent>)

    FooStore.set({new: 'state'})
    FooStore.emit('change')

    expect(wrapper.find(MockComponent).props()).toEqual({some: 'prop', new: 'state'})
  })
})
