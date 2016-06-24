import React, { PropTypes } from 'react'
import { withRouter } from 'react-router'

import { CreateManagerForm } from 'app/components'

export const Component = React.createClass({
  propTypes: {
    // From withRouter
    router: PropTypes.object.isRequired
  },
  selectShop ({shopId}) {
    this.props.router.push(`/shops/${shopId}/verify`)
  },
  render () {
    return (
      <CreateManagerForm onSubmit={this.selectShop} />
    )
  }
})

export const SelectShop = withRouter(Component)
