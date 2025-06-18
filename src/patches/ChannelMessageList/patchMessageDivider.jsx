import Patcher from '@/modules/Patcher'
import { MessageDivider } from '@discord/modules'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useWindow from '@/hooks/useWindow'

function patchMessageDivider() {
  Patcher.after(ModuleKey.Messages, MessageDivider, 'render', (self, [props], value) => {
    // Transform message divider DOM tree to unified "container -> element" structure

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Messages)
    if (!isMainWindow || !module.isEnabled()) return

    const { children, className, ...rest } = value.props
    value.props = {
      children,
      className: className.replace(props.className, '')
    }

    return (
      <div className={props.className} {...rest}>
        {value}
      </div>
    )
  })
}

export default patchMessageDivider
