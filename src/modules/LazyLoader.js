import { getLazyLayerComponent } from '@/utils/layers'
import { isLazyLoaded, loadLazy } from '@utils/react'
import Logger from '@logger'
import AnimationStore from '@animation/store'
import Config from '@/modules/Config'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'

const LAYER_IDS = [
  'USER_SETTINGS',
  'CHANNEL_SETTINGS',
  'GUILD_SETTINGS',
  'COLLECTIBLES_SHOP'
]

const LoadStatus = {
  IDLE: 0,
  PENDING: 1,
  FINISHED: 2
}

class LazyLoader {
  get name () { return 'LazyLoader' }

  constructor () {
    this.active = false
    this.layers = LAYER_IDS.map(id => ({
      id,
      status: LoadStatus.IDLE
    }))

    this.iterate = () => {
      if (!this.active) return

      if (this.isIdle()) {
        const done = this.iterateLayers()
        if (done) return Logger.log(this.name, 'No modules in queue.')
      }

      requestIdleCallback(this.iterate)
    }
  }

  isIdle () {
    return !AnimationStore.animations.length
  }

  iterateLayers () {
    if (!Config.current.general.preloadLayers) return true

    const layer = this.layers.find(l => l.status !== LoadStatus.FINISHED)
    if (!layer) return true
    if (layer.status === LoadStatus.PENDING) return false

    const component = getLazyLayerComponent(layer.id)
    if (!component || isLazyLoaded(component)) {
      if (!component) Logger.warn(this.name, `Unable to find component for layer "${layer.id}". Skipping...`)
      else Logger.log(this.name, `Layer "${layer.id}" is already loaded. Skipping...`)
      layer.status = LoadStatus.FINISHED
    }
    else {
      Logger.log(this.name, `Loading layer "${layer.id}"...`)
      loadLazy(component)
        .then(() => Logger.log(this.name, `Layer "${layer.id}" was loaded.`))
        .catch(err => Logger.error(this.name, `Failed to load layer "${layer.id}":`, err))
        .finally(() => layer.status = LoadStatus.FINISHED)
    }

    return false
  }

  initialize () {
    this.active = true
    requestIdleCallback(this.iterate)
    Emitter.on(Events.SettingsChanged, this.iterate)

    Logger.info(this.name, 'Initialized.')
  }
  shutdown () {
    this.active = false
    Emitter.off(Events.SettingsChanged, this.iterate)

    Logger.info(this.name, 'Shutdown.')
  }
}

export default new LazyLoader
