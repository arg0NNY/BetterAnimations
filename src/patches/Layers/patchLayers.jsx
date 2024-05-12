import { Patcher, React } from '@/BdApi'
import { Layers, TransitionGroup } from '@/modules/DiscordModules'
import ensureOnce from '@/helpers/ensureOnce'
import PassThrough from '@/components/PassThrough'
import AnimeTransition from '@/components/AnimeTransition'
import { clearContainingStyles, passAnimations } from '@/helpers/transition'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

function LayerContainer ({ baseLayer, children }) {
  return (
    <div className={`${DiscordClasses.Layers.layer} ${baseLayer ? DiscordClasses.Layers.baseLayer : ''}`}>
      {children}
    </div>
  )
}

function patchLayers () {
  const once = ensureOnce()

  Patcher.after(Layers, 'default', (self, args, value) => {
    once(
      () => {
        let prevLength = 0
        injectModule(value.type, ModuleKey.Layers)
        Patcher.after(value.type.prototype, 'renderLayers', (self, args, value) => {
          const module = Modules.getModule(ModuleKey.Layers)
          if (!module.isEnabled()) return

          value.forEach(layer => layer.type = LayerContainer) // Disable Discord's internal animations

          const animations = module.getAnimations({
            auto: {
              direction: +(value.length > prevLength)
            }
          })

          // TODO: Hide layers that are not visible (you can see them in the back with some animations)
          prevLength = value.length
          return (
            <TransitionGroup component={null} childFactory={passAnimations(animations)}>
              {
                value.map(layer => (
                  <PassThrough>
                    {props => (
                      <AnimeTransition
                        animations={animations}
                        {...props}
                        in={layer.props.mode === 'SHOWN' && props.in}
                        key={layer.key}
                        mountOnEnter={false}
                        unmountOnExit={false}
                        options={{ type: 'switch' }}
                        onEntered={clearContainingStyles}
                      >
                        {layer}
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
