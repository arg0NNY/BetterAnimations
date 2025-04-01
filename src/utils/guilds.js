import { SortedGuildStore } from '@/modules/DiscordModules'
import { guildActionRowToChannelRoute } from '@/utils/routes'

export function getSortedGuildTreeIds (node = SortedGuildStore.getGuildsTree().root) {
  if (node.children?.length)
    return node.children.map(getSortedGuildTreeIds).flat()

  return node.id
}

export function getSortedGuildChannelIds (guildChannels) {
  return [
    (guildChannels.guildActionSection?.guildActionRows ?? [])
      .map(guildActionRowToChannelRoute),
    guildChannels.getSortedCategories().flatMap(c =>
      (c.shownChannelIds ?? []).flatMap(id => [id, ...c.channels[id].threadIds])
    )
  ].flat()
}
