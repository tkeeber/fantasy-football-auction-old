// This is practically a straight copy from helios-ui. Needs putting in a shared module or something!

/* global window */

// window should only be used in cases where it can't be avoided, such as
// getting and setting window.onerror or window.onunload for example.
export const w = window

export const Date = w.Date
export const Error = w.Error
export const Intl = w.Intl
export const JSON = w.JSON
export const Promise = w.Promise
export const WebSocket = w.WebSocket
export const XMLHttpRequest = w.XMLHttpRequest
export const clearTimeout = w.clearTimeout
export const console = w.console
export const document = w.document
export const isNaN = w.isNaN
export const parseFloat = w.parseFloat
export const performance = w.performance
export const setTimeout = w.setTimeout
export const location = w.location
export const localStorage = w.localStorage
export const Blob = w.Blob
export const URL = w.URL
