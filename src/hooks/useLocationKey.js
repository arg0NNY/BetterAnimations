import { Router } from '@/modules/DiscordModules'
import { React } from '@/BdApi'
import usePrevious from '@/hooks/usePrevious'

function useLocationKey (shouldChange, location = Router.useLocation()) {
  const prevLocation = usePrevious(location)
  const key = React.useRef(0)

  if (!Object.is(prevLocation, location)) {
    if (prevLocation && shouldChange(location, prevLocation))
      key.current += 1
  }

  return key.current
}

export default useLocationKey
