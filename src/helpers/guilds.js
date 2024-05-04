import { SortedGuildStore } from '@/modules/DiscordModules'

export function getSortedGuildTreeIds (node = SortedGuildStore.getGuildsTree().root) {
  if (node.children?.length)
    return node.children.map(getSortedGuildTreeIds).flat()

  return node.id
}
