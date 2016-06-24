import React, { PropTypes } from 'react'

export const ShopInfo = React.createClass({
  propTypes: {
    shop: PropTypes.object.isRequired
  },
  render () {
    const { shopId, shopName } = this.props.shop.toJS()
    return (
      <table className='inuit-table inuit-table--cosy inuit-table--rows'>
        <tbody>
          <tr>
            <th scope='row'>Shop ID</th>
            <td>{shopId}</td>
          </tr>
          <tr>
            <th scope='row'>Branch name</th>
            <td>{shopName}</td>
          </tr>
        </tbody>
      </table>
    )
  }
})
