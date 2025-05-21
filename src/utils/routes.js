import { GuildActionRow, Routes, StaticChannelRoute } from '@discord/modules'

export function guildActionRowToChannelRoute (guildActionRow) {
  // Keep up-to-date with the internal `GuildChannelList` component
  // (`renderRow` method, `GuildActionRow` is the case value, `StaticChannelRoute` is in the expression in `selected` prop)
  return {
    [GuildActionRow.GUILD_HOME]: StaticChannelRoute.GUILD_HOME,
    [GuildActionRow.GUILD_SCHEDULED_EVENTS]: StaticChannelRoute.GUILD_SCHEDULED_EVENTS,
    [GuildActionRow.GUILD_ROLE_SUBSCRIPTIONS]: StaticChannelRoute.ROLE_SUBSCRIPTIONS,
    [GuildActionRow.GUILD_SHOP]: StaticChannelRoute.GUILD_SHOP,
    [GuildActionRow.GUILD_MEMBER_APPLICATIONS]: StaticChannelRoute.MEMBER_APPLICATIONS,
    [GuildActionRow.CHANNELS_AND_ROLES]: [StaticChannelRoute.CHANNEL_BROWSER, StaticChannelRoute.CUSTOMIZE_COMMUNITY],
    [GuildActionRow.GUILD_MOD_DASH_MEMBER_SAFETY]: StaticChannelRoute.MEMBER_SAFETY,
    [GuildActionRow.GUILD_BOOSTS]: StaticChannelRoute.GUILD_BOOSTS
  }[guildActionRow] ?? guildActionRow
}

export function getStaticDMRouteIndex (pathname) {
  // Keep up-to-date with the internal `Webpack.getByStrings('hasLibraryApplication', 'getCurrentPath')`
  return [
    p => p === Routes.FRIENDS,
    p => p.startsWith(Routes.APPLICATION_LIBRARY),
    p => p.startsWith(Routes.MESSAGE_REQUESTS),
    p => p.startsWith(Routes.APPLICATION_STORE),
    p => p.startsWith(Routes.COLLECTIBLES_SHOP),
    p => p.startsWith(Routes.FAMILY_CENTER),
  ].findIndex(c => c(pathname ?? ''))
}
