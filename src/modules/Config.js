import { configDefaults } from '@/data/configDefaults'
import deepmerge from 'deepmerge'
import Data from '@/modules/Data'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import { fs, path } from '@/modules/Node'
import PackManager from '@/modules/PackManager'
import Logger from '@/modules/Logger'
import isEqual from 'lodash-es/isEqual'
import { internalPackSlugs } from '@/packs'

class PackConfig {
  constructor (slug) {
    this.slug = slug
  }

  getAnimationConfig (key, moduleId, type) {
    return this.current[key]?.[moduleId]?.[type] ?? {}
  }
  setAnimationConfig (key, moduleId, type, value) {
    this.current[key] ??= {}
    this.current[key][moduleId] ??= {}
    this.current[key][moduleId][type] = value
    Emitter.emit(Events.ModuleSettingsChanged, moduleId)
  }
}

class InternalPackConfig extends PackConfig {
  constructor (config, slug) {
    super(slug)
    this.config = config
  }

  get current () {
    return this.config.current.packs[this.slug]
  }
  set current (value) {
    this.config.current.packs[this.slug] = value
  }
}

class ExternalPackConfig extends PackConfig {
  get filePath () { return path.resolve(PackManager.addonFolder, `${this.slug}.config.json`) }

  constructor (slug) {
    super(slug)
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
  save () {
    if (!this.hasUnsavedChanges()) return
    fs.writeFileSync(this.filePath, JSON.stringify(this.current, null, 4), 'utf8')
  }
  reset () {
    this.current = {}
    this.save()
    Emitter.emit(Events.SettingsChanged)
  }

  hasUnsavedChanges () {
    return !isEqual(this.current, this.read())
  }
}

export default new class Config {
  get dataKey () { return 'settings' }
  get defaults () { return configDefaults }

  constructor () {
    this.current = {}
    this.internalPacks = new Map()
    this.externalPacks = new Map()

    this.onPackLoaded = this.onPackLoaded.bind(this)
    this.onPackUnloaded = this.onPackUnloaded.bind(this)
  }

  initialize () {
    this.load()
    this.listenPackEvents()

    Logger.info('Config', 'Initialized.')
  }

  read () {
    return deepmerge(this.defaults, Data[this.dataKey] ?? {})
  }
  load () {
    this.current = this.read()
    internalPackSlugs.forEach(slug => this.internalPacks.set(slug, new InternalPackConfig(this, slug)))
    this.externalPacks.forEach(pack => pack.load())
    Emitter.emit(Events.SettingsLoaded)
    Emitter.emit(Events.SettingsChanged)
  }
  save () {
    if (!this.hasUnsavedChanges()) return
    Data[this.dataKey] = this.current
    this.externalPacks.forEach(pack => pack.save())
    Emitter.emit(Events.SettingsSaved)
  }

  hasUnsavedChanges () {
    return !isEqual(this.current, this.read())
      || Array.from(this.externalPacks.values()).some(pack => pack.hasUnsavedChanges())
  }

  listenPackEvents () {
    Emitter.on(Events.PackLoaded, this.onPackLoaded)
    Emitter.on(Events.PackUnloaded, this.onPackUnloaded)
  }
  onPackLoaded (pack) {
    if (pack.partial) return
    this.externalPacks.set(pack.slug, new ExternalPackConfig(pack.slug))
  }
  onPackUnloaded (pack) {
    this.externalPacks.delete(pack.slug)
  }
  unlistenPackEvents () {
    Emitter.off(Events.PackLoaded, this.onPackLoaded)
    Emitter.off(Events.PackUnloaded, this.onPackUnloaded)
  }

  pack (slug) {
    return internalPackSlugs.includes(slug)
      ? (this.internalPacks.get(slug) ?? new InternalPackConfig(this, slug))
      : (this.externalPacks.get(slug) ?? new ExternalPackConfig(slug))
  }

  shutdown () {
    this.unlistenPackEvents()
    this.internalPacks.clear()
    this.externalPacks.clear()

    Logger.info('Config', 'Shutdown.')
  }
}
