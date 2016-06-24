import React from 'react'
import { shallow } from 'enzyme'

import { CommissioningForm } from './CommissioningForm'
import { ClearableInput } from 'app/components/ClearableInput'

describe('<CommissioningForm />', function () {
  let wrapper
  let props

  beforeEach(function () {
    props = {
      onSubmit: jasmine.createSpy('on submit spy')
    }
    wrapper = shallow(
      <CommissioningForm {...props} />
    )
  })

  describe('rendering', () => {

    it('renders a ClearableInput', () => {
      expect(wrapper.find(ClearableInput).length).toEqual(1)
    })

    it('renders a submit button', () => {
      expect(wrapper.find('button').length).toEqual(1)
    })
  })

  describe('ClearableInput', () => {
    describe('when ClearableInput calls its onClear prop', () => {
      beforeEach(() => {
        wrapper.find(ClearableInput).props().onClear()
        wrapper.update()
      })

      it('does not call submit', () => {
        expect(props.onSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe('after ClearableInput calls onChanged with a valid dallas id', () => {
    beforeEach(() => {
        wrapper.find(ClearableInput).props().onChanged('8D000002118C0023')
    })

    describe('when clicking the submit button', () => {
      beforeEach(() => {
        wrapper.find('button').simulate('click')
      })

      it('calls onSubmit with the current value', () => {
        expect(props.onSubmit).toHaveBeenCalledWith({dallasId: '8D000002118C0023'})
      })
    })
  })

  describe('after ClearableInput calls onChanged with an invalid dallas id', () => {
    beforeEach(() => {
        wrapper.find(ClearableInput).props().onChanged('invalid dallas id')
    })

    describe('when clicking the submit button', () => {
      beforeEach(() => {
        wrapper.find('button').simulate('click')
      })

      it('does not call onSubmit with the current value', () => {
        expect(props.onSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe('when ClearableInput calls its onSubmit prop with a valid dallas id', () => {
    beforeEach(() => {
        wrapper.find(ClearableInput).props().onSubmit('8D000002118C0023')
        wrapper.update()
    })

    it('calls onSubmit with the current value', () => {
      expect(props.onSubmit).toHaveBeenCalledWith({dallasId: '8D000002118C0023'})
    })
  })

  describe('when ClearableInput calls its onSubmit prop with an invalid dallas id', () => {
    beforeEach(() => {
        wrapper.find(ClearableInput).props().onSubmit('invalid dallas id')
        wrapper.update()
    })

    it('calls onSubmit with the current value', () => {
      expect(props.onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('dallas id validation', () => {
    it('does not set isValid false until the user attempts to submit', () => {
      wrapper.find(ClearableInput).props().onChanged('invalid dallas id')
      wrapper.update()
      expect(wrapper.find(ClearableInput).props().isValid).toEqual(true)

      wrapper.find('button').simulate('click')
      wrapper.update()
      expect(wrapper.find(ClearableInput).props().isValid).toEqual(false)
    })

    it('sets isValid correctly on ClearableInput after submission attempt', () => {
      wrapper.find(ClearableInput).props().onChanged('invalid dallas id')
      wrapper.find('button').simulate('click')
      wrapper.update()
      expect(wrapper.find(ClearableInput).props().isValid).toEqual(false)

      wrapper.find(ClearableInput).props().onChanged('8D000002118C0023')
      wrapper.find('button').simulate('click')
      wrapper.update()
      expect(wrapper.find(ClearableInput).props().isValid).toEqual(true)
    })
  })
})
