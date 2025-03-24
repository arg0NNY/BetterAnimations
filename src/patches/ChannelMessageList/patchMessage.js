import { Patcher } from '@/BdApi'
import { Message } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import useModule from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'

function patchMessage () {
  Patcher.after(Message, 'type', (self, args, value) => {
    // Move message margins from child element to message container (as it should have been done, dear Discord)

    const module = useModule(ModuleKey.Messages)
    if (!module.isEnabled()) return

    const messageListItem = findInReactTree(value, m => m?.className?.includes(DiscordClasses.MessageList.messageListItem))
    if (!messageListItem) return

    const message = findInReactTree(messageListItem, m => m?.className?.includes(DiscordClasses.MessageList.message))
    if (!message?.className.includes(DiscordClasses.MessageList.groupStart)) return

    message.className = message.className.replace(DiscordClasses.MessageList.groupStart, '')
    messageListItem.className += ' ' + DiscordClasses.MessageList.groupStart
  })
}

export default patchMessage
