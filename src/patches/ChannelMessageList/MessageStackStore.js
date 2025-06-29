import { getMessageKey } from '@/patches/ChannelMessageList/utils'
import { Dispatcher, Flux } from '@discord/modules'
import { MAX_ANIMATION_DURATION } from '@data/constants'

const toEnter = new Set()
const toExit = new Set()

function handleMessageCreate ({ message }) {
  const key = getMessageKey(message)
  toEnter.add(key)
  setTimeout(() => toEnter.delete(key), MAX_ANIMATION_DURATION)
}

function handleMessageDelete ({ id }) {
  toExit.add(id)
  setTimeout(() => toExit.delete(id), MAX_ANIMATION_DURATION)
}

export default new class MessageStackStore extends Flux.Store {
  getMessagesAwaitingTransition () {
    return { toEnter, toExit }
  }
}(Dispatcher, {
  MESSAGE_CREATE: handleMessageCreate,
  MESSAGE_DELETE: handleMessageDelete
})

