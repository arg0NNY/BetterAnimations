import anime from 'animejs'
import style from './style.css'
import { DOM, Patcher } from '@/BdApi'
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
import { ModalActions } from '@/modules/DiscordModules'
import Config from '@/modules/Config'
import Prompt from '@/modules/Prompt'

anime.suspendWhenDocumentHidden = false

export default function (meta) {

  return {
    start () {
      Logger.info('Startup', 'Injecting styles...')
      DOM.addStyle('BA-test', style)

      Logger.info('Startup', 'Initializing modules...')
      Config.initialize()
      const packErrors = PackManager.initialize()
      if (packErrors?.length) Logger.error('Startup', 'Failed to load packs:', packErrors)
      else Logger.info('PackManager', 'Initialized.')

      console.log(PackManager)
      window.PackManager = PackManager

      Prompt.onStartup()

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

      Logger.info('Startup', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Startup', 'Finished.')
    },
    stop () {
      Logger.info('Shutdown', 'Removing styles...')
      DOM.removeStyle('BA-test')

      Logger.info('Shutdown', 'Shutting down modules...')
      Config.shutdown()
      PackManager.shutdown()

      Logger.info('Shutdown', 'Removing patches...')
      Patcher.unpatchAll()

      Logger.info('Shutdown', 'Forcing app update...')
      forceAppUpdate()
      Logger.info('Shutdown', 'Finished.')
    },
    getSettingsPanel () {
      requestAnimationFrame(() => {
        ModalActions.closeAllModals()
        Settings.openSettingsModal()
      })
    }
  }
}
