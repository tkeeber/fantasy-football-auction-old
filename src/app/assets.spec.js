import React, { PropTypes } from 'react'
import { shallow } from 'enzyme'

import { LoadingIcon, HomeIcon } from './assets'
import InlineSVG from 'svg-inline-react'

describe('assets', () => {
  describe('LoadingIcon', () => {
    it('has a LoadingIcon', () => {
      expect(LoadingIcon).toBeDefined()
    })
    it('passes props through', () => {
      const props = { some: 'prop'}
      const wrapper = shallow(<LoadingIcon {...props} />)

      expect(wrapper.find(InlineSVG).length).toEqual(1)
      expect(wrapper.find(InlineSVG).props().some).toEqual('prop')
    })
  })

  describe('HomeIcon', () => {
    it('has a HomeIcon', () => {
      expect(HomeIcon).toBeDefined()
    })
    it('passes props through', () => {
      const props = { some: 'prop'}
      const wrapper = shallow(<HomeIcon {...props} />)

      expect(wrapper.find(InlineSVG).length).toEqual(1)
      expect(wrapper.find(InlineSVG).props().some).toEqual('prop')
    })
  })
})