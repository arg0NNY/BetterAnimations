import AnimationStore from '@animation/store'
import { useEffect, useState } from 'react'

function useAnimationStore (store = AnimationStore) {
  const [animations, setAnimations] = useState([])

  useEffect(() => store.watch(setAnimations), [])

  return animations
}

export default useAnimationStore
