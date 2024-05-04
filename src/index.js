import anime from 'animejs'
import style from './style.css'
import { DOM, Patcher } from '@/BdApi'
import { forceAppUpdate } from '@/helpers/forceUpdate'
import Dispatcher from '@/modules/Dispatcher'
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
import PackManager from '@/modules/PackManager'
import Logger from '@/modules/Logger'
import Settings from '@/modules/Settings'
import { ModalActions } from '@/modules/DiscordModules'

anime.suspendWhenDocumentHidden = false

export default function (meta) {

  return {
    start () {
      DOM.addStyle('BA-test', style)

      const packErrors = PackManager.initialize()
      if (packErrors?.length) Logger.error('Startup', 'Failed to load packs:', packErrors)

      console.log(PackManager)
      window.PackManager = PackManager

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

      forceAppUpdate()
    },
    stop () {
      DOM.removeStyle('BA-test')

      PackManager.unwatchAddons()

      Patcher.unpatchAll()
      Dispatcher.unsubscribeAll()

      forceAppUpdate()
    },
    getSettingsPanel () {
      requestAnimationFrame(() => {
        ModalActions.closeAllModals()
        Settings.openSettingsModal()
      })
    }
  }
}
