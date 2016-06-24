import React, { PropTypes } from 'react'

import { ClearableInput } from 'app/components'

export const CreateManagerForm = React.createClass({
  propTypes: {
    onSubmit: PropTypes.func.isRequired
  },
  getInitialState () {
    return {
      isValid: true,
      shopId: ''
    }
  },
  onChanged (shopId) {
    this.setState({
      isValid: true,
      shopId
    })
  },
  onClear () {
    this.setState({
      value: '',
      isValid: true
    })
  },
  onSubmit (shopId) {
      this.props.onSubmit({
        shopId: shopId
      })
    this.setState({isValid, shopId})
  },
  submitForm () {
    this.onSubmit(this.state.shopId)
  },
  render () {
    return (
      <section>
        <p>Create a new manager</p>
        <ClearableInput
          placeholder={'Manager name'}
          onChanged={this.onChanged}
          onSubmit={this.onSubmit}
          onClear={this.onClear}
          autoComplete='off'
          className='inuit-u-mb-'
          maxLength='200'
          isValid={this.state.isValid}
        />
        <button
          className='inuit-btn inuit-btn--full c-btn-alpha'
          onClick={this.submitForm}
          to={`/shops/${this.state.shopId}/verify`}
          disabled={!this.state.isValid}
        >Submit</button>
      </section>
    )
  }
})
