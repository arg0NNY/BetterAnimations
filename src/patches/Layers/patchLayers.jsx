import { Patcher } from '@/BdApi'
import { Layers, TransitionGroup } from '@/modules/DiscordModules'
import ensureOnce from '@/helpers/ensureOnce'
import PassThrough from '@/components/PassThrough'
import AnimeTransition from '@/components/AnimeTransition'
import { tempAnimationData } from '@/patches/AppView/patchAppView'
import { clearContainingStyles } from '@/helpers/transition'

const once = ensureOnce()

function patchLayers () {
  Patcher.after(Layers, 'default', (self, args, value) => {
    once(
      () => Patcher.after(value.type.prototype, 'renderLayers', (self, args, value) => {
        once(
          () => {
            // Disable Discord's internal layer animations
            const prototype = value[0].type.prototype
            Patcher.instead(prototype, 'getAnimatedStyle', () => ({}))
            Patcher.instead(prototype, 'animateIn', (self, [fn]) => self.animateComplete(fn))
            Patcher.instead(prototype, 'animateOut', (self, [fn]) => fn())
            Patcher.instead(prototype, 'animateUnder', (self) => self.animateComplete())
          },
          'animate'
        )

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
                      animation={tempAnimationData}
                      options={{
                        type: 'switch'
                      }}
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
      }),
      'renderLayers'
    )
  })
}

export default patchLayers
