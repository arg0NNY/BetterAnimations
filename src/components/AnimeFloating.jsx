import { Floating, TransitionGroup } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import AnimeTransition from '@components/AnimeTransition'
import { useRef } from 'react'
import Position from '@enums/Position'

function getAlign(position, align) {
  switch (position) {
    case 'top':
    case 'bottom':
      switch (align) {
        case 'start': return Position.Left
        case 'end': return Position.Right
        default: return Position.Center
      }
    case 'left':
    case 'right':
      switch (align) {
        case 'start': return Position.Top
        case 'end': return Position.Bottom
        default: return Position.Center
      }
    default:
      return Position.Center
  }
}

function toPositionAlign(placement) {
  const [position, align] = placement.split('-')
  return {
    position,
    align: getAlign(position, align)
  }
}

function AnimeFloating({ module, transition, ...props }) {
  const rootValue = Floating(props)
  const floating = findInReactTree(rootValue, m => m?.props?.renderLayer)

  const anchorRef = useRef()
  const autoRef = useRef(toPositionAlign(floating.props.placement))

  const value = floating.type({
    ...floating.props,
    children: ({ ref, ...props }) => floating.props.children({
      ...props,
      ref: el => {
        ref(el)
        anchorRef.current = el
      }
    }),
    renderLayer: (props) => {
      autoRef.current = toPositionAlign(props.placement)
      return floating.props.renderLayer(props)
    }
  })

  const { children } = value.props.children[1].props

  const containerRef = useRef()
  const container = findInReactTree(children, byClassName('layer'))
  if (container) {
    const { ref } = container.props
    container.props.ref = el => {
      ref(el)
      containerRef.current = el
    }
  }

  const anchor = floating.props.overrideTargetRect
    ?? floating.props.reference
    ?? anchorRef

  value.props.children[1].props.children = (
    <TransitionGroup component={null}>
      {children && (
        <AnimeTransition
          module={module}
          containerRef={containerRef}
          anchor={anchor}
          autoRef={autoRef}
          {...transition}
        >
          {children}
        </AnimeTransition>
      )}
    </TransitionGroup>
  )

  Object.assign(floating, value)
  return rootValue
}

export default AnimeFloating
