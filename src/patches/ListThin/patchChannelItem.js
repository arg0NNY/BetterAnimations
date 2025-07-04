import ensureOnce from '@utils/ensureOnce'
import Patcher from '@/modules/Patcher'
import { ChannelItemKeyed, StageVoiceChannelItemKeyed, VoiceChannelItemKeyed } from '@discord/modules'
import { createRef } from 'react'
import findInReactTree from '@/utils/findInReactTree'

function patchChannelItem () {
  const once = ensureOnce()

  const callback = key => (self, args, value) => {
    once(
      () => Patcher.after(value.type.DecoratedComponent.prototype, 'render', (self, args, value) => {
        if (!self.__containerRef) self.__containerRef = createRef()

        const container = findInReactTree(value, m => m?.type === 'li')
        if (!container) return

        Patcher.after(container.props, 'ref', (_, [ref]) => self.__containerRef.current = ref)
      }),
      key
    )
  }

  Patcher.after(...ChannelItemKeyed, callback('channel'))
  Patcher.after(...VoiceChannelItemKeyed, callback('voice'))
  Patcher.after(...StageVoiceChannelItemKeyed, callback('stage'))
}

export default patchChannelItem
