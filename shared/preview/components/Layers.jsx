import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import useStages from '@preview/hooks/useStages'
import useMouse from '@preview/hooks/useMouse'
import { Transition, TransitionGroup } from '@discord/modules'
import { passAuto } from '@utils/transition'
import PreviewTransition from '@preview/components/PreviewTransition'
import { css } from '@style'
import classNames from 'classnames'
import Main from '@preview/views/Main'
import Settings from '@preview/views/Settings'

function Layer ({ baseLayer = false, hidden = false, children }) {
  return (
    <div className={classNames(
      'BAP__layer',
      {
        'BAP__baseLayer': baseLayer,
        'BAP__layer--hidden': hidden
      }
    )}>
      {children}
    </div>
  )
}

function LayerTransition ({ baseLayer, shown, children, ...props }) {
  return (
    <PreviewTransition
      {...props}
      in={shown && props.in}
      container={{ className: 'BAP__layerContainer' }}
      defaultLayoutStyles={false}
      mountOnEnter={false}
      unmountOnExit={false}
    >
      {state => (
        <Layer baseLayer={baseLayer} hidden={state === Transition.EXITED}>
          {children}
        </Layer>
      )}
    </PreviewTransition>
  )
}

function Layers ({ layer }) {
  const [module, isActive] = useModule(ModuleKey.Layers)

  const stage = useStages(2, isActive)
  const mainMouse = useMouse({ x: 308, y: 684 })
  const settingsMouse = useMouse({ x: 1128, y: 112 })

  if (!isActive) return (
    <Layer baseLayer>{layer}</Layer>
  )

  const auto = { direction: stage, preservedMouse: mainMouse }
  const mouse = stage ? mainMouse : settingsMouse
  const props = { module, mouse, auto }

  return (
    <TransitionGroup component={null} childFactory={passAuto(auto)}>
      <LayerTransition {...props} key="main" baseLayer shown={stage === 0}>
        <Main />
      </LayerTransition>
      <LayerTransition {...props} key="settings" shown={stage === 1}>
        <Settings />
      </LayerTransition>
    </TransitionGroup>
  )
}

export default Layers

css
`.BAP__layerContainer, .BAP__layer, .BAP__layer > * {
    position: absolute;
    inset: 0;
}
.BAP__layer {
    background-color: var(--bap-background-primary);
    overflow: hidden;
    contain: strict;
}
.BAP__layer--hidden {
    visibility: hidden;
    pointer-events: none;
}
.BAP__baseLayer {
    background-color: transparent;
}`
`Preview: Layers`
