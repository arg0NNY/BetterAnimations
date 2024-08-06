import { React } from '@/BdApi'
import { css } from '@/modules/Style'
import AnimationPreview from '@/modules/settingsRefresh/components/AnimationPreview'
import AnimationCardControls from '@/modules/settingsRefresh/components/AnimationCardControls'
import BackgroundOptionRing from '@/modules/settingsRefresh/components/BackgroundOptionRing'
import { useElementBounding, useEventListener } from '@reactuses/core'
import { CSSTransition, Platform, TransitionGroup } from '@/modules/DiscordModules'
import usePrevious from '@/hooks/usePrevious'
import useAnimationSettings from '@/modules/settingsRefresh/hooks/useAnimationSettings'
import AnimationType from '@/enums/AnimationType'
import AnimationSettings from '@/modules/settingsRefresh/components/AnimationSettings'
import { DiscordClasses } from '@/modules/DiscordSelectors'

const X_OFFSET = 40
const Y_OFFSET = 40
const TOP_OFFSET = Y_OFFSET + (Platform.isWindows() ? 22 : 0)
const BOTTOM_OFFSET = 72 + 20 // 72 is the height of the settings notice

function AnimationCard ({
  module,
  animation,
  enter,
  exit,
  setEnter,
  setExit,
  enterSettings,
  exitSettings,
  setEnterSettings,
  setExitSettings,
  resetEnterSettings,
  resetExitSettings,
  onClick,
  refToScroller,
  modifiersSettings
}) {
  const positionerRef = React.useRef()
  const cardRef = React.useRef()

  const [expanded, setExpanded] = React.useState(null)
  const close = () => setExpanded(null)

  useEventListener('wheel', e => {
    if (!expanded) return
    e.stopPropagation()
    e.preventDefault()
  }, cardRef)

  const { top, update } = useElementBounding(positionerRef)
  useEventListener('scroll', update, () => refToScroller.current?.getScrollerNode())

  const translateY = expanded ? TOP_OFFSET - top : 0
  const prevTranslateY = usePrevious(translateY)

  const base = node => node.style.transform = `translateY(0)`
  const transform = translate => node => node.style.transform = `translateY(${-translate}px)`
  const childFactory = e => {
    e.props.onExit = base
    e.props.onExiting = transform(prevTranslateY)
    return e
  }

  const animationSettings = useAnimationSettings(module, [
    {
      animation,
      type: AnimationType.Enter,
      settings: enterSettings,
      setSettings: setEnterSettings,
      enabled: enter,
      setEnabled: setEnter,
      onReset: resetEnterSettings
    },
    {
      animation,
      type: AnimationType.Exit,
      settings: exitSettings,
      setSettings: setExitSettings,
      enabled: exit,
      setEnabled: setExit,
      onReset: resetExitSettings
    }
  ])
  const expandSettings = animationSettings.settings.length ? () => setExpanded('settings') : undefined

  return (
    <div className={`BA__animationCardWrapper ${expanded ? 'BA__animationCard--expanded' : ''}`}>
      <div className="BA__animationCardBackdrop" onClick={close}></div>
      <TransitionGroup childFactory={childFactory}>
        {expanded && (
          <CSSTransition
            key={expanded}
            timeout={400}
            classNames="BA__fade"
            mountOnEnter
            unmountOnExit
            onEnter={transform(translateY)}
            onEntering={base}
          >
            <div className="BA__animationCardPopout">
              <div className={`BA__animationCardPopoutScroller ${DiscordClasses.Scroller.thin}`}>
                <AnimationSettings {...{
                  settings: animationSettings,
                  modifiers: modifiersSettings,
                }[expanded]} />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
      <div ref={positionerRef} className="BA__animationCardPositioner">
        <div
          ref={cardRef}
          className="BA__animationCard"
          style={{ transform: `translateY(${translateY}px)` }}
          onClick={onClick}
          onContextMenu={expandSettings}
        >
          {(enter || exit) && <BackgroundOptionRing />}
          <AnimationPreview title={animation.name} />
          <AnimationCardControls
            enter={enter}
            exit={exit}
            setEnter={setEnter}
            setExit={setExit}
            hasSettings={!!animationSettings.settings.length}
            hasModifiers={!!modifiersSettings?.settings?.length}
            expanded={expanded}
            setExpanded={setExpanded}
          />
        </div>
      </div>
    </div>
  )
}

export default AnimationCard

css
`.BA__animationCardWrapper {
    min-width: 0;
}

.BA__animationCardBackdrop {
    position: absolute;
    inset: 0;
    z-index: 99;
    background-color: transparent;
    pointer-events: none;
    transition: background-color .4s;
}
    
.BA__animationCardPositioner {
    position: relative;
    height: 164px;
}
    
.BA__animationCardPopout {
    position: absolute;
    top: ${223 + Y_OFFSET * 1.5}px;
    left: ${X_OFFSET}px;
    width: calc(100% - ${X_OFFSET * 2}px);
    max-height: calc(100% - ${223 + Y_OFFSET * 1.5 + BOTTOM_OFFSET}px);
    background-color: var(--background-primary);
    border-radius: 5px;
    z-index: 100;
    transition: transform .4s;
    overflow: hidden;
    display: flex;
}
.BA__animationCardPopoutScroller {
    overflow: hidden scroll;
    padding: 20px;
    padding-right: 12px;
}
.BA__animationCardPopoutScroller::-webkit-scrollbar-thumb,
.BA__animationCardPopoutScroller::-webkit-scrollbar-track {
    border-top-width: 6px;
    border-bottom-width: 6px;
}

.BA__animationCard {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    background-color: var(--background-secondary);
    cursor: pointer;
    transition: background-color .2s, transform .4s, width .4s, z-index .4s step-end;
    z-index: 10;
}
.BA__animationCard:hover {
    background-color: var(--background-secondary-alt);
}
.BA__animationCard:hover .BA__animationPreviewTitle,
.BA__animationCard--expanded .BA__animationPreviewTitle {
    opacity: 0;
}

.BA__animationCardWrapper:nth-child(3n - 1) .BA__animationCard {
    left: 50%;
    translate: -50%;
}
.BA__animationCardWrapper:nth-child(3n) .BA__animationCard {
    left: auto;
    right: 0;
}

.BA__animationCard--expanded .BA__animationCardBackdrop {
    background-color: rgba(0, 0, 0, .8);
    pointer-events: all;
}

.BA__animationCard--expanded .BA__animationCard {
    width: 320px;
    z-index: 100;
    transition: background-color .2s, transform .4s, width .4s, z-index .4s step-start;
}

.BA__fade-enter {
    opacity: 0;
}
.BA__fade-enter-active {
    opacity: 1;
    transition: all .4s;
}
.BA__fade-exit {
    opacity: 1;
}
.BA__fade-exit-active {
    opacity: 0;
    transition: all .4s;
}`
`AnimationCard`
