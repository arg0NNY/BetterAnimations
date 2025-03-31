import { css } from '@/modules/Style'
import AnimationPreview, { getPreviewHeight } from '@/modules/settingsRefresh/components/AnimationPreview'
import AnimationCardControls from '@/modules/settingsRefresh/components/AnimationCardControls'
import useEventListener from '@/hooks/useEventListener'
import useHover from '@/hooks/useHover'
import useWindowSize from '@/hooks/useWindowSize'
import { Common, CSSTransition, Dispatcher, TransitionGroup } from '@/modules/DiscordModules'
import AnimationSettings from '@/modules/settingsRefresh/components/AnimationSettings'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import DispatcherEvents from '@/enums/DispatcherEvents'
import useDismissible from '@/modules/settingsRefresh/hooks/useDismissible'
import useElementBounding from '@/hooks/useElementBounding'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import HintTooltip from '@/modules/settingsRefresh/components/HintTooltip'
import { Utils } from '@/BdApi'

export function getCardHeight (width) {
  return getPreviewHeight(width - 16) + 52
}

const CARD_WIDE_WIDTH = 320
const CARD_WIDE_HEIGHT = getCardHeight(CARD_WIDE_WIDTH)

const TOP_BAR_HEIGHT = 0
const TOP_OFFSET = TOP_BAR_HEIGHT + 40
const BOTTOM_OFFSET = 72 + 20 // 72 is the height of the settings notice
const POPOUT_GAP = 20

function useAnimationCardExpand ({ positionerRef, popoutRef, refToScroller }) {
  const [expanded, setExpanded] = useState(null)
  const close = useCallback(() => setExpanded(null), [setExpanded])

  const window = useWindowSize()

  const positioner = {
    ...useElementBounding(positionerRef),
    width: positionerRef.current?.clientWidth ?? 0,
    height: positionerRef.current?.clientHeight ?? 0
  }

  const getScrollerNode = useCallback(() => refToScroller.current?.getScrollerNode(), [refToScroller])
  useEventListener('scroll', positioner.update, getScrollerNode)

  const popout = useElementBounding(popoutRef)

  const update = useCallback(() => {
    positioner.update()
    popout.update()
  }, [positioner.update, popout.update])
  useLayoutEffect(update, [expanded])

  const popoutMaxHeight = window.height - (TOP_OFFSET + CARD_WIDE_HEIGHT + POPOUT_GAP + BOTTOM_OFFSET)
  const totalHeight = CARD_WIDE_HEIGHT + POPOUT_GAP + popout.height

  const top = Math.max(TOP_OFFSET, Math.min(window.height - (BOTTOM_OFFSET + totalHeight), positioner.top))

  return {
    update,
    expanded,
    setExpanded,
    close,
    positionerStyle: {
      height: getCardHeight(positioner.width) + 'px'
    },
    cardStyle: {
      transform: expanded ? `translateY(${top - positioner.top}px)` : 'translateY(0)',
    },
    popoutWrapperStyle: {
      maxHeight: popoutMaxHeight + 'px',
      transform: `translateY(${top + CARD_WIDE_HEIGHT + POPOUT_GAP - TOP_BAR_HEIGHT}px)`
    },
    popoutStyle: {
      transformOrigin: `${(positioner.left + positioner.width / 2) - popout.left}px ${(positioner.top + positioner.height / 2) - popout.top}px`
    }
  }
}

