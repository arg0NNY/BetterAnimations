import { use, useCallback, useEffect, useRef, useState } from 'react'
import PreviewContext from '@preview/context/PreviewContext'

const STAGE_DEFAULT_DURATION = 500

function useStages (stages, isActive = true) {
  if (typeof stages === 'number') stages = stages === Infinity
    ? new Proxy({ length: Infinity }, { get: (target, key) => target[key] ?? STAGE_DEFAULT_DURATION })
    : Array(stages).fill(STAGE_DEFAULT_DURATION)

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
    }, 100)
    return () => clearTimeout(tid)
  }, [stage])

  // Stop the timer on unmounted
  useEffect(() => () => clearTimeout(timeoutId.current), [])

  return stage
}

export default useStages
