import Patcher from '@/modules/Patcher'
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
import Logger from '@logger'
import Settings from '@/modules/Settings'
import { ModalActions } from '@discord/modules'
import Config from '@/modules/Config'
import Prompt from '@/modules/Prompt'
import PackRegistry from '@/modules/PackRegistry'
import { saveMeta } from '@/meta'
import Style, { css } from '@style'
import DiscordClasses from '@discord/classes'
import Modules from '@/modules/Modules'
import patchChatSearchSidebar from '@/patches/ChatSearchSidebar/patchChatSearchSidebar'
import patchReferencePositionLayer from '@/patches/ReferencePositionLayer/patchReferencePositionLayer'
import patchSelect from '@/patches/Select/patchSelect'
import Mouse from '@shared/mouse'
import AnimationStore from '@animation/store'
import Emitter from '@/modules/Emitter'
import Notices from '@/modules/Notices'
import Toasts from '@/modules/Toasts'
import ErrorManager from '@error/manager'
import * as DiscordModules from '@discord/modules'
import * as anime from 'animejs'
import Utils from '@/modules/Utils'
import patchMenuItem from '@/patches/ContextMenu/patchMenuItem'
import Documentation from '@shared/documentation'
import patchChannelTextArea from '@/patches/ChannelTextArea/patchChannelTextArea'
import patchPopToast from '@/patches/Toast/patchPopToast'
import Validator from '@discord/validator'
import DispatchController from '@/modules/DispatchController'
import patchGenerateUserSettingsSections from '@/patches/UserSettings/patchGenerateUserSettingsSections'

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
    anime,
    Utils,
    Documentation
  }

export default function (meta) {
  saveMeta(meta)

  return {
    start () {
      Logger.info('Startup', 'Initializing modules...')
      ErrorManager.initialize()
      Config.initialize()
      Mouse.initialize()
      Style.initialize()
      PackManager.initialize()
      PackRegistry.initialize()
      AnimationStore.initialize()
      Modules.initialize()
      DispatchController.initialize()

      Validator.onStartup()
      Prompt.onStartup()

      Logger.info('Startup', 'Applying patches...')
      patchAppView()
      patchContextMenu()
      patchMenuItem()
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
      patchChannelTextArea()
      patchPopToast()
      patchGenerateUserSettingsSections()

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
      AnimationStore.shutdown()
      DispatchController.shutdown()

      Settings.closeSettingsModal()

      Logger.info('Shutdown', 'Removing patches...')
      Patcher.unpatchAll()

      Logger.info('Shutdown', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Shutdown', 'Finished.')
    },
    getSettingsPanel () {
      queueMicrotask(() => {
        ModalActions.closeAllModals()
        Settings.openSettingsModal()
      })
    }
  }
}

css
`#app-mount {
    overflow: clip;
}

.BA__buttonContents {
    display: flex;
    align-items: center;
    gap: 4px;
}`
`General`
