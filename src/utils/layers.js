import { LayersComponent } from '@/patches/Layers/patchLayers'
import findInReactTree from '@/utils/findInReactTree'
import Logger from '@logger'

export function getLazyLayerComponent (id) {
  if (!LayersComponent) return

  try {
    const suspense = findInReactTree(
      LayersComponent.prototype.renderComponent(id),
      m => m?.type?.displayName?.startsWith('Suspense')
    )
    return suspense?.type()?.props?.children?.type
  } catch (error) {
    Logger.err('getLazyLayerComponent', error)
  }
}
