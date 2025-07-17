import { Net, Utils } from '@/BdApi'
import Logger from '@logger'
import Toasts from '@/modules/Toasts'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import PackManager from '@/modules/PackManager'
import Notices from '@/modules/Notices'
import Settings from '@/settings'
import meta from '@/meta'
import SettingsSection from '@enums/SettingsSection'
import regex from '@utils/regex'
import thumbnailPlaceholder from '@/assets/placeholders/thumbnail.svg'
import avatarPlaceholder from '@/assets/placeholders/avatar.png'

export const PackVerificationStatus = {
  UNKNOWN: 0,
  UNVERIFIED: 1,
  FAILED: 2,
  VERIFIED: 3,
  OFFICIAL: 4
}

export default new class PackRegistry {
  get name () { return 'PackRegistry' }
  get baseUrl () { return import.meta.env.VITE_PACK_REGISTRY_BASE_URL }
  get mainFilename () { return import.meta.env.VITE_PACK_REGISTRY_MAIN_FILENAME }

  constructor () {
    this._pending = new Set()
    this._error = null
    this._items = []
    this._authors = []

    this._closeNotice = null

    this.onPackLoaded = () => this.checkForUpdates({ updateRegistry: false })
  }

  isPending (filename = this.mainFilename) {
    return this._pending.has(filename)
  }
  get hasPending () {
    return this._pending.size > 0
  }

  get error () { return this._error }
  set error (value) { this._error = value; this.onChange() }

  get items () {
    return this._items.map(item => ({
      ...item,
      installed: PackManager.getPackByFile(item.filename, true)
    }))
  }
  set items (value) { this._items = value; this.onChange() }

  get authors () { return this._authors }
  set authors (value) { this._authors = value; this.onChange() }

  onChange () {
    Emitter.emit(Events.PackRegistryUpdated)
  }

  initialize () {
    this.listenPackEvents()
    this.checkForUpdates()

    Logger.info(this.name, 'Initialized.')
  }

  hasPack (filename) {
    return this.items.some(item => item.filename === filename)
  }
  getPack (filename) {
    return this.items.find(item => item.filename === filename)
  }
  getAuthor (username) {
    return this.authors.find(author => author.username === username)
  }
  getSourceURL (filename) {
    return `${this.baseUrl}/${filename}`
  }

  async fetch (filename, parse = true) {
    this._pending.add(filename)
    this.onChange()
    try {
      const response = await Net.fetch(`${this.getSourceURL(filename)}?${Date.now()}`)
      return parse ? response.json() : response.text()
    }
    finally {
      this._pending.delete(filename)
      this.onChange()
    }
  }
  async updateRegistry () {
    this.error = null
    Logger.info(this.name, 'Updating registry...')
    try {
      const data = await this.fetch(this.mainFilename)
      this.items = data.items
      this.authors = data.authors

      Logger.info(this.name, `Loaded ${this.items.length} packs.`)
    }
    catch (error) {
      this.error = error
      Logger.error(this.name, 'Failed to update registry:', error)
    }
  }
  async install (filename, action = 'install') {
    try {
      PackManager.saveAddon(filename, await this.fetch(filename, false))
      return true
    }
    catch (error) {
      Logger.error(this.name, `Failed to ${action} "${filename}":`, error)
      Toasts.error(`Failed to ${action} "${filename}".`)
      return false
    }
  }
  update (filename) {
    return this.install(filename, 'update')
  }
  reinstall (filename) {
    return this.install(filename, 'reinstall')
  }
  uninstall (filename) {
    PackManager.deleteAddon(filename)
  }

  // isUnofficial (pack) {
  //   if (!this.items?.length) return false
  //   return !this.items.some(item => ['filename', 'name', 'author'].every(key => item[key] === pack[key]))
  // }
  hasUpdate (pack) {
    const latest = this.getPack(pack.filename)
    if (!latest) return false

    try {
      return Utils.semverCompare(pack.version, latest.version) > 0
    }
    catch (error) {
      Logger.warn(this.name, `Failed to compare versions for "${pack.filename}":`, error)
      return regex.semver.test(latest.version)
    }
  }

  getOutdatedPacks () {
    return PackManager.getAllPacks(true)
      .filter(pack => this.hasUpdate(pack))
  }
  showUpdatesNotice (updatesCount = this.getUpdatesCount(), onClick = () => Settings.openSettingsModal(SettingsSection.Library)) {
    this._closeNotice?.()
    this._closeNotice = Notices.info(`${meta.name} has found updates for ${updatesCount} of your packs!`, {
      buttons: [{
        label: 'View Library',
        onClick: () => {
          this._closeNotice?.()
          onClick()
        }
      }]
    })
  }
  async checkForUpdates (options = {}) {
    const { useToasts = false, updateRegistry = true } = options
    Logger.info(this.name, 'Checking for updates...')

    if (updateRegistry) await this.updateRegistry()

    const updatesCount = this.getOutdatedPacks().length
    if (!updatesCount) {
      Logger.info(this.name, 'No updates found.')
      if (useToasts) Toasts.success('Everything is up to date!')
      return
    }

    Logger.info(this.name, `Found ${updatesCount} updates.`)
    if (useToasts) return Toasts.show(`Found updates for ${updatesCount} of your packs!`)

    this.showUpdatesNotice(updatesCount)
  }
  async updateAll () {
    const packs = this.getOutdatedPacks()
    const results = await Promise.all(
      packs.map(pack => this.update(pack.filename))
    )
    Logger.info(this.name, `Updated ${packs.length} packs.`)

    if (results.every(Boolean)) {
      Toasts.success('Everything is up to date!')
      this._closeNotice?.()
    }
  }

  getThumbnailSrc (pack) {
    return pack.thumbnailSrc
      ?? this.getPack(pack.filename)?.thumbnailSrc
      ?? thumbnailPlaceholder
  }
  getAuthorAvatarSrc (pack) {
    const publishedPack = this.getPack(pack.filename)
    if (!publishedPack) return avatarPlaceholder

    const author = this.getAuthor(publishedPack.author)
    if (!author) return avatarPlaceholder

    return `https://avatars.githubusercontent.com/u/${author.github.id}?s=60&v=4`
  }
  getVerificationStatus (pack) {
    return PackVerificationStatus.UNKNOWN
  }

  listenPackEvents () {
    Emitter.on(Events.PackLoaded, this.onPackLoaded)
  }
  unlistenPackEvents () {
    Emitter.off(Events.PackLoaded, this.onPackLoaded)
  }

  shutdown () {
    this.unlistenPackEvents()
    Logger.info(this.name, 'Shutdown.')
  }
}
