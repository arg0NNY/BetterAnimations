import { SortedGuildStore } from '@/modules/DiscordModules'
import { communityRowToChannelRoute } from '@/helpers/routes'

export function getSortedGuildTreeIds (node = SortedGuildStore.getGuildsTree().root) {
  if (node.children?.length)
    return node.children.map(getSortedGuildTreeIds).flat()

  return node.id
}

export function getSortedGuildChannelIds (guildChannels) {
  return [
    (guildChannels.communitySection?.communityRows ?? [])
      .map(communityRowToChannelRoute),
    guildChannels.getSortedCategories().flatMap(c =>
      (c.shownChannelIds ?? []).flatMap(id => [id, ...c.channels[id].threadIds])
    )
  ].flat()
}
