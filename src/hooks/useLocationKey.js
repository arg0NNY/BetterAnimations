import { Router } from '@/modules/DiscordModules'
import { React } from '@/BdApi'

function useLocationKey (shouldChange, location = Router.useLocation()) {
  const prevLocation = React.useRef(location)
  const key = React.useRef(0)

  if (!Object.is(prevLocation.current, location)) {
    if (prevLocation.current && shouldChange(location, prevLocation.current))
      key.current += 1

    prevLocation.current = location
  }

  return key.current
}

export default useLocationKey
