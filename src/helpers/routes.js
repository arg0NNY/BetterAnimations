import { ChannelListCommunityRow, Constants, StaticChannelRoute } from '@/modules/DiscordModules'

export function communityRowToChannelRoute (communityRow) {
  // Keep up-to-date with the internal GuildChannelList component (`Webpack.getByKeys('GuildChannelList')` -> `renderRow` method)
  return {
    [ChannelListCommunityRow.GUILD_HOME]: StaticChannelRoute.GUILD_HOME,
    [ChannelListCommunityRow.GUILD_ROLE_SUBSCRIPTIONS]: StaticChannelRoute.ROLE_SUBSCRIPTIONS,
    [ChannelListCommunityRow.GUILD_SHOP]: StaticChannelRoute.GUILD_SHOP,
    [ChannelListCommunityRow.GUILD_MEMBER_APPLICATIONS]: StaticChannelRoute.MEMBER_APPLICATIONS,
    [ChannelListCommunityRow.CHANNELS_AND_ROLES]: [StaticChannelRoute.CHANNEL_BROWSER, StaticChannelRoute.CUSTOMIZE_COMMUNITY],
    [ChannelListCommunityRow.GUILD_MOD_DASH_MEMBER_SAFETY]: StaticChannelRoute.MEMBER_SAFETY
  }[communityRow] ?? communityRow
}

export function getStaticDMRouteIndex (pathname) {
  // Keep up-to-date with the internal `Webpack.getByStrings('hasLibraryApplication', 'getCurrentPath')`
  return [
    p => p === Constants.Routes.FRIENDS,
    p => p.startsWith(Constants.Routes.APPLICATION_LIBRARY),
    p => p.startsWith(Constants.Routes.APPLICATION_STORE),
    p => p.startsWith(Constants.Routes.ACTIVITIES),
    p => p.startsWith(Constants.Routes.MESSAGE_REQUESTS),
    p => p.startsWith(Constants.Routes.COLLECTIBLES_SHOP),
    p => p.startsWith(Constants.Routes.FAMILY_CENTER),
  ].findIndex(c => c(pathname ?? ''))
}
