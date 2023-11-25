import { Dispatcher } from '@/modules/DiscordModules'

const subscriptions = []

export function subscribe (type, handler) {
  Dispatcher.subscribe(type, handler)
  subscriptions.push([type, handler])
}

function _unsubscribe (filterFn) {
  subscriptions.filter(filterFn)
    .forEach(s => {
      Dispatcher.unsubscribe(...s)
      subscriptions.splice(subscriptions.indexOf(s), 1)
    })
}
export function unsubscribe (type, handler) {
  return _unsubscribe(s => s[0] === type && s[1] === handler)
}
export function unsubscribeAll (type = null) {
  return _unsubscribe(type === null ? s => s : s => s[0] === type)
}

export default {
  subscribe,
  unsubscribe,
  unsubscribeAll
}
