import style from './style.css'
import { DOM, Patcher } from '@/BdApi'
import { forceAppUpdate } from '@/helpers/forceUpdate'
import Dispatcher from '@/modules/Dispatcher'
import anime from 'animejs'
import patchAppView from '@/patches/AppView/patchAppView'
import patchContextMenu from '@/patches/ContextMenu/patchContextMenu'
import patchBasePopout from '@/patches/BasePopout/patchBasePopout'
import patchTooltip from '@/patches/Tooltip/patchTooltip'
import patchChannelMessageList from '@/patches/ChannelMessageList/patchChannelMessageList'
import patchChannelView from '@/patches/ChannelView/patchChannelView'
import patchStandardSidebarView from '@/patches/StandardSidebarView/patchStandardSidebarView'
import patchModals from '@/patches/Modals/patchModals'
import patchLayers from '@/patches/Layers/patchLayers'

anime.suspendWhenDocumentHidden = false

export default function (meta) {

  return {
    start () {
      DOM.addStyle('BA-test', style)

      patchAppView()
      patchContextMenu()
      patchBasePopout()
      patchTooltip()
      patchChannelMessageList()
      patchChannelView()
      patchStandardSidebarView()
      patchModals()
      patchLayers()

      forceAppUpdate()
    },
    stop () {
      DOM.removeStyle('BA-test')

      Patcher.unpatchAll()
      Dispatcher.unsubscribeAll()

      forceAppUpdate()
    }
  }
}
