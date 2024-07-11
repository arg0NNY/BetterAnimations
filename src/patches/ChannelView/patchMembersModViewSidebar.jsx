import { Patcher } from '@/BdApi'
import { ChannelSectionStore, MembersModViewSidebar, useStateFromStores } from '@/modules/DiscordModules'
import ModuleKey from '@/enums/ModuleKey'
import useModule from '@/hooks/useModule'
import SidebarTransition from '@/patches/ChannelView/components/SidebarTransition'

function patchMembersModViewSidebar () {
  Patcher.after(...MembersModViewSidebar, (self, [{ guildId }], value) => {
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!module.isEnabled() && !switchModule.isEnabled()) return

    const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getGuildSidebarState(guildId), [guildId])

    return (
      <SidebarTransition
        module={module}
        switchModule={switchModule}
        state={state}
      >
        {value}
      </SidebarTransition>
    )
  })
}

export default patchMembersModViewSidebar
