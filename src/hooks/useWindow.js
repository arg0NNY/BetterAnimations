import { useContext } from 'react'
import { AppContext } from '@discord/modules'

const mainWindow = window

function useWindow () {
  const { renderWindow } = useContext(AppContext)

  return {
    window: renderWindow,
    isMainWindow: renderWindow === mainWindow
  }
}

export function MainWindowOnly ({ children, fallback }) {
  const { isMainWindow } = useWindow()
  return isMainWindow
    ? (typeof children === 'function' ? children() : children)
    : fallback
}

export default useWindow
