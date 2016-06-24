import {JSON} from 'app/globals'

export function parse (value) {
  try {
    return JSON.parse(value || null)
  } catch (err) {
    return err
  }
}

export function stringify (value) {
  return JSON.stringify(value)
}
