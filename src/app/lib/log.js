// 3rd party modules
import PubSub from 'pubsub-js'

// modules
import { console } from 'app/globals'

// public
export function recordEvents () {
  PubSub.subscribe('app', onEvent)
}

function onEvent (topic, payload) {
  if (topic.startsWith('app.error')) {
    console.error(topic, payload)
  } else {
    console.info(topic, payload)
  }
}
