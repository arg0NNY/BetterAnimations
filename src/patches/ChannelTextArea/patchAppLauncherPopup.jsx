import Patcher from '@/modules/Patcher'
import { AppLauncherPopup } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'

function patchAppLauncherPopup () {
  Patcher.after(ModuleKey.Popouts, AppLauncherPopup, 'type', (self, [props], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return

    const positionLayer = findInReactTree(value, byClassName('positionLayer'))
    if (!positionLayer) return

    positionLayer.props.ref = props.layerRef
    positionLayer.props.onPositionChange = props.onPositionChange
  })
}

export default patchAppLauncherPopup
