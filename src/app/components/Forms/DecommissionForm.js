import React, { PropTypes } from 'react'

export const DecommissionForm = React.createClass({
  propTypes: {
    shop: PropTypes.object.isRequired,
    onDecommission: PropTypes.func.isRequired,
    onInstall: PropTypes.func.isRequired
  },
  terminalTable (ssbts) {
    return (
      <section>
        <p><strong>Terminals</strong></p>
        <table className='inuit-table inuit-table--cosy inuit-table--rows'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Dallas ID</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {ssbts.map(this.terminalRow)}
          </tbody>
        </table>
      </section>
    )
  },
  terminalRow (ssbt, i) {
    var install = this.props.onInstall.bind(this, ssbt)
    var decommission = this.props.onDecommission.bind(this, ssbt)
    return (
      <tr key={i}>
        <td className='small'>0{ssbt.ssbtIndex}</td>
        <td className='small'>{ssbt.dallasId}</td>
        <td className='small'>{ssbt.installStatus}</td>
        <td className='small'>{ssbt.installStatus === 'INSTALL_PENDING'
          ? <button className='c-btn-link' onClick={install}>Install</button>
          : null}
        </td>
        <td className='small'><button className='c-btn-link' onClick={decommission}>Decommission</button></td>
      </tr>
	)
  },
  render () {
    const { ssbts } = this.props.shop.toJS()
    return (
      <section>
        <br />
        {ssbts.length > 0
          ? this.terminalTable(ssbts)
          : <p className='centre'><strong>There are currently no terminals in this branch</strong></p>
        }
      </section>
    )
  }
})
