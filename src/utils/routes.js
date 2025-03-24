import { ChannelListCommunityRow, Routes, StaticChannelRoute } from '@/modules/DiscordModules'

export function communityRowToChannelRoute (communityRow) {
  // Keep up-to-date with the internal GuildChannelList component (`Webpack.getModule(Filters.byStrings('favorites-channel-list'), { searchExports: true })` -> `renderRow` method)
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
    p => p === Routes.FRIENDS,
    p => p.startsWith(Routes.APPLICATION_LIBRARY),
    p => p.startsWith(Routes.APPLICATION_STORE),
    p => p.startsWith(Routes.ACTIVITIES),
    p => p.startsWith(Routes.MESSAGE_REQUESTS),
    p => p.startsWith(Routes.COLLECTIBLES_SHOP),
    p => p.startsWith(Routes.FAMILY_CENTER),
  ].findIndex(c => c(pathname ?? ''))
}
