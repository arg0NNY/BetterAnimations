import { css } from '@style'
import AnimationPreview, { getPreviewHeight } from '@/modules/settings/components/AnimationPreview'
import AnimationCardControls from '@/modules/settings/components/AnimationCardControls'
import useEventListener from '@/hooks/useEventListener'
import useHover from '@/hooks/useHover'
import useWindowSize from '@/hooks/useWindowSize'
import { Clickable, CSSTransition, TransitionGroup } from '@discord/modules'
import AnimationSettings from '@/modules/settings/components/AnimationSettings'
import DiscordClasses from '@discord/classes'
import useDismissible from '@/modules/settings/hooks/useDismissible'
import useElementBounding from '@/hooks/useElementBounding'
import { createContext, use, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import HintTooltip from '@/modules/settings/components/HintTooltip'
import classNames from 'classnames'
import { getRect } from '@utils/position'
import { useIsAnimationExpanded } from '@/modules/settings/stores/SettingsStore'

export function getCardHeight (width) {
  return getPreviewHeight(width - 16) + 52
}

const CARD_WIDE_WIDTH = 320

const CARD_EXPANDED_WIDTH = 460
const CARD_EXPANDED_HEIGHT = getCardHeight(CARD_EXPANDED_WIDTH)

const TOP_BAR_HEIGHT = 0
const TOP_OFFSET = TOP_BAR_HEIGHT + 40
const BOTTOM_OFFSET = 72 + 20 // 72 is the height of the settings notice
const POPOUT_GAP = 20

const MovableContext = createContext({ styles: {} })
const MOVABLE_ATTRIBUTE = 'data-expand-movable'
export function useMovable (key) {
  return {
    [MOVABLE_ATTRIBUTE]: key,
    style: use(MovableContext).styles[key] ?? {}
  }
}

function useAnimationCardExpand ({ expanded, positionerRef, cardRef, popoutRef, refToScroller }) {
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

  const popoutMaxHeight = window.height - (TOP_OFFSET + CARD_EXPANDED_HEIGHT + POPOUT_GAP + BOTTOM_OFFSET)
  const totalHeight = CARD_EXPANDED_HEIGHT + POPOUT_GAP + popout.height

  const top = Math.max(TOP_OFFSET, Math.min(window.height - (BOTTOM_OFFSET + totalHeight), positioner.top))

  useLayoutEffect(update, [expanded, top])

  const [movableStyles, setMovableStyles] = useState({})
  useLayoutEffect(() => {
    if (!expanded || !cardRef.current) {
      setMovableStyles({})
      return
    }

    const movables = Array.from(cardRef.current.querySelectorAll(`[${MOVABLE_ATTRIBUTE}]`))
    const store = fn => Object.fromEntries(
      movables.map(movable => {
        const key = movable.getAttribute(MOVABLE_ATTRIBUTE)
        return [key, fn(movable, key)]
      })
    )

    const original = store(movable => getRect(movable, positionerRef.current))

    cardRef.current.style.width = CARD_EXPANDED_WIDTH + 'px'
    setMovableStyles(store((movable, key) => {
      const rect = getRect(movable, positionerRef.current)
      return {
        transform: [
          `translate(${rect.x - original[key].x}px, ${rect.y - original[key].y}px)`,
          `scale(${rect.width / original[key].width}, ${rect.height / original[key].height})`
        ].join(' ')
      }
    }))
    cardRef.current.style.removeProperty('width')
  }, [expanded])
  
  return {
    update,
    positionerStyle: {
      height: getCardHeight(positioner.width) + 'px'
    },
    cardStyle: {
      transform: expanded ? `translateY(${top - positioner.top}px)` : 'translateY(0)',
    },
    popoutWrapperStyle: {
      maxHeight: popoutMaxHeight + 'px',
      transform: `translateY(${top + CARD_EXPANDED_HEIGHT + POPOUT_GAP - TOP_BAR_HEIGHT}px)`
    },
    popoutStyle: {
      transformOrigin: `${(positioner.left + positioner.width / 2) - popout.left}px ${(positioner.top + positioner.height / 2) - popout.top}px`
    },
    wrap: children => (
      <MovableContext value={{ styles: movableStyles }}>
        {children}
      </MovableContext>
    )
  }
}

function AnimationCard ({
  pack,
  animation,
  name = animation?.name,
  enter,
  exit,
  setEnter,
  setExit,
  onClick,
  refToScroller,
  animationSettings,
  accordionsSettings,
  active = enter || exit,
  previewAlwaysActive = false,
  wide = false,
  errors
}) {
  const positionerRef = useRef()
  const cardRef = useRef()

  const settingsPopoutRef = useRef()
  const accordionsPopoutRef = useRef()
  const popoutRefs = useMemo(() => ({
    settings: settingsPopoutRef,
    accordions: accordionsPopoutRef
  }), [settingsPopoutRef, accordionsPopoutRef])

  const [expanded, setExpanded] = useState(null)
  const close = useCallback(() => setExpanded(null), [setExpanded])

  useIsAnimationExpanded(!!expanded)

  const {
    update,
    positionerStyle,
    cardStyle,
    popoutWrapperStyle,
    popoutStyle,
    wrap
  } = useAnimationCardExpand({
    expanded,
    positionerRef,
    cardRef,
    popoutRef: popoutRefs[expanded],
    refToScroller
  })

  useLayoutEffect(update, [animationSettings, accordionsSettings])

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

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded, close])

  useEventListener('wheel', e => {
    if (!expanded) return
    e.stopPropagation()
    e.preventDefault()
  }, cardRef)

  const hasSettings = !!animationSettings.settings.length
  const [forceOpenSettingsTooltip, setForceOpenSettingsTooltip] = useState(false)
  const expandSettings = (rightClick = false) => {
    if (expanded) return
    if (!hasSettings) return setForceOpenSettingsTooltip(true)

    setExpanded('settings')
    if (rightClick === true && !rightClickHint) setRightClickHint(true)
  }

  return wrap(
    <div
      className={classNames(
        'BA__animationCardWrapper',
        {
          'BA__animationCard--expanded': expanded,
          'BA__animationCard--wide': wide,
          'BA__animationCard--active': active
        }
      )}
    >
      <HintTooltip
        text="Right-click the card to open the settings"
        shouldShow={!rightClickHint && !!expandSettings && !expanded && hasSettings}
      >
        {props => (
          <div
            ref={positionerRef}
            className="BA__animationCardPositioner"
            style={positionerStyle}
            {...props}
          >
            <Clickable
              innerRef={cardRef}
              tag="div"
              className="BA__animationCard"
              style={cardStyle}
              onClick={onClick ?? expandSettings}
              onContextMenu={() => expandSettings?.(true)}
              onMouseLeave={() => setForceOpenSettingsTooltip(false)}
            >
              <div class="BA__animationCardBg" {...useMovable('bg')} />
              <AnimationPreview
                pack={pack}
                animation={animation}
                title={name}
                active={previewAlwaysActive || cardHovered || !!expanded}
              />
              <AnimationCardControls
                enter={enter}
                exit={exit}
                setEnter={setEnter}
                setExit={setExit}
                hasSettings={hasSettings}
                hasAccordions={!!accordionsSettings?.settings?.length}
                expanded={expanded}
                setExpanded={setExpanded}
                errors={errors}
                forceOpenSettingsTooltip={forceOpenSettingsTooltip}
              />
            </Clickable>
          </div>
        )}
      </HintTooltip>

      <div className="BA__animationCardBackdrop" onClick={close}></div>
      <TransitionGroup component={null}>
        {expanded && (
          <CSSTransition
            key={expanded}
            nodeRef={popoutRefs[expanded]}
            timeout={400}
            classNames="BA__fade"
            mountOnEnter
            unmountOnExit
          >
            <div ref={popoutRefs[expanded]} className="BA__animationCardPopoutWrapper" style={popoutWrapperStyle}>
              <div className="BA__animationCardPopout" style={popoutStyle}>
                <div className={`BA__animationCardPopoutScroller ${DiscordClasses.Scroller.thin}`}>
                  <AnimationSettings {...{
                    settings: animationSettings,
                    accordions: accordionsSettings
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

[${MOVABLE_ATTRIBUTE}] {
    transform-origin: top left;
    transition: transform .4s;
}

.BA__animationCardBackdrop {
    position: absolute;
    inset: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, .8);
    opacity: 0;
    pointer-events: none;
    transition: opacity .4s;
}

.BA__animationCardPositioner {
    position: relative;
    display: flex;
}
.BA__animationCardWrapper:nth-child(3n - 1) .BA__animationCardPositioner {
    justify-content: center;
}
.BA__animationCardWrapper:nth-child(3n) .BA__animationCardPositioner {
    justify-content: flex-end;
}

.BA__animationCard {
    position: absolute;
    width: 100%;
    padding: 8px;
    cursor: pointer;
    z-index: 10;
    transition: transform .4s, z-index .4s step-end;
    isolation: isolate;
}
.BA__animationCardBg {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 8px;
    background-color: var(--background-base-lowest);
    border: 1px solid var(--border-subtle);
    box-shadow: 0 0 0 0 var(--brand-500);
    transition: background-color .2s, box-shadow .2s, border-radius .4s, transform .4s;
}
.BA__animationCard:hover .BA__animationCardBg {
    background-color: var(--background-base-lower);
}

.BA__animationCard--wide .BA__animationCardPositioner,
.BA__animationCard--wide .BA__animationCard {
    width: ${CARD_WIDE_WIDTH}px;
}

.BA__animationCard--expanded .BA__animationCardBackdrop {
    opacity: 1;
    pointer-events: all;
}
.BA__animationCard--expanded .BA__animationCard {
    z-index: 105;
    transition: transform .4s, z-index .4s step-start;
}
.BA__animationCard--expanded .BA__animationCardBg {
    border-radius: 4px;
}

.BA__animationCard--active .BA__animationCardBg {
    box-shadow: 0 0 0 2.5px var(--brand-500);
}
.BA__animationCard--active.BA__animationCard--expanded .BA__animationCardBg {
    box-shadow: 0 0 0 1.5px var(--brand-500);
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