function AnimationCard ({
  name,
  enter,
  exit,
  setEnter,
  setExit,
  onClick,
  refToScroller,
  animationSettings,
  modifiersSettings,
  active = enter || exit,
  previewAlwaysActive = false,
  wide = false,
  errors
}) {
  const positionerRef = useRef()
  const cardRef = useRef()
  const popoutRef = useRef()

  const {
    update,
    expanded,
    setExpanded,
    close,
    positionerStyle,
    cardStyle,
    popoutWrapperStyle,
    popoutStyle
  } = useAnimationCardExpand({
    positionerRef,
    popoutRef,
    refToScroller
  })

  useLayoutEffect(update, [animationSettings, modifiersSettings])

  const cardHovered = useHover(cardRef)

  const [rightClickHint, setRightClickHint] = useDismissible('rightClickAnimationCard')

  useEffect(() => {
    const onKeyDown = e => {
      if (e.key !== 'Escape' || !expanded) return
      close()
      e.preventDefault()
      e.stopPropagation()
    }
    document.addEventListener('keydown', onKeyDown)
    if (expanded) Dispatcher.dispatch({ type: DispatcherEvents.ADD_PREVENT_SETTINGS_CLOSE, callback: close })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      Dispatcher.dispatch({ type: DispatcherEvents.REMOVE_PREVENT_SETTINGS_CLOSE, callback: close })
    }
  }, [expanded, close])

  useEventListener('wheel', e => {
    if (!expanded) return
    e.stopPropagation()
    e.preventDefault()
  }, cardRef)

  const [forceOpenSettingsTooltip, setForceOpenSettingsTooltip] = useState(false)
  const expandSettings = (rightClick = false) => {
    if (expanded) return
    if (!animationSettings.settings.length) return setForceOpenSettingsTooltip(true)

    setExpanded('settings')
    if (rightClick === true && !rightClickHint) setRightClickHint(true)
  }

  return (
    <div
      className={Utils.className(
        'BA__animationCardWrapper',
        {
          'BA__animationCard--expanded': expanded,
          'BA__animationCard--wide': wide,
          'BA__animationCard--active': active
        }
      )}
      onMouseLeave={() => setForceOpenSettingsTooltip(false)}
    >
      <HintTooltip
        text="Right-click the card to open the settings"
        shouldShow={!rightClickHint && !!expandSettings}
      >
        {props => (
          <div
            ref={positionerRef}
            className="BA__animationCardPositioner"
            style={positionerStyle}
            {...props}
          >
            <Common.Clickable
              innerRef={cardRef}
              tag="div"
              className="BA__animationCard"
              style={cardStyle}
              onClick={onClick ?? expandSettings}
              onContextMenu={() => expandSettings?.(true)}
            >
              {/*{active && <BackgroundOptionRing/>}*/}
              <AnimationPreview
                title={name}
                active={previewAlwaysActive || cardHovered || !!expanded}
              />
              <AnimationCardControls
                enter={enter}
                exit={exit}
                setEnter={setEnter}
                setExit={setExit}
                hasSettings={!!animationSettings.settings.length}
                hasModifiers={!!modifiersSettings?.settings?.length}
                expanded={expanded}
                setExpanded={setExpanded}
                errors={errors}
                forceOpenSettingsTooltip={forceOpenSettingsTooltip}
              />
            </Common.Clickable>
          </div>
        )}
      </HintTooltip>

      <div className="BA__animationCardBackdrop" onClick={close}></div>
      <TransitionGroup component={null}>
        {expanded && (
          <CSSTransition
            key={expanded}
            timeout={400}
            classNames="BA__fade"
            mountOnEnter
            unmountOnExit
          >
            <div ref={popoutRef} className="BA__animationCardPopoutWrapper" style={popoutWrapperStyle}>
              <div className="BA__animationCardPopout" style={popoutStyle}>
                <div className={`BA__animationCardPopoutScroller ${DiscordClasses.Scroller.thin}`}>
                  <AnimationSettings {...{
                    settings: animationSettings,
                    modifiers: modifiersSettings
                  }[expanded]} />
                </div>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
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
}

.BA__animationCardPopoutWrapper {
    position: absolute;
    top: 0;
    left: 40px;
    right: 40px;
    z-index: 100;
    display: flex;
    transition: transform .4s, translate .4s;
}
.BA__animationCardPopout {
    background-color: var(--background-primary);
    border: 1px solid var(--border-subtle);
    border-radius: 5px;
    overflow: hidden;
    flex: 1;
    display: flex;
}
.BA__animationCardPopoutScroller {
    position: relative;
    overflow: hidden scroll;
    padding: 20px;
    padding-right: 12px;
}
.BA__animationCardPopoutScroller::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background-color: var(--background-primary);
    z-index: 110;
}

.BA__animationCard {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    background-color: var(--background-base-lowest);
    border: 1px solid var(--border-subtle);
    cursor: pointer;
    transition: background-color .2s, transform .4s, width .4s, box-shadow .2s, z-index .4s step-end;
    z-index: 10;
    box-shadow: 0 0 0 0 var(--brand-500);
}
.BA__animationCard:hover {
    background-color: var(--background-base-lower);
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
    
.BA__animationCard--wide .BA__animationCardPositioner {
    height: ${CARD_WIDE_HEIGHT}px;
}
.BA__animationCard--wide .BA__animationCard,
.BA__animationCard--expanded .BA__animationCard,
.BA__animationCard--wide .BA__animationCardPositioner {
    width: ${CARD_WIDE_WIDTH}px;
}
.BA__animationCard--expanded .BA__animationCard {
    z-index: 105;
    transition: background-color .2s, transform .4s, width .4s, box-shadow .2s, z-index .4s step-start;
}

.BA__animationCard--active .BA__animationCard {
    box-shadow: 0 0 0 2.5px var(--brand-500);
}

.BA__fade-enter, .BA__fade-exit-active {
    opacity: 0;
}
:is(.BA__fade-enter, .BA__fade-exit-active) > * {
    scale: .5;
}
.BA__fade-enter-active {
    opacity: 1;
}
.BA__fade-enter-active > * {
    scale: 1;
}
.BA__fade-enter-active, .BA__fade-exit-active {
    transition: opacity .4s;
}
.BA__fade-exit-active {
    pointer-events: none;
}
:is(.BA__fade-enter-active, .BA__fade-exit-active) > * {
    transition: scale .4s;
}`
`AnimationCard`
