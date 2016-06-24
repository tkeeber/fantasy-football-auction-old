import React, { PropTypes } from 'react'

export const CommissionSuccessNotification = (props) => (
  <div>
    <p>{props.message}</p>
    <button className='inuit-btn inuit-btn--full c-btn-alpha' onClick={props.onDismiss}>Make another change to this branch</button>
  </div>
)

CommissionSuccessNotification.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired
}
