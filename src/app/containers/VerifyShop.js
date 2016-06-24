import React, { PropTypes } from 'react'
import PubSub from 'pubsub-js'
import { withRouter } from 'react-router'

import {
  VerifyShopForm,
  ErrorNotification,
  LoadingNotification
} from 'app/components'

export const Component = React.createClass({
  propTypes: {
    shop: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    // From withRouter
    router: PropTypes.object.isRequired
  },
  renderError () {
    return this.props.error
      ? <ErrorNotification message={this.props.error} onDismiss={this.handleDismissError} />
      : null
  },
  renderLoading () {
    return this.props.isLoading
      ? <LoadingNotification />
      : null
  },
  renderVerifyShopForm () {
    return (!this.props.error && !this.props.isLoading && this.props.shop.get('shopId'))
      ? <VerifyShopForm shop={this.props.shop} />
      : null
  },
  render () {
    return (
      <section>
        {this.renderLoading()}
        {this.renderError()}
        {this.renderVerifyShopForm()}
      </section>
    )
  },
  handleDismissError () {
    PubSub.publish('app.shop.dismisserror')
    this.props.router.push('/')
  }
})

export const VerifyShop = withRouter(Component)
