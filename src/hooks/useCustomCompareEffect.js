import { useEffect, useLayoutEffect, useRef } from 'react'
import useUpdate from '@shared/hooks/useUpdate'
import Logger from '@logger'

function useCustomCompareEffect (effect, deps, depsEqual) {
  if (import.meta.env.MODE === 'development') {
    if (!(Array.isArray(deps)) || !deps.length) {
      Logger.warn(
        'useCustomCompareEffect',
        '`useCustomCompareEffect` should not be used with no dependencies. Use React.useEffect instead.',
      )
    }

    if (typeof depsEqual !== 'function') {
      Logger.warn(
        'useCustomCompareEffect',
        '`useCustomCompareEffect` should be used with depsEqual callback for comparing deps list',
      )
    }
  }

  const ref = useRef(undefined)
  const forceUpdate = useUpdate()

  if (!ref.current) {
    ref.current = deps
  }

  useLayoutEffect(() => {
    if (!depsEqual(deps, ref.current)) {
      ref.current = deps
      forceUpdate()
    }
  })

  useEffect(effect, ref.current)
}

export default useCustomCompareEffect
