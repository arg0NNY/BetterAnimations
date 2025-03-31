import anime from 'animejs'
import { Patcher } from '@/BdApi'
import { forceAppUpdate } from '@/utils/forceUpdate'
import patchAppView from '@/patches/AppView/patchAppView'
import patchContextMenu from '@/patches/ContextMenu/patchContextMenu'
import patchBasePopout from '@/patches/BasePopout/patchBasePopout'
import patchTooltip from '@/patches/Tooltip/patchTooltip'
import patchChannelMessageList from '@/patches/ChannelMessageList/patchChannelMessageList'
import patchChannelView from '@/patches/ChannelView/patchChannelView'
import patchStandardSidebarView from '@/patches/StandardSidebarView/patchStandardSidebarView'
import patchModals from '@/patches/Modals/patchModals'
import patchLayers from '@/patches/Layers/patchLayers'
import patchListThin from '@/patches/ListThin/patchListThin'
import patchGuildChannelList from '@/patches/GuildChannelList/patchGuildChannelList'
import patchMessageRequestsRoute from '@/patches/ChannelView/patchMessageRequestsRoute'
import PackManager from '@/modules/PackManager'
import Logger from '@/modules/Logger'
import Settings from '@/modules/Settings'
import { Common } from '@/modules/DiscordModules'
import Config from '@/modules/Config'
import Prompt from '@/modules/Prompt'
import PackRegistry from '@/modules/PackRegistry'
import { saveMeta } from '@/meta'
import Style, { css } from '@/modules/Style'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import Modules from '@/modules/Modules'
import patchChatSearchSidebar from '@/patches/ChatSearchSidebar/patchChatSearchSidebar'
import patchReferencePositionLayer from '@/patches/ReferencePositionLayer/patchReferencePositionLayer'
import patchSelect from '@/patches/Select/patchSelect'
import Mouse from '@/modules/Mouse'
import AnimationStore from '@/modules/AnimationStore'
import Emitter from '@/modules/Emitter'
import Notices from '@/modules/Notices'
import Toasts from '@/modules/Toasts'
import ErrorManager from '@/modules/ErrorManager'
import * as DiscordModules from '@/modules/DiscordModules'

anime.suspendWhenDocumentHidden = false

if (import.meta.env.MODE === 'development')
  window.BetterAnimations = {
    PackManager,
    Logger,
    Settings,
    Config,
    Prompt,
    PackRegistry,
    Style,
    Modules,
    Mouse,
    AnimationStore,
    Emitter,
    Notices,
    Toasts,
    ErrorManager,
    DiscordModules,
    DiscordClasses,
    anime
  }

export default function (meta) {
  saveMeta(meta)

  return {
    start () {
      Logger.info('Startup', 'Initializing modules...')
      ErrorManager.initialize()
      Mouse.initialize()
      Style.initialize()
      Prompt.onStartup()
      Config.initialize()
      PackRegistry.initialize()
      PackManager.initialize()

      Modules.initialize()

      Logger.info('Startup', 'Applying patches...')
      patchAppView()
      patchContextMenu()
      patchBasePopout()
      patchTooltip()
      patchChannelMessageList()
      patchChannelView()
      patchStandardSidebarView()
      patchModals()
      patchLayers()
      patchListThin()
      patchGuildChannelList()
      patchMessageRequestsRoute()
      patchChatSearchSidebar()
      patchReferencePositionLayer()
      patchSelect()

      Logger.info('Startup', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Startup', 'Finished.')
    },
    stop () {
      Logger.info('Shutdown', 'Shutting down modules...')
      Modules.shutdown()
      Mouse.shutdown()
      Style.shutdown()
      Config.shutdown()
      ErrorManager.shutdown()
      PackRegistry.shutdown()
      PackManager.shutdown()

      Settings.closeSettingsModal()

      Logger.info('Shutdown', 'Removing patches...')
      Patcher.unpatchAll()

      Logger.info('Shutdown', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Shutdown', 'Finished.')
    },
    getSettingsPanel () {
      queueMicrotask(() => {
        Common.closeAllModals()
        Settings.openSettingsModal()
      })
    }
  }
}

css
`${DiscordSelectors.AppMount.appMount} {
    overflow: clip;
}

${DiscordSelectors.Layer.layer} {
    isolation: isolate;
}`
`Index`
