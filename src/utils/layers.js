import { LayersComponent } from '@/patches/Layers/patchLayers'
import findInReactTree from '@/utils/findInReactTree'

export function getLazyLayerComponent (id) {
  if (!LayersComponent) return

  const suspense = findInReactTree(
    LayersComponent.prototype.renderComponent(id),
    m => m?.type?.displayName?.startsWith('Suspense')
  )
  return suspense?.type()?.props?.children?.type
}
