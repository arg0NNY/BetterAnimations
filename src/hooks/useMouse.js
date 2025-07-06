import { use, useEffect, useState } from 'react'
import { AppContext } from '@discord/modules'
import MainMouse, { Mouse } from '@shared/mouse'

export function getMouse (renderWindow) {
  return renderWindow === window ? MainMouse : new Mouse(renderWindow).initialize()
}

export function clearMouse (mouse) {
  if (mouse !== MainMouse) mouse?.shutdown()
}

function useMouse () {
  const { renderWindow } = use(AppContext)

  const [mouse, setMouse] = useState(null)
  useEffect(() => {
    setMouse(getMouse(renderWindow))
    return () => clearMouse(mouse)
  }, [])

  return mouse
}

export default useMouse
