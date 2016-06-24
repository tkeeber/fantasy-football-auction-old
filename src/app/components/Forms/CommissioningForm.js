import React, { PropTypes } from 'react'

import { ClearableInput } from 'app/components'

export const CommissioningForm = React.createClass({
  propTypes: {
    onSubmit: PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      isValid: true,
      dallasId: ''
    }
  },
  onClear () {
    this.setState({
      value: '',
      isValid: true
    })
  },
  onChanged (dallasId) {
    this.setState({
      isValid: !this.state.isValid ? this.isValidDallasId(dallasId) : true,
      dallasId
    })
  },
  onSubmit (dallasId) {
    const isValid = this.isValidDallasId(dallasId)
    if (isValid) {
      this.props.onSubmit({
        dallasId: dallasId
      })
    }
    this.setState({isValid, dallasId})
  },
  isValidDallasId (dallasId) {
    return (/^[A-F0-9]{2}00000[A-F0-9]{7}23$/.test(dallasId))
  },
  submitForm () {
    this.onSubmit(this.state.dallasId)
  },
  render () {
    return (
      <section>
        <p>Enter Dallas ID for new SSBT</p>
        <ClearableInput
          placeholder={'e.g. 8D000002118C0023'}
          onChanged={this.onChanged}
          onSubmit={this.onSubmit}
          onClear={this.onClear}
          autoComplete='off'
          className='inuit-u-mb-'
          isValid={this.state.isValid}
        />
        <button className='inuit-btn inuit-btn--full c-btn-alpha' onClick={this.submitForm}>Submit</button>
      </section>
    )
  }
})
