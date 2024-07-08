import anime from 'animejs'
import { Patcher } from '@/BdApi'
import { forceAppUpdate } from '@/helpers/forceUpdate'
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
import { DiscordSelectors } from '@/modules/DiscordSelectors'
import Modules from '@/modules/Modules'
import TickThread from '@/modules/TickThread'
import patchChatSearchSidebar from '@/patches/ChatSearchSidebar/patchChatSearchSidebar'
import patchReferencePositionLayer from '@/patches/ReferencePositionLayer/patchReferencePositionLayer'
import patchSelect from '@/patches/Select/patchSelect'

anime.suspendWhenDocumentHidden = false

export default function (meta) {
  saveMeta(meta)

  return {
    start () {
      Logger.info('Startup', 'Initializing modules...')
      TickThread.initialize()
      Style.initialize()
      Prompt.onStartup()
      Config.initialize()
      PackRegistry.initialize()
      const packErrors = PackManager.initialize()
      if (packErrors?.length) Logger.error('Startup', 'Failed to load packs:', packErrors)
      else Logger.info('PackManager', 'Initialized.')

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
      TickThread.shutdown()
      Style.shutdown()
      Config.shutdown()
      PackRegistry.shutdown()
      PackManager.shutdown()

      Modules.shutdown()
      Common.closeAllModals()

      Logger.info('Shutdown', 'Removing patches...')
      Patcher.unpatchAll()

      Logger.info('Shutdown', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Shutdown', 'Finished.')
    },
    getSettingsPanel () {
      requestAnimationFrame(() => {
        Common.closeAllModals()
        Settings.openSettingsModal()
      })
    }
  }
}

css
`${DiscordSelectors.AppMount.appMount} {
    overflow: clip;
}`
`Index`
