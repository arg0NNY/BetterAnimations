import { configDefaults } from '@/data/configDefaults'
import deepmerge from 'deepmerge'
import Data from '@/modules/Data'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import { fs, path } from '@/modules/Node'
import PackManager from '@/modules/PackManager'

class PackConfig {
  get filePath () { return path.resolve(PackManager.addonFolder, `${this.slug}.config.json`) }

  constructor (slug) {
    this.slug = slug
    this.current = {}
    this.load()
  }

  read () {
    try {
      return fs.existsSync(this.filePath) ? JSON.parse(fs.readFileSync(this.filePath, 'utf8')) : {}
    }
    catch (e) {
      return {}
    }
  }
  load () {
    this.current = this.read()
  }
  save (value = this.current) {
    if (!Object.keys(value).length) return
    fs.writeFileSync(this.filePath, JSON.stringify(value, null, 4), 'utf8')
  }

  getAnimationConfig (key, moduleId, type) {
    return this.current[key]?.[moduleId]?.[type] ?? {}
  }
  setAnimationConfig (key, moduleId, type, value) {
    this.current[key] ??= {}
    this.current[key][moduleId] ??= {}
    this.current[key][moduleId][type] = value
  }
}

export default new class Config {
  get dataKey () { return 'settings' }
  get defaults () { return configDefaults }

  constructor () {
    this.current = {}
    this.packs = new Map()

    this.onPackLoaded = this.onPackLoaded.bind(this)
    this.onPackUnloaded = this.onPackUnloaded.bind(this)
  }

  initialize () {
    this.load()
    this.listenPackEvents()
  }

  read () {
    return Data[this.dataKey] ?? {}
  }
  load (defaults = this.defaults) {
    this.current = deepmerge(defaults, this.read())
    this.packs.forEach(pack => pack.load())
  }
  save (value = this.current) {
    Data[this.dataKey] = value
    this.packs.forEach(pack => pack.save())
  }

  listenPackEvents () {
    Emitter.on(Events.PackLoaded, this.onPackLoaded)
    Emitter.on(Events.PackUnloaded, this.onPackUnloaded)
  }
  onPackLoaded (pack) {
    this.packs.set(pack.slug, new PackConfig(pack.slug))
  }
  onPackUnloaded (pack) {
    this.packs.delete(pack.slug)
  }
  unlistenPackEvents () {
    Emitter.off(Events.PackLoaded, this.onPackLoaded)
    Emitter.off(Events.PackUnloaded, this.onPackUnloaded)
  }

  pack (slug) {
    return this.packs.get(slug) ?? new PackConfig(slug)
  }

  shutdown () {
    this.unlistenPackEvents()
    this.packs.clear()
  }
}
