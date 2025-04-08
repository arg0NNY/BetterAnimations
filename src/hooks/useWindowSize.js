import { useRef } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim'

function subscribe (callback) {
  window.addEventListener('resize', callback)
  return () => {
    window.removeEventListener('resize', callback)
  }
}

function useWindowSize () {
  const stateDependencies = useRef({}).current
  const previous = useRef({
    width: 0,
    height: 0,
  })
  const isEqual = (prev, current) => {
    for (const t in stateDependencies) {
      if (current[t] !== prev[t]) {
        return false
      }
    }
    return true
  }

  const cached = useSyncExternalStore(
    subscribe,
    () => {
      const data = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      if (!isEqual(previous.current, data)) {
        previous.current = data
        return data
      }
      return previous.current
    },
    () => {
      return previous.current
    },
  )

  return {
    get width() {
      stateDependencies.width = true
      return cached.width
    },
    get height() {
      stateDependencies.height = true
      return cached.height
    },
  }
}

export default useWindowSize
