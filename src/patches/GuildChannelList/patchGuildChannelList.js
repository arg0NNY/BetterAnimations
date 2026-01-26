import Patcher, { TinyPatcher } from '@/modules/Patcher'
import { GuildChannelListKeyed } from '@discord/modules'
import ModuleKey from '@enums/ModuleKey'
import findInReactTree from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'
import patchListThin from '@/patches/GuildChannelList/patchListThin'

export let currentGuildChannels = null

function patchGuildChannelList () {
  const once = ensureOnce()
  let patched = null

  Patcher.after(ModuleKey.ChannelList, ...GuildChannelListKeyed, (self, args, value) => {
    currentGuildChannels = value.props.guildChannels

    // Prevent full list rerender
    if (patched) {
      value.type = patched
      return
    }

    TinyPatcher.after(ModuleKey.ChannelList, value, 'type', (self, args, value) => {
      const channelList = findInReactTree(value, m => m?.type?.prototype?.renderList)
      if (!channelList) return

      once(() => {
        Patcher.after(ModuleKey.ChannelList, channelList.type.prototype, 'renderList', (self, args, value) => {
          TinyPatcher.after(ModuleKey.ChannelList, value.props, 'children', (self, args, value) => {
            once(() => patchListThin(value.type), 'scroller')
          })
        })
      }, 'channelList')
    })
    patched = value.type
  })
}

export default patchGuildChannelList
