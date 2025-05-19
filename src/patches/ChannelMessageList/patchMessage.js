import Patcher from '@/modules/Patcher'
import { Message } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import useModule from '@/hooks/useModule'
import ModuleKey from '@shared/enums/ModuleKey'
import useWindow from '@/hooks/useWindow'

function patchMessage () {
  Patcher.after(Message, 'type', (self, [props], value) => {
    // Move message margins from child element to message container (as it should have been done, dear Discord)

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Messages)
    if (!isMainWindow || !module.isEnabled()) return

    const messageListItem = findInReactTree(value, m => m?.className?.includes(DiscordClasses.MessageList.messageListItem))
    if (!messageListItem) return

    messageListItem.ref = props.ref

    const message = findInReactTree(messageListItem, m => m?.className?.includes(DiscordClasses.MessageList.message))
    if (!message?.className.includes(DiscordClasses.MessageList.groupStart)) return

    message.className = message.className.replace(DiscordClasses.MessageList.groupStart, '')
    messageListItem.className += ' ' + DiscordClasses.MessageList.groupStart
  })
}

export default patchMessage
