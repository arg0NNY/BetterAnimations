import { CONFIG_VERSION, configDefaults, packConfigDefaults } from '@data/config'
import deepmerge from 'deepmerge'
import Data from '@/modules/Data'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import { fs, path } from '@/modules/Node'
import PackManager from '@/modules/PackManager'
import Logger from '@logger'
import isEqual from 'lodash-es/isEqual'
import { internalPackSlugs } from '@/packs'
import cloneDeep from 'lodash-es/cloneDeep'

class PackConfig {
  get name () { return `PackConfig: ${this.slug}` }

  constructor (slug) {
    this.slug = slug
  }

  reset () {
    this.current = {}
    this.save()
    Emitter.emit(Events.SettingsChanged)
  }

  createAnimationConfigEntry (key, moduleKey) {
    return {
      animation: key,
      module: moduleKey
    }
  }
  getAnimationConfigEntry (key, moduleKey, createIfMissing = false) {
    const entry = this.current.entries.find(({ animation, module }) => animation === key && module === moduleKey)
    if (entry || !createIfMissing) return entry

    const newEntry = this.createAnimationConfigEntry(key, moduleKey)
    this.current.entries.push(newEntry)
    return newEntry
  }
  getAnimationConfig (key, moduleKey, type) {
    return this.getAnimationConfigEntry(key, moduleKey)?.[type] ?? {}
  }
  setAnimationConfig (key, moduleKey, type, value) {
    this.getAnimationConfigEntry(key, moduleKey, true)[type] = value
    Emitter.emit(Events.ModuleSettingsChanged, moduleKey)
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

  save () {
    return this.config.save()
  }
}

class ExternalPackConfig extends PackConfig {
  get filePath () { return path.resolve(PackManager.addonFolder, `${this.slug}.config.json`) }
  get defaults () { return packConfigDefaults }

  constructor (slug) {
    super(slug)
    this.load()
  }

  read () {
    const config = deepmerge(
      this.defaults,
      (() => {
        try { return fs.existsSync(this.filePath) ? JSON.parse(fs.readFileSync(this.filePath, 'utf8')) : {} }
        catch { return {} }
      })()
    )
    if (config.configVersion === CONFIG_VERSION) return config

    // TODO: Trigger pack config migrator
    Logger.warn(this.name, `Config version is outdated, falling back to defaults.`)
    return cloneDeep(this.defaults)
  }
  load () {
    this.current = this.read()
  }
  save () {
    if (!this.hasUnsavedChanges()) return
    fs.writeFileSync(this.filePath, JSON.stringify(this.current, null, 4), 'utf8')
  }

  hasUnsavedChanges () {
    return !isEqual(this.current, this.read())
  }
}

export default new class Config {
  get name () { return 'Config' }
  get dataKey () { return 'settings' }
  get defaults () { return configDefaults }

  constructor () {
    this.current = {}
    this.internalPacks = new Map(
      internalPackSlugs.map(slug => [slug, new InternalPackConfig(this, slug)])
    )
    this.externalPacks = new Map()

    this.onPackLoaded = this.onPackLoaded.bind(this)
    this.onPackUnloaded = this.onPackUnloaded.bind(this)
  }

  initialize () {
    this.load()
    this.listenPackEvents()

    Logger.info('Config', 'Initialized.')
  }

  getConfigVersion () {
    const configVersion = Data.configVersion
    if (configVersion != null) return configVersion // If the config version is set, use it
    if (Data[this.dataKey] != null) return 1 // If the config version is not set, but the settings are, this is a legacy V1 config
    return Data.configVersion = CONFIG_VERSION // Otherwise, set the config version to the latest version
  }
  read () {
    const configVersion = this.getConfigVersion()
    if (configVersion === CONFIG_VERSION) return deepmerge(this.defaults, Data[this.dataKey] ?? {})

    // TODO: Trigger config migrator
    Logger.warn(this.name, 'Config version is outdated, falling back to defaults.')
    return cloneDeep(this.defaults)
  }
  load () {
    this.current = this.read()
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
    this.externalPacks.clear()

    Logger.info('Config', 'Shutdown.')
  }
}
