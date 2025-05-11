import Patcher from '@/modules/Patcher'
import { GuildChannelList } from '@/modules/DiscordModules'

export let currentGuildChannels = null

function patchGuildChannelList () {
  Patcher.after(...GuildChannelList, (self, args, value) => {
    currentGuildChannels = value.props.guildChannels
  })
}

export default patchGuildChannelList
