import React from 'react'
import _ from 'lodash'
import { shallow } from 'enzyme'

import { ClearableInput } from './index'

describe('<ClearableInput />', function () {
  let wrapper
  let props

  beforeEach(function () {
    props = {
      defaultValue: 'default',
      onClear: jasmine.createSpy('on clear'),
      onChanged: jasmine.createSpy('on changed'),
      onSubmit: jasmine.createSpy('on submit')
    }
    wrapper = shallow(
      <ClearableInput {...props} />
    )
  })

  it('should render a text input', () => {
    expect(wrapper.find('input').length).toEqual(1)
    expect(wrapper.find('input').props().type).toEqual('text')
    expect(wrapper.find('input').props().value).toEqual('default')
  })

  describe('defaultValue', () => {
    it('should initialise the input with defaultValue', () => {
      expect(wrapper.find('input').props().value).toEqual(props.defaultValue)
    })

    it('should permit updating of the defaultValue if the input has not changed', () => {
      wrapper.setProps(Object.assign({}, props, {defaultValue: 'new default'}))

      expect(wrapper.find('input').props().value).toEqual('new default')
    })

    it('should not responsd to changed to defaultValue once the input has been changed by the user', () => {
      wrapper.find('input').props().onChange({target: {value: 'a'}})

      wrapper.setProps(Object.assign({}, props, {defaultValue: 'new default'}))

      expect(wrapper.find('input').props().value).toEqual('a')

      wrapper.setProps(_.omit(props, 'defaultValue'))

      expect(wrapper.find('input').props().value).toEqual('a')
    })

    it('should use an empty string when there is no default value', () => {
      wrapper = shallow(
        <ClearableInput {..._.omit(props, 'defaultValue')} />
      )
      expect(wrapper.find('input').props().value).toEqual('')
    })
  })

  describe('responding to input', () => {
    it('should update the value on input change', () => {
      wrapper.find('input').props().onChange({target: {value: 'a'}})

      expect(props.onChanged).toHaveBeenCalledWith('a')

      wrapper.update()

      expect(wrapper.find('input').props().value).toEqual('a')
    })

    it('should call onSubmit when the enter key is detected', () => {
      wrapper.find('input').props().onChange({target: {value: 'a'}})
      wrapper.find('input').props().onKeyPress({key: 'Enter', preventDefault: () => {}})

      expect(props.onSubmit).toHaveBeenCalledWith('a')
    })

    it('does not interrupt on other key presses', () => {
      wrapper.find('input').props().onKeyPress({key: 'a'})

      expect(props.onSubmit).not.toHaveBeenCalled()
      expect(props.onChanged).not.toHaveBeenCalled()
    })

    it('allows onChanged to be optional', () => {
      const newProps = _.omit(props, 'onChanged')
      wrapper = shallow(
        <ClearableInput {...newProps} />
      )

      wrapper.find('input').props().onChange({target: {value: 'a'}})

      wrapper.update()

      expect(wrapper.find('input').props().value).toEqual('a')
    })
  })

  describe('validation', () => {
    beforeEach(function () {
      props = {
        defaultValue: 'default',
        onClear: jasmine.createSpy('on clear'),
        onChanged: jasmine.createSpy('on changed'),
        onSubmit: jasmine.createSpy('on submit'),
        isValid: false
      }
      wrapper = shallow(
        <ClearableInput {...props} />
      )
    })

    it('should render an invalid state if the isValid prop is false', () => {
      expect(wrapper.find('.c-clearable-input--invalid').length).toEqual(1)
    })

    it('should clear invalid state if the input becomes valid again', () => {
      const newProps = _.assign({}, props, { isValid: true })
      wrapper.setProps(newProps)
      wrapper.update()

      expect(wrapper.find('.c-clearable-input--invalid').length).toEqual(0)
    })

    it('should not render an invalid state if isValid is not present', () => {
      props = _.omit(props, 'isValid')
      wrapper = shallow(
        <ClearableInput {...props} />
      )
      expect(wrapper.find('.c-clearable-input--invalid').length).toEqual(0)
    })
  })

  describe('clearing', () => {
    it('should render a clear button', () => {
      expect(wrapper.find('button').length).toEqual(1)
    })

    it('should clear the input when the button is clicked', () => {
      wrapper.find('button').simulate('click')

      wrapper.update()

      expect(wrapper.find('input').props().value).toEqual('')
      expect(props.onClear).toHaveBeenCalledWith()
    })

    it('should clear the input when an empty string is submitted', () => {
      wrapper.find('input').props().onChange({target: {value: ''}})

      wrapper.update()

      expect(wrapper.find('input').props().value).toEqual('')
      expect(props.onClear).toHaveBeenCalledWith()
    })

    it('allows onClear to be optional', () => {
      const newProps = _.omit(props, 'onClear')
      wrapper = shallow(
        <ClearableInput {...newProps} />
      )

      wrapper.find('button').simulate('click')

      wrapper.update()

      expect(wrapper.find('input').props().value).toEqual('')
    })
  })
})
