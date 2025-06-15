import { Dispatcher, Flux, useStateFromStores } from '@discord/modules'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Config from '@/modules/Config'
import DispatcherEvents from '@enums/DispatcherEvents'
import SettingsSection from '@enums/SettingsSection'
import { useEffect, useId } from 'react'

let section = SettingsSection.Home
let animationExpanded = false

function handleSetSection ({ section: _section }) {
  section = _section
}
function handleSetAnimationExpanded ({ value }) {
  animationExpanded = value
}

const SettingsStore = new class SettingsStore extends Flux.Store {
  initialize () {
    [
      Events.ModuleToggled,
      Events.ModuleSettingsChanged,
      Events.SettingsChanged,
      Events.SettingsSaved
    ].forEach(event => Emitter.on(event, this.emitChange.bind(this)))
  }

  getSection () {
    return section
  }

  _getAnimationExpanded () {
    return animationExpanded
  }
  isAnimationExpanded () {
    return animationExpanded !== false
  }

  // Used by StandardSidebarView
  showNotice () {
    return Config.hasUnsavedChanges()
  }
}(Dispatcher, {
  [DispatcherEvents.SET_SETTINGS_SECTION]: handleSetSection,
  [DispatcherEvents.SET_ANIMATION_EXPANDED]: handleSetAnimationExpanded
})

export function setSection (section) {
  Dispatcher.dispatch({
    type: DispatcherEvents.SET_SETTINGS_SECTION,
    section
  })
}

export function setAnimationExpanded (value) {
  Dispatcher.dispatch({
    type: DispatcherEvents.SET_ANIMATION_EXPANDED,
    value
  })
}

export function useSection () {
  return [
    useStateFromStores([SettingsStore], () => SettingsStore.getSection()),
    setSection
  ]
}

export function useIsAnimationExpanded (useValue = null) {
  const id = useId()

  const clearIfNeeded = () => {
    if (SettingsStore._getAnimationExpanded() === id) setAnimationExpanded(false)
  }

  useEffect(() => {
    if (useValue == null) return

    if (useValue) setAnimationExpanded(id)
    else clearIfNeeded()
  }, [useValue])
  useEffect(() => clearIfNeeded, [id])

  return useStateFromStores([SettingsStore], () => SettingsStore.isAnimationExpanded())
}

export default SettingsStore
