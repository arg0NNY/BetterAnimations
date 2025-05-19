import { css } from '@style'
import { Utils } from '@/BdApi'
import { useCallback, useEffect, useState } from 'react'

function toStyle (state) {
  const translate = Object.values(state.position).map(v => v + 'px').join(', ')
  return {
    transform: `translate(${translate})`,
    transition: `${state.duration}s ease transform`
  }
}

function SpotlightAnimation ({ count = 8, size = 400, areaSize = 200, speed = 50, className }) {
  const getRandomPosition = useCallback(() => ({
    x: Math.random() * areaSize,
    y: Math.random() * areaSize
  }), [areaSize])
  const generateStates = useCallback(
    () => Array.from({ length: count })
      .map(() => ({ position: getRandomPosition() })),
    [count, getRandomPosition]
  )

  const [states, setStates] = useState(generateStates())

  const generateNewState = useCallback(
    state => {
      const position = getRandomPosition()
      const duration = Math.hypot(
        Math.abs(position.x - state.position.x),
        Math.abs(position.y - state.position.y)
      ) / speed
      return {
        position,
        duration
      }
    },
    [getRandomPosition]
  )

  const updatePosition = useCallback(
    i => setStates(_states => {
      const states = [..._states]
      states[i] = generateNewState(states[i])
      return states
    }),
    [setStates, generateNewState]
  )

  useEffect(() => setStates(
    states => states.map(generateNewState)
  ), [count])

  return (
    <div
      className={Utils.className('BA__spotlightAnimation', className)}
      style={{
        width: areaSize + 'px',
        '--ba--spotlight-animation-size': size + 'px'
      }}
    >
      {states.map((state, index) => (
        <div
          className="BA__spotlightAnimationItem"
          style={toStyle(state)}
          onTransitionEnd={() => updatePosition(index)}
        />
      ))}
    </div>
  )
}

export default SpotlightAnimation

css
`.BA__spotlightAnimation {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    pointer-events: none;
    aspect-ratio: 1;
    opacity: .3;
    filter: blur(30px);
    animation: BA__rotate 30s linear infinite;
}

.BA__spotlightAnimationItem {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--ba--spotlight-animation-size);
    height: var(--ba--spotlight-animation-size);
    translate: -50% -50%;
    background: radial-gradient(circle, var(--brand-500) 30%, transparent 70%);
}

@keyframes BA__rotate {
    0% { rotate: 0deg; }
    100% { rotate: 360deg; }
}`
`SpotlightAnimation`
