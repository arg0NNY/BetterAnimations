import { use, useCallback, useEffect, useRef, useState } from 'react'
import PreviewContext from '@preview/context/PreviewContext'

function useStages (stages, isActive = true) {
  const { store } = use(PreviewContext)
  const [stage, setStage] = useState(0)

  const timeoutId = useRef()
  const callback = useCallback(() => {
    clearTimeout(timeoutId.current)

    if (!isActive) return
    timeoutId.current = setTimeout(
      () => setStage(stage => (stage + 1) % stages.length),
      stages[stage]
    )
  }, [stage, isActive])

  // Start the timer when all animations are completed
  useEffect(() => store.watch(animations => {
    if (!animations.length) callback()
  }), [])

  // Start the timer if a new stage didn't trigger any animations
  useEffect(() => {
    const tid = setTimeout(() => {
      if (!store.animations.length) callback()
    })
    return () => clearTimeout(tid)
  }, [stage])

  // Stop the timer on unmounted
  useEffect(() => () => clearTimeout(timeoutId.current), [])

  return stage
}

export default useStages
