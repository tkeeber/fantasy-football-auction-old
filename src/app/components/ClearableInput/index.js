// 3rd party modules
import classNames from 'classnames'
import InlineSVG from 'svg-inline-react'
import React, { PropTypes } from 'react'

// public
export const ClearableInput = React.createClass({
  propTypes: {
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    onClear: PropTypes.func,
    onChanged: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    isValid: PropTypes.bool
  },
  getDefaultProps () {
    return {
      isValid: true
    }
  },
  getInitialState () {
    return {
      isDirty: false,
      value: this.props.defaultValue || ''
    }
  },
  componentWillReceiveProps (nextProps) {
    if (!this.state.isDirty && nextProps.defaultValue !== this.state.value) {
      this.setState({
        value: nextProps.defaultValue || ''
      })
    }
  },
  handleChange ({target: {value}}) {
    if (value === '') {
      this.onClear()
    } else {
      this.setState({
        value,
        isDirty: true
      }, () => {
        if (this.props.onChanged) {
          this.props.onChanged(this.state.value)
        }
      })
    }
  },
  onKeyPress (event) {
    if (event.key === 'Enter') {
      this.props.onSubmit(this.state.value)
      event.preventDefault()
    }
  },
  onClear () {
    this.setState({
      value: '',
      isDirty: false
    })

    if (this.props.onClear) {
      this.props.onClear()
    }
  },
  render () {
    const classes = classNames('c-clearable-input', {
      'c-clearable-input--invalid': !this.props.isValid,
      'c-clearable-input--enabled': this.state.value.length > 0
    }, this.props.className)
    return (
      <div className={classes}>
        <input
          {...this.props}
          className='c-clearable-input__field'
          onKeyPress={this.onKeyPress}
          onChange={this.handleChange}
          value={this.state.value}
          type='text' />
        <div className='c-clearable-input__cross'>
          <button className='c-clearable-input__btn' onClick={this.onClear}>
            <InlineSVG src={require('../../../assets/images/cross-icon.svg')} />
          </button>
        </div>
      </div>
    )
  }
})
