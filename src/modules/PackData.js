import path from 'path'
import fs from 'fs'
import PackManager from '@/modules/PackManager'
import Data, { DataField } from '@data'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Logger from '@logger'
import PluginData from '@/modules/Data'
import { internalPackSlugs } from '@packs'

// https://github.com/BetterDiscord/BetterDiscord/blob/8b7649f85bfe4300fbef58186def214ba7f33f94/src/betterdiscord/stores/json.ts
export const ExternalPackDataStore = new class {
  constructor () {
    this.cache = {}
  }

  _getFile (slug) {
    return path.resolve(PackManager.addonFolder, `${slug}.config.json`)
  }
  _ensureData (slug) {
    if (typeof (this.cache[slug]) !== 'undefined') return // Already have data cached

    // Setup blank data if config doesn't exist
    if (!fs.existsSync(this._getFile(slug))) return this.cache[slug] = {}

    try {
      // Getting here means not cached, read from disk
      this.cache[slug] = JSON.parse(fs.readFileSync(this._getFile(slug)).toString())
    }
    catch {
      // Setup blank data if parse fails
      return this.cache[slug] = {}
    }
  }
  _saveData (slug) {
    fs.writeFileSync(this._getFile(slug), JSON.stringify(this.cache[slug], null, 4))
  }

  getData (slug, key) {
    this._ensureData(slug)
    return this.cache[slug][key]
  }
  setData (slug, key, value) {
    if (value === undefined) return
    this._ensureData(slug)

    this.cache[slug][key] = value
    this._saveData(slug)
  }
  deleteData (slug, key) {
    this._ensureData(slug)
    delete this.cache[slug][key]
    this._saveData(slug)
  }
}

class BaseExternalPackData {
  constructor (slug) {
    this.slug = slug
  }
  save (key, value) {
    return ExternalPackDataStore.setData(this.slug, key, value)
  }
  load (key) {
    return ExternalPackDataStore.getData(this.slug, key)
  }
}

class BaseInternalPackData {
  constructor (slug) {
    this.slug = slug
  }
  save (key, value) {
    PluginData.packs[this.slug] = {
      ...PluginData.packs[this.slug],
      [key]: value
    }
  }
  load (key) {
    return PluginData.packs[this.slug]?.[key]
  }
}

class PackData {
  get name () { return 'PackData' }

  constructor () {
    this.internalInstances = new Map(
      internalPackSlugs.map(slug => [
        slug,
        this.create(slug, new BaseInternalPackData(slug))
      ])
    )
    this.externalInstances = new Map()

    this.onPackLoaded = pack => this.externalInstances.set(pack.slug, this.create(pack.slug))
    this.onPackUnloaded = pack => this.externalInstances.delete(pack.slug)
  }

  create (slug, base = new BaseExternalPackData(slug)) {
    return new Data(base, [
      new DataField('configVersion'),
      new DataField('currentVersion'),
      new DataField('settings')
    ])
  }

  pack (slug) {
    return this.internalInstances.get(slug)
      ?? this.externalInstances.get(slug)
      ?? this.create(slug)
  }

  initialize () {
    Emitter.on(Events.PackLoaded, this.onPackLoaded)
    Emitter.on(Events.PackUnloaded, this.onPackUnloaded)

    Logger.info(this.name, 'Initialized.')
  }

  shutdown () {
    Emitter.off(Events.PackLoaded, this.onPackLoaded)
    Emitter.off(Events.PackUnloaded, this.onPackUnloaded)
    this.externalInstances.clear()

    Logger.info(this.name, 'Shutdown.')
  }
}

export default new PackData
