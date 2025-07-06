import AnimationStore from '@animation/store'
import { useEffect, useState } from 'react'

function useAnimationStore (store = AnimationStore) {
  const [animations, setAnimations] = useState([])

  useEffect(() => store.watch(setAnimations), [])

  return animations
}

export function useIsSafe (store = AnimationStore) {
  const [isSafe, setIsSafe] = useState(AnimationStore.isSafe)
  useEffect(() => store.watch((_, isSafe) => setIsSafe(isSafe)), [])

  return isSafe
}

export default useAnimationStore
