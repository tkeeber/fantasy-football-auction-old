import React from 'react'

export function connectToStores (Component, stores, getStateFromStores) {
  return React.createClass({
    getInitialState () {
      return this.getStateFromStores()
    },
    componentDidMount () {
      stores.forEach((store) => store.addListener('change', this.onStoreChange))
    },
    componentWillUnmount () {
      stores.forEach((store) => store.removeListener('change', this.onStoreChange))
    },
    componentWillReceiveProps (nextProps) {
      this.setState(this.getStateFromStores(nextProps))
    },
    getStateFromStores: function (props) {
      props = props || this.props
      return getStateFromStores(props)
    },
    onStoreChange () {
      this.setState(this.getStateFromStores())
    },
    render () {
      return React.createElement(Component, Object.assign({}, this.props, this.state))
    }
  })
}
