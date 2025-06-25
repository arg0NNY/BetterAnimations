import Patcher from '@/modules/Patcher'
import { ChannelSectionStore, MembersModViewSidebarKeyed, useStateFromStores } from '@discord/modules'
import ModuleKey from '@enums/ModuleKey'
import useModule from '@/hooks/useModule'
import SidebarTransition from '@/patches/ChannelView/components/SidebarTransition'
import useWindow from '@/hooks/useWindow'
import AnimeContainer from '@components/AnimeContainer'
import { ErrorBoundary } from '@error/boundary'

async function patchMembersModViewSidebar () {
  Patcher.after(...await MembersModViewSidebarKeyed, (self, [{ guildId }], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!isMainWindow || (!module.isEnabled() && !switchModule.isEnabled())) return

    const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getGuildSidebarState(guildId), [guildId])

    return (
      <ErrorBoundary fallback={value}>
        <SidebarTransition
          module={module}
          switchModule={switchModule}
          state={state}
        >
          <AnimeContainer container={{ className: 'BA__sidebar' }}>
            {value}
          </AnimeContainer>
        </SidebarTransition>
      </ErrorBoundary>
    )
  })
}

export default patchMembersModViewSidebar
