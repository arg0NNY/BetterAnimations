import Patcher from '@/modules/Patcher'
import { ChannelSectionStore, MembersModViewSidebarKeyed, useStateFromStores } from '@discord/modules'
import ModuleKey from '@enums/ModuleKey'
import useModule from '@/hooks/useModule'
import SidebarTransition from '@/patches/ChannelView/components/SidebarTransition'
import useWindow from '@/hooks/useWindow'
import { ErrorBoundary } from '@error/boundary'
import findInReactTree from '@/utils/findInReactTree'

function injectContainerRef (children, ref) {
  const div = findInReactTree(children, m => m?.type === 'div')
  if (div) div.props.ref = ref
}

async function patchMembersModViewSidebar () {
  Patcher.after(...await MembersModViewSidebarKeyed, (self, [{ guildId }], value) => {
    const state = useStateFromStores([ChannelSectionStore], () => ChannelSectionStore.getGuildSidebarState(guildId), [guildId])

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ThreadSidebar)
    const switchModule = useModule(ModuleKey.ThreadSidebarSwitch)
    if (!isMainWindow || (!module.isEnabled() && !switchModule.isEnabled())) return

    return (
      <ErrorBoundary fallback={value}>
        <SidebarTransition
          module={module}
          switchModule={switchModule}
          state={state}
          injectContainerRef={injectContainerRef}
        >
          {value}
        </SidebarTransition>
      </ErrorBoundary>
    )
  })
}

export default patchMembersModViewSidebar
