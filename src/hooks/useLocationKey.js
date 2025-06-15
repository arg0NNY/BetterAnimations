import { Router } from '@discord/modules'
import usePrevious from '@/hooks/usePrevious'
import { useRef } from 'react'

function useLocationKey (shouldSwitch, getSwitchDirection = () => 0, location = Router.useLocation()) {
  const prevLocation = usePrevious(location)
  const key = useRef(0)
  let direction = 0

  if (prevLocation && !Object.is(prevLocation, location) && shouldSwitch(location, prevLocation)) {
    key.current += 1
    direction = getSwitchDirection(location, prevLocation)
  }

  return [key.current, direction]
}

export default useLocationKey
