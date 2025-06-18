import Patcher from '@/modules/Patcher'
import { ExpressionPicker, useExpressionPickerStoreKeyed } from '@discord/modules'
import findInReactTree from '@/utils/findInReactTree'
import { css } from '@style'
import AnimeContainer from '@components/AnimeContainer'
import useWindow from '@/hooks/useWindow'
import useModule from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { ErrorBoundary } from '@error/boundary'

function patchExpressionPicker () {
  let expressionPickerRendering = false

  Patcher.before(...useExpressionPickerStoreKeyed, (self, args) => {
    if (!expressionPickerRendering) return
    args[0] = state => state.activeView ?? state.lastActiveView
  })

  Patcher.instead(ModuleKey.Popouts, ExpressionPicker, 'type', (self, [props], original) => {
    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Popouts)
    if (!isMainWindow || !module.isEnabled()) return original(props)

    expressionPickerRendering = true
    let value
    try { value = original(props) }
    finally { expressionPickerRendering = false }

    const positionLayer = findInReactTree(value, m => m?.className?.includes('positionLayer'))
    if (!positionLayer) return value

    positionLayer.onPositionChange = props.onPositionChange

    Patcher.after(ModuleKey.Popouts, positionLayer, 'children', (self, args, value) => {
      const drawerSizingWrapper = findInReactTree(value, m => m?.className?.includes('drawerSizingWrapper'))
      if (!drawerSizingWrapper) return

      const { children } = drawerSizingWrapper
      const contentWrapperIndex = children.findIndex(i => i?.props?.className?.includes('contentWrapper'))
      if (contentWrapperIndex === -1) return

      children[contentWrapperIndex] = (
        <ErrorBoundary module={module} fallback={children[contentWrapperIndex]}>
          <AnimeContainer
            ref={props.__containerRef}
            container={{ className: 'BA__expressionPickerContainer' }}
          >
            {children[contentWrapperIndex]}
          </AnimeContainer>
        </ErrorBoundary>
      )
    })

    return value
  })
}

export default patchExpressionPicker

css
`.BA__expressionPickerContainer {
    height: 100%;
}`
`ExpressionPicker`
