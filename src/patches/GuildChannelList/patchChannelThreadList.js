import Patcher from '@/modules/Patcher'
import { ChannelThreadList } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import ModuleKey from '@enums/ModuleKey'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'

function patchChannelThreadList () {
  Patcher.after(ModuleKey.ChannelList, ChannelThreadList, 'type', (self, [props], value) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.ChannelList)
    if (!isMainWindow || !module.isEnabled()) return

    const container = findInReactTree(value, m => m?.type === 'li')
    if (!container) return

    container.props.ref = props.ref
  })
}

export default patchChannelThreadList
