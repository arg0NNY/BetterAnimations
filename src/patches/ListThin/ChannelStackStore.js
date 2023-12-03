import { ChannelStore, Dispatcher, Flux } from '@/modules/DiscordModules'

const channels = new Set()
const guilds = new Set()

function add (set, item, timeout = 10) {
  set.add(item)
  setTimeout(() => set.delete(item), timeout)
}

function handleCategoryCollapse ({ id }) {
  const channel = ChannelStore.getChannel(id)
  add(guilds, channel?.guild_id ?? id)
}

function handleCategoryCollapseAll ({ guildId }) {
  add(guilds, guildId)
}

function handleChannelCreate ({ channel }) {
  add(channels, channel.id)
}

export default new class ChannelStackStore extends Flux.Store {
  getChannelsAwaitingTransition () {
    return { channels, guilds }
  }
}(Dispatcher, {
  CATEGORY_COLLAPSE: handleCategoryCollapse,
  CATEGORY_EXPAND: handleCategoryCollapse,
  CATEGORY_COLLAPSE_ALL: handleCategoryCollapseAll,
  CATEGORY_EXPAND_ALL: handleCategoryCollapseAll,
  CHANNEL_CREATE: handleChannelCreate,
  CHANNEL_DELETE: handleChannelCreate
})
