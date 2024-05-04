import { Patcher, React } from '@/BdApi'
import { Layers, TransitionGroup } from '@/modules/DiscordModules'
import ensureOnce from '@/helpers/ensureOnce'
import PassThrough from '@/components/PassThrough'
import AnimeTransition from '@/components/AnimeTransition'
import { clearContainingStyles } from '@/helpers/transition'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

function LayerContainer ({ baseLayer, children }) {
  return (
    <div className={`${DiscordClasses.Layer.layer} ${baseLayer ? DiscordClasses.Layer.baseLayer : ''}`}>
      {children}
    </div>
  )
}

function patchLayers () {
  const once = ensureOnce()

  Patcher.after(Layers, 'default', (self, args, value) => {
    once(
      () => {
        injectModule(value.type, ModuleKey.Layers)
        Patcher.after(value.type.prototype, 'renderLayers', (self, args, value) => {
          const module = Modules.getModule(ModuleKey.Layers)
          if (!module.isEnabled()) return

          value.forEach(layer => layer.type = LayerContainer) // Disable Discord's internal animations

          const animations = module.getAnimations()

          return (
            <TransitionGroup component={null}>
              {
                value.map(layer => (
                  <PassThrough>
                    {props => (
                      <AnimeTransition
                        {...props}
                        in={layer.props.mode === 'SHOWN' && props.in}
                        key={layer.key}
                        mountOnEnter={false}
                        unmountOnExit={false}
                        animations={animations}
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
