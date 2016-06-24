import React from 'react'
import { Link } from 'react-router'
import { HomeIcon } from 'app/assets'

export const NotFound = () => (
  <section className='c-empty-view'>
    <HomeIcon className='c-empty-view__icon' />
    <h2 className='c-empty-view__title'>Oops. That url is not recognised</h2>
    <Link className='c-empty-view__message c-empty-view__message--clickable' to={'/'}>Click here to go back to the home screen</Link>
  </section>
)
