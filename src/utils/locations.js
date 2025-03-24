import { PrivateChannelSortStore, Router, Routes, StaticChannelRoute } from '@/modules/DiscordModules'
import { getSortedGuildChannelIds, getSortedGuildTreeIds } from '@/utils/guilds'
import { getStaticDMRouteIndex } from '@/utils/routes'
import { currentGuildChannels } from '@/patches/GuildChannelList/patchGuildChannelList'

// Keep up-to-date with the internal AppView component (`Webpack.getByStrings('CHANNEL_THREAD_VIEW', 'GUILD_DISCOVERY')`)

// Keep up-to-date: (`impressionName: ImpressionNames.GUILD_CHANNEL` in AppView)
const CHANNEL_PATH = [
  Routes.CHANNEL_THREAD_VIEW(':guildId', ':channelId', ':threadId', ':messageId?'),
  Routes.CHANNEL(':guildId', ':channelId?', ':messageId?')
]

function matchExact (pathname, path) {
  return Router.matchPath(pathname, { path, exact: true })
}

function matchChannelRoutes (...locations) {
  return locations.map(l => matchExact(l.pathname, CHANNEL_PATH))
}

export function shouldSwitchBase (next, prev) {
  const [nextChannel, prevChannel] = matchChannelRoutes(next, prev)

  const nextOrPrev = (fn, n = next, p = prev) => fn(n) || fn(p)
  if (
    // Keep up-to-date: list everything that hides the sidebar (`hideSidebar` in AppView)
    nextOrPrev(l => l.pathname.startsWith(Routes.GUILD_MEMBER_VERIFICATION('')))
    || nextOrPrev(l => l.pathname.startsWith(Routes.GUILD_MEMBER_VERIFICATION_FOR_HUB('')))
    || nextOrPrev(l => matchExact(l.pathname, Routes.GUILD_BOOSTING_MARKETING(':guildId')))
    || nextOrPrev(l => matchExact(l.pathname, Routes.COLLECTIBLES_SHOP_FULLSCREEN))
    || nextOrPrev(l => matchExact(l.pathname, Routes.GUILD_DISCOVERY))
    || nextOrPrev(l => l?.params?.channelId === StaticChannelRoute.GUILD_ONBOARDING, nextChannel, prevChannel)
  ) return true

  if (nextChannel && prevChannel)
    return nextChannel.params.guildId !== prevChannel.params.guildId
  if (nextChannel || prevChannel)
    return (nextChannel ?? prevChannel).params.guildId !== '@me'

  return false
}

export function shouldSwitchContent (next, prev, isBaseSwitched = shouldSwitchBase(next, prev)) {
  if (isBaseSwitched) return false

  const [nextChannel, prevChannel] = matchChannelRoutes(next, prev)
  if (nextChannel && prevChannel && nextChannel.params.channelId === prevChannel.params.channelId)
    return false

  return true
}

export function getSwitchBaseDirection (next, prev) {
  const [nextChannel, prevChannel] = matchChannelRoutes(next, prev)

  if (prevChannel?.params.guildId === '@me') return 1 // If from DMs, further
  if (nextChannel?.params.guildId === '@me') return 0 // If to DMs, back
  if (matchExact(prev.pathname, Routes.GUILD_DISCOVERY)) return 0 // If from guild discovery, back
  if (matchExact(next.pathname, Routes.GUILD_DISCOVERY)) return 1 // If to guild discovery, further
  if (!nextChannel) return 0 // If from server, back; This condition also covers uncovered cases
  if (!prevChannel) return 1 // If to server, further

  // Otherwise it is from and to guild, compare guild indexes in the sorted tree
  const sortedGuildIds = getSortedGuildTreeIds()
  const indexOf = channel => sortedGuildIds.indexOf(channel.params.guildId)
  return +(indexOf(nextChannel) > indexOf(prevChannel))
}

export function getSwitchContentDirection (next, prev) {
  const [nextChannel, prevChannel] = matchChannelRoutes(next, prev)

  if (nextChannel && prevChannel && nextChannel.params.guildId !== '@me'
    && nextChannel.params.guildId === prevChannel.params.guildId) { // If guilds are the same, and it's not DMs, compare channel indexes
    const sortedChannelIds = currentGuildChannels ? getSortedGuildChannelIds(currentGuildChannels) : []

    const indexOf = channel => sortedChannelIds.indexOf(channel.params.channelId)
    return +(indexOf(nextChannel) > indexOf(prevChannel))
  }

  // Otherwise we're inside DMs
  const [nextDMStaticIndex, prevDMStaticIndex] = [next.pathname, prev.pathname].map(getStaticDMRouteIndex)
  if (nextDMStaticIndex !== -1 && prevDMStaticIndex !== -1) // If both are static DM routes, compare their indexes
    return +(nextDMStaticIndex > prevDMStaticIndex)
  if (nextChannel?.params.channelId && prevChannel?.params.channelId) { // If both are channels, compare their indexes
    const sortedChannelIds = PrivateChannelSortStore.getPrivateChannelIds()
    const indexOf = channel => sortedChannelIds.indexOf(channel.params.channelId)
    return +(indexOf(nextChannel) > indexOf(prevChannel))
  }
  if (prevChannel?.params.channelId) return 0 // If from channel, back
  if (nextChannel?.params.channelId) return 1 // If to channel, further

  return 0 // Fallback, for uncovered cases
}
