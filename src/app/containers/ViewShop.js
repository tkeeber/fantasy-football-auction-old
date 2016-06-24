import React, { PropTypes } from 'react'
import PubSub from 'pubsub-js'

import { Link } from 'react-router'

import {
  ShopInfo,
  CommissionSuccessNotification,
  CommissioningForm,
  DecommissionForm,
  ErrorNotification,
  LoadingNotification
} from 'app/components'

export const ViewShop = React.createClass({
  propTypes: {
    shop: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    message: PropTypes.string,
    error: PropTypes.string
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
  renderSuccessMessage () {
    return this.props.message
      ? <CommissionSuccessNotification message={this.props.message} onDismiss={this.handleDismissMessage} />
      : null
  },
  renderCommissioningForm () {
    return (!this.props.message && !this.props.error)
      ? <CommissioningForm onSubmit={this.commissionSsbt} />
      : null
  },
  renderDecommissionForm () {
    return (!this.props.message && !this.props.error)
      ? <DecommissionForm shop={this.props.shop} onDecommission={this.decommissionSsbt} onInstall={this.installSsbt} />
      : null
  },
  commissionSsbt ({dallasId}) {
    PubSub.publish('app.shop.commission', {
      shopId: this.props.shop.get('shopId'),
      dallasId: dallasId
    })
  },
  decommissionSsbt (ssbt) {
    PubSub.publish('app.shop.decommission', {
      shopId: this.props.shop.get('shopId'),
      dallasId: ssbt.dallasId
    })
  },
  installSsbt (ssbt) {
    PubSub.publish('app.shop.install', {
      shopId: this.props.shop.get('shopId'),
      dallasId: ssbt.dallasId
    })
  },
  render () {
    return (
      <section>
        <ShopInfo shop={this.props.shop} />
        {this.renderLoading()}
        {this.renderError()}
        {this.renderSuccessMessage()}
        {this.renderCommissioningForm()}
        {this.renderDecommissionForm()}
        <Link className='inuit-btn inuit-btn--full c-btn-link' to={'/'}>Start over</Link>
      </section>
    )
  },
  handleDismissError () {
    PubSub.publish('app.shop.dismisserror')
  },
  handleDismissMessage () {
    PubSub.publish('app.shop.dismissmessage')
    PubSub.publish('app.shop.set', {shopId: this.props.shop.get('shopId')})
  }
})
