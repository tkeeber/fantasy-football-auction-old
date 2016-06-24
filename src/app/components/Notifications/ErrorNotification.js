import React from 'react'

export const ErrorNotification = (props) => (
  <aside className='c-error-notification'>
    <p>{props.message}</p>
    <button className='inuit-btn inuit-btn--full c-btn-negative' onClick={props.onDismiss}>
      Dismiss
    </button>
  </aside>
)

ErrorNotification.propTypes = {
  message: React.PropTypes.string.isRequired,
  onDismiss: React.PropTypes.func.isRequired
}
