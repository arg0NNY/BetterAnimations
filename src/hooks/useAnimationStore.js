import AnimationStore from '@animation/store'
import { useEffect, useState } from 'react'

function useAnimationStore (store = AnimationStore) {
  const [animations, setAnimations] = useState([])

  useEffect(() => store.watch(setAnimations), [])

  return animations
}

export function useSafeBoolean (value, store = AnimationStore) {
  const [safeValue, setSafeValue] = useState(value)

  useEffect(() => {
    if (store.isSafe) return setSafeValue(value)

    setSafeValue(false)
    return store.onceSafe(() => setSafeValue(value))
  }, [value])

  return safeValue
}

export default useAnimationStore
