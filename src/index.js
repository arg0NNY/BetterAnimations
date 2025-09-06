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
import PackManager from '@/modules/PackManager'
import Logger from '@logger'
import Settings from '@/settings'
import { ModalActions } from '@discord/modules'
import Config from '@/modules/Config'
import Prompt from '@/modules/Prompt'
import PackRegistry from '@/modules/PackRegistry'
import { saveMeta } from '@/meta'
import Style, { css } from '@style'
import DiscordClasses from '@discord/classes'
import Core from '@/modules/Core'
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
import LazyLoader from '@/modules/LazyLoader'
import { applyOptimizationPatches } from '@/patches/optimizations'
import patchRootElementContext from '@/patches/AppView/patchRootElementContext'
import Data from '@/modules/Data'
import patchBasePopover from '@/patches/BasePopover/patchBasePopover'
import Changelog from '@/modules/Changelog'
import PackData from '@/modules/PackData'
import Events from '@enums/Events'

if (import.meta.env.MODE === 'development')
  window.BetterAnimations = {
    PackManager,
    Logger,
    Settings,
    Config,
    Prompt,
    PackRegistry,
    Style,
    Core,
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
    Documentation,
    DispatchController,
    Data,
    PackData,
    Changelog
  }

export default function (meta) {
  saveMeta(meta)

  return {
    start () {
      Logger.info('Startup', 'Initializing modules...')
      ErrorManager.initialize()
      PackData.initialize()
      Config.initialize()
      Mouse.initialize()
      Style.initialize()
      Changelog.initialize()
      PackRegistry.initialize()
      PackManager.initialize()
      AnimationStore.initialize()
      Core.initialize()
      DispatchController.initialize()
      LazyLoader.initialize()

      Validator.onStartup()
      Prompt.onStartup()

      Logger.info('Startup', 'Applying patches...')
      patchAppView()
      patchContextMenu()
      patchMenuItem()
      patchBasePopout()
      patchBasePopover()
      patchTooltip()
      patchChannelMessageList()
      patchChannelView()
      patchStandardSidebarView()
      patchModals()
      patchLayers()
      patchListThin()
      patchGuildChannelList()
      patchReferencePositionLayer()
      patchSelect()
      patchChannelTextArea()
      patchPopToast()
      patchRootElementContext()
      applyOptimizationPatches()

      Logger.info('Startup', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Startup', 'Finished.')
    },
    stop () {
      Emitter.emit(Events.PluginDisabled)

      Logger.info('Shutdown', 'Shutting down modules...')
      Core.shutdown()
      Mouse.shutdown()
      Style.shutdown()
      Config.shutdown()
      PackData.shutdown()
      ErrorManager.shutdown()
      Changelog.shutdown()
      PackRegistry.shutdown()
      PackManager.shutdown()
      AnimationStore.shutdown()
      DispatchController.shutdown()
      LazyLoader.shutdown()

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
}`
`General`
