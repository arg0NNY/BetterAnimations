import Patcher from '@/modules/Patcher'
import { GuildChannelListKeyed } from '@discord/modules'

export let currentGuildChannels = null

function patchGuildChannelList () {
  Patcher.after(...GuildChannelListKeyed, (self, args, value) => {
    currentGuildChannels = value.props.guildChannels
  })
}

export default patchGuildChannelList
