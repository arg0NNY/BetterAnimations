import { getMessageKey } from '@/patches/ChannelMessageList/utils'
import { Dispatcher, Flux } from '@/modules/DiscordModules'

const toEnter = new Set()
const toExit = new Set()

function handleMessageCreate ({ message }) {
  const key = getMessageKey(message)
  toEnter.add(key)
  setTimeout(() => toEnter.delete(key), 100)
}

function handleMessageDelete ({ id }) {
  toExit.add(id)
  setTimeout(() => toExit.delete(id), 100)
}

export default new class MessageStackStore extends Flux.Store {
  getMessagesAwaitingTransition () {
    return { toEnter, toExit }
  }
}(Dispatcher, {
  MESSAGE_CREATE: handleMessageCreate,
  MESSAGE_DELETE: handleMessageDelete
})

