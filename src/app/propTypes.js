// 3rd party modules
// import IPT from 'react-immutable-proptypes'
import { PropTypes as RPT } from 'react'

export const children = RPT.oneOfType([
  RPT.arrayOf(RPT.node),
  RPT.node
])
