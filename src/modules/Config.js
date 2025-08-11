import { CONFIG_VERSION, configDefaults, packConfigDefaults } from '@data/config'
import deepmerge from 'deepmerge'
import Data from '@/modules/Data'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Logger from '@logger'
import isEqual from 'lodash-es/isEqual'
import { internalPackSlugs } from '@packs'
import PackData from '@/modules/PackData'

class BaseConfig {
  get name () { return 'BaseConfig' }

  constructor (data, defaults) {
    this.data = data
    this.defaults = defaults
    this.stored = {}
    this.current = {}
  }

  getConfigVersion () {
    const configVersion = this.data.configVersion
    if (configVersion != null) return configVersion // If the config version is set, use it
    if (this.data.settings != null) return 1 // If the config version is not set, but the settings are, this is a legacy V1 config
    return CONFIG_VERSION // There is no config, fallback to the latest version
  }
  read () {
    const configVersion = this.getConfigVersion()
    if (configVersion === CONFIG_VERSION) {
      this.stored = deepmerge(this.defaults, this.data.settings ?? {})
      return
    }

    // TODO: Trigger config migrator
    Logger.warn(this.name, `Config version is outdated, falling back to defaults.`)
    this.stored = structuredClone(this.defaults)
  }
  load () {
    this.current = structuredClone(this.stored)
  }
  save () {
    this.data.configVersion = CONFIG_VERSION
    this.data.settings = this.current
    this.stored = structuredClone(this.current)
  }
  hasUnsavedChanges () {
    return !isEqual(this.current, this.stored)
  }
}


class PackConfig extends BaseConfig {
  get name () { return `PackConfig: ${this.slug}` }

  constructor (slug) {
    super(PackData.pack(slug), packConfigDefaults)

    this.slug = slug
    this.read()
    this.load()
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

export default new class Config extends BaseConfig {
  get name () { return 'Config' }

  constructor () {
    super(Data, configDefaults)

    this.packs = new Map()

    this.onPackLoaded = pack => {
      if (pack.partial) return
      this.packs.set(pack.slug, new PackConfig(pack.slug))
    }
    this.onPackUnloaded = pack => this.packs.delete(pack.slug)
  }

  initialize () {
    super.read()
    super.load()

    internalPackSlugs.forEach(slug => this.packs.set(slug, new PackConfig(slug)))

    Emitter.on(Events.PackLoaded, this.onPackLoaded)
    Emitter.on(Events.PackUnloaded, this.onPackUnloaded)

    Logger.info(this.name, 'Initialized.')
  }

  load () {
    super.load()
    this.packs.forEach(pack => pack.load())
    Emitter.emit(Events.SettingsLoaded)
    Emitter.emit(Events.SettingsChanged)
  }
  save () {
    super.save()
    this.packs.forEach(pack => pack.save())
    Emitter.emit(Events.SettingsSaved)
  }

  hasUnsavedChanges () {
    return super.hasUnsavedChanges()
      || Array.from(this.packs.values()).some(pack => pack.hasUnsavedChanges())
  }

  pack (slug) {
    return this.packs.get(slug) ?? new PackConfig(slug)
  }

  shutdown () {
    Emitter.off(Events.PackLoaded, this.onPackLoaded)
    Emitter.off(Events.PackUnloaded, this.onPackUnloaded)

    this.packs.clear()

    Logger.info(this.name, 'Shutdown.')
  }
}
