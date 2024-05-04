import { Router } from '@/modules/DiscordModules'
import { React } from '@/BdApi'
import usePrevious from '@/hooks/usePrevious'

function useLocationKey (shouldSwitch, getSwitchDirection = () => 0, location = Router.useLocation()) {
  const prevLocation = usePrevious(location)
  const key = React.useRef(0)
  let direction = 0

  if (prevLocation && !Object.is(prevLocation, location) && shouldSwitch(location, prevLocation)) {
    key.current += 1
    direction = getSwitchDirection(location, prevLocation)
  }

  return [key.current, direction]
}

export default useLocationKey
