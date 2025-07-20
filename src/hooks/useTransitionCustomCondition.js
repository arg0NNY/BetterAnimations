import { useEffect } from 'react'
import usePrevious from '@/hooks/usePrevious'

/**
 * Ensure to trigger `onExited` used by `TransitionGroup` to determine if it should unmount the child
 * even if animation did not execute when `in` prop passed by `TransitionGroup` changed.
 * This may happen if the child connects an additional condition on top of the received `in` value.
 */
function useTransitionCustomCondition (condition, props) {
  const isShown = condition && props.in
  const wasShown = usePrevious(isShown)

  useEffect(() => {
    if (!props.in && !wasShown) props.onExited?.()
  }, [props.in])

  return isShown
}

export default useTransitionCustomCondition
