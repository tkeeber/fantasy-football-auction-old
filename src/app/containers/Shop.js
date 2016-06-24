import React, { PropTypes } from 'react'
import PubSub from 'pubsub-js'
import _ from 'lodash'

import { connectToStores } from 'app/lib/connectToStores'

import { ShopStore } from 'app/stores'

export const Component = React.createClass({
  propTypes: {
    children: PropTypes.object,
    shop: PropTypes.string.isRequired,
    error: PropTypes.string,
    message: PropTypes.string,
    isLoading: PropTypes.bool
  },
  renderChildren () {
    return React.Children.map(this.props.children,
      (child) => React.cloneElement(child, Object.assign({}, _.omit(this.props, 'children'), this.state)))
  },
  render () {
    return (
      <section>
        {this.renderChildren()}
      </section>
    )
  }
})

export const Connector = connectToStores(Component, [ShopStore], function computeState (props) {
  const state = ShopStore.get()
  return {
    shop: state.get('shop'),
    error: state.get('error'),
    message: state.get('message'),
    isLoading: state.get('isLoading')
  }
})

export const Route = React.createClass({
  propTypes: {
    params: PropTypes.shape({
      shopId: PropTypes.string.isRequired
    }).isRequired
  },
  componentDidMount () {
    PubSub.publish('app.shop.set', { shopId: this.props.params.shopId })
  },
  componentWillUnmount () {
    PubSub.publish('app.shop.clear')
  },
  render () {
    return <Connector {...this.props} />
  }
})

export const Shop = Route
