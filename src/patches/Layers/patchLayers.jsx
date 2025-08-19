import Patcher from '@/modules/Patcher'
import { LayersKeyed, Transition, TransitionGroup } from '@discord/modules'
import ensureOnce from '@utils/ensureOnce'
import AnimeTransition from '@components/AnimeTransition'
import { passAuto } from '@utils/transition'
import DiscordClasses from '@discord/classes'
import DiscordSelectors from '@discord/selectors'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import Core from '@/modules/Core'
import { css } from '@style'
import Mouse from '@shared/mouse'
import classNames from 'classnames'
import { ErrorBoundary } from '@error/boundary'
import useTransitionCustomCondition from '@/hooks/useTransitionCustomCondition'

export let LayersComponent = null

function getWindowCenterAnchor () {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    width: 0,
    height: 0
  }
}

function Layer ({ baseLayer, hidden, children }) {
  return (
    <div
      className={classNames(
        DiscordClasses.Layers.layer,
        {
          [DiscordClasses.Layers.baseLayer]: baseLayer,
          'BA__layer--hidden': hidden
        }
      )}
    >
      {children}
    </div>
  )
}

function LayerTransition ({ layer, ...props }) {
  const isShown = useTransitionCustomCondition(layer.props.mode === 'SHOWN', props)

  return (
    <AnimeTransition
      {...props}
      in={isShown}
      container={{ className: 'BA__layerContainer' }}
      defaultLayoutStyles={false}
      mountOnEnter={false}
      unmountOnExit={false}
    >
      {state => (
        <Layer
          {...layer.props}
          key={layer.key}
          hidden={state === Transition.EXITED}
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

  Patcher.after(ModuleKey.Layers, ...LayersKeyed, (self, args, value) => {
    once(
      () => {
        LayersComponent = value?.type
        const layerStore = new LayerStore()
        injectModule(value?.type, ModuleKey.Layers)
        Patcher.after(ModuleKey.Layers, value?.type?.prototype, 'renderLayers', (self, args, value) => {
          const module = Core.getModule(ModuleKey.Layers)
          if (!module.isEnabled()) return

          const { direction, anchor } = layerStore.onRender(value.length)
          const auto = { direction, preservedMouse: anchor }

          return (
            <ErrorBoundary module={module} fallback={value}>
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
            </ErrorBoundary>
          )
        })
      }
    )
  })
}

export default patchLayers

css
`.BA__layerContainer {
    position: absolute;
    inset: 0;
}
${DiscordSelectors.Layers.layer} {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    contain: strict;
}
.BA__layer--hidden {
    visibility: hidden;
    pointer-events: none;
}`
`Layers`
