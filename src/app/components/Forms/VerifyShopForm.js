import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

import { Link } from 'react-router'
import { ShopInfo } from 'app/components'

export const VerifyShopForm = React.createClass({
  propTypes: {
    shop: PropTypes.object.isRequired
  },
  render () {
    const continueUrl = '/shops/' + this.props.shop.get('shopId') + '/'
    return (
      <div>
        <p>Please check you have the intended shop ID and branch name before you continue.</p>
        <ShopInfo shop={this.props.shop} />
        <Link className='inuit-btn inuit-btn--full c-btn-alpha' to={continueUrl} ref={this.focusLink}>Continue</Link>
        <Link className='inuit-btn inuit-btn--full c-btn-link' to={'/'}>Start over</Link>
      </div>
    )
  },
  focusLink (element) {
    if (element) {
      ReactDOM.findDOMNode(element).focus()
    }
  }
})
