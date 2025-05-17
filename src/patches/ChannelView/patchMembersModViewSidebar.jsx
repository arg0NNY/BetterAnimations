import Patcher from '@/modules/Patcher'
import { ChannelSectionStore, MembersModViewSidebarKeyed, useStateFromStores } from '@/modules/DiscordModules'
import ModuleKey from '@/enums/ModuleKey'
import useModule from '@/hooks/useModule'
import SidebarTransition from '@/patches/ChannelView/components/SidebarTransition'
import useWindow from '@/hooks/useWindow'

function patchMembersModViewSidebar () {
  Patcher.after(...MembersModViewSidebarKeyed, (self, [{ guildId }], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!isMainWindow || (!module.isEnabled() && !switchModule.isEnabled())) return

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
