import { Patcher } from '@/BdApi'
import { LayersKeyed, TransitionGroup } from '@/modules/DiscordModules'
import ensureOnce from '@/utils/ensureOnce'
import AnimeTransition from '@/components/AnimeTransition'
import { passAuto } from '@/utils/transition'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { css } from '@/modules/Style'
import Mouse from '@/modules/Mouse'
import { getWindowCenterAnchor } from '@/utils/anchor'

function LayerContainer ({ baseLayer, hidden, children }) {
  return (
    <div
      className={`${DiscordClasses.Layers.layer} ${baseLayer ? DiscordClasses.Layers.baseLayer : ''}`}
      style={hidden ? { visibility: 'hidden' } : undefined}
    >
      {children}
    </div>
  )
}

function LayerTransition ({ module, auto, layer, ...props }) {
  return (
    <AnimeTransition
      module={module}
      auto={auto}
      {...props}
      in={layer.props.mode === 'SHOWN' && props.in}
      targetContainer={e => e}
      defaultLayoutStyles={false}
      mountOnEnter={false}
      unmountOnExit={false}
    >
      {state => (
        <LayerContainer
          {...layer.props}
          key={layer.key}
          hidden={state === 'exited'}
        />
      )}
    </AnimeTransition>
  )
}

class LayerStore {
  constructor () {
    this.anchors = []
    this.currentAnchor = null
    this.currentDirection = 0
  }

  get count () {
    return this.anchors.length
  }

  getLastAnchor () {
    return this.anchors[this.anchors.length - 1]
  }

  report () {
    return {
      direction: this.currentDirection,
      anchor: this.currentAnchor ?? getWindowCenterAnchor()
    }
  }

  update (count) {
    this.anchors = Array.from({ length: count }).map(
      this.count === 0
        ? () => null
        : (_, i) => this.anchors[i] === undefined ? Mouse.getAnchor() : this.anchors[i]
    )
  }

  onRender (count) {
    if (this.count === count) return this.report()

    if (count > this.count) {
      this.currentDirection = 1
      this.update(count)
      this.currentAnchor = this.getLastAnchor()
    }
    else {
      this.currentDirection = 0
      this.currentAnchor = this.getLastAnchor()
      this.update(count)
    }

    return this.report()
  }
}

function patchLayers () {
  const once = ensureOnce()

  Patcher.after(...LayersKeyed, (self, args, value) => {
    once(
      () => {
        const layerStore = new LayerStore()
        injectModule(value.type, ModuleKey.Layers)
        Patcher.after(value.type.prototype, 'renderLayers', (self, args, value) => {
          const module = Modules.getModule(ModuleKey.Layers)
          if (!module.isEnabled()) return

          const { direction, anchor } = layerStore.onRender(value.length)
          const auto = { direction, mouse: anchor }

          return (
            <TransitionGroup component={null} childFactory={passAuto(auto)}>
              {
                value.map(layer => (
                  <LayerTransition
                    key={layer.key}
                    module={module}
                    auto={auto}
                    layer={layer}
                  />
                ))
              }
            </TransitionGroup>
          )
        })
      },
      'renderLayers'
    )
  })
}

export default patchLayers

css
`${DiscordSelectors.Layers.layers} > ${DiscordSelectors.Layers.layer} > * {
    contain: strict;
    z-index: auto;
}

.BA__layer--hidden {
    visibility: hidden;
    pointer-events: none;
}`
`Layers`
