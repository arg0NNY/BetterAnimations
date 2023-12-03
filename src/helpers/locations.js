import { Router, Routes, StaticChannelRoute } from '@/modules/DiscordModules'

const CHANNEL_PATH = [
  Routes.CHANNEL_THREAD_VIEW(':guildId', ':channelId', ':threadId'),
  Routes.CHANNEL(':guildId', ':channelId?', ':messageId?')
] // TODO: Take paths from Discord's <Route>

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
