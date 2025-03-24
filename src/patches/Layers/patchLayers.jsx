import { Patcher, React } from '@/BdApi'
import { Layers, TransitionGroup } from '@/modules/DiscordModules'
import ensureOnce from '@/utils/ensureOnce'
import PassThrough from '@/components/PassThrough'
import AnimeTransition from '@/components/AnimeTransition'
import { passAuto } from '@/utils/transition'
import { DiscordClasses, DiscordSelectors } from '@/modules/DiscordSelectors'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'
import { css } from '@/modules/Style'

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

function patchLayers () {
  const once = ensureOnce()

  Patcher.after(...Layers, (self, args, value) => {
    once(
      () => {
        let prevLength = 0
        injectModule(value.type, ModuleKey.Layers)
        Patcher.after(value.type.prototype, 'renderLayers', (self, args, value) => {
          const module = Modules.getModule(ModuleKey.Layers)
          if (!module.isEnabled()) return

          const auto = {
            direction: +(value.length > prevLength)
          }

          prevLength = value.length
          return (
            <TransitionGroup component={null} childFactory={passAuto(auto)}>
              {
                value.map(layer => (
                  <PassThrough>
                    {props => (
                      <AnimeTransition
                        module={module}
                        auto={auto}
                        {...props}
                        in={layer.props.mode === 'SHOWN' && props.in}
                        key={layer.key}
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
                    )}
                  </PassThrough>
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
`.platform-win ${DiscordSelectors.Layers.layer} {
    top: -22px !important;
}
${DiscordSelectors.Layers.layers} > ${DiscordSelectors.Layers.layer} {
    contain: strict;
}`
`Layers`
