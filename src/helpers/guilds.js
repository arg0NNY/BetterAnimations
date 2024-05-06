import { ChannelStore, Constants, GuildChannelStore, SortedGuildStore } from '@/modules/DiscordModules'

export function getSortedGuildTreeIds (node = SortedGuildStore.getGuildsTree().root) {
  if (node.children?.length)
    return node.children.map(getSortedGuildTreeIds).flat()

  return node.id
}

export function getSortedGuildChannelIds (guildId) {
  const {
    [Constants.ChannelTypes.GUILD_CATEGORY]: categories,
    SELECTABLE: textChannels,
    VOCAL: voiceChannels
  } = GuildChannelStore.getChannels(guildId)

  const tree = Object.fromEntries(
    categories.map(({ channel, comparator }) => [channel.id, { text: [], voice: [], comparator }])
  )

  const categorize = (channels, type) => channels.map(
    ({ channel }) => tree[channel.parent_id ?? 'null']?.[type].push(...[
      channel.id,
      ...ChannelStore.getAllThreadsForParent(channel.id).map(t => t.id)
    ])
  )
  categorize(textChannels, 'text')
  categorize(voiceChannels, 'voice')

  return Object.values(tree).sort((a, b) => a.comparator - b.comparator)
    .map(t => t.text.concat(t.voice)).flat()
}
