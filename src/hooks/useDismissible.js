import Data, { useData } from '@/modules/Data'
import { useCallback } from 'react'

export function isDismissed (name) {
  return Data.dismissibles[name] === true
}

function useDismissible (name) {
  const [dismissibles] = useData('dismissibles')

  return [
    dismissibles[name] === true,
    useCallback(value => dismissibles[name] = value, [name])
  ]
}

export default useDismissible
