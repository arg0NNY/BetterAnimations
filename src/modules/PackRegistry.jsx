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
import { ModalActions } from '@discord/modules'
import VerificationIssuesModal from '@/components/VerificationIssuesModal'
import { VerificationIssueResolveMethod, VerificationStatus } from '@/settings/data/verification'
import Data, { Cache } from '@/modules/Data'

class PackVerifier {
  constructor (registry) {
    this.registry = registry

    this.temporaryWhitelist = new Set()
  }

  get permanentWhitelist () {
    return Data.whitelist
  }
  get whitelist () {
    return this.permanentWhitelist.union(this.temporaryWhitelist)
  }

  addToWhitelist (pack, permanent = false) {
    if (permanent) this.permanentWhitelist.add(pack.filename)
    else this.temporaryWhitelist.add(pack.filename)

    Emitter.emit(Events.PackUpdated, pack)
    return true
  }
  removeFromWhitelist (pack) {
    this.temporaryWhitelist.delete(pack.filename)
    this.permanentWhitelist.delete(pack.filename)

    Emitter.emit(Events.PackUpdated, pack)
    return true
  }

  check (pack) {
    return this.whitelist.has(pack.filename)
      || [VerificationStatus.VERIFIED, VerificationStatus.OFFICIAL].includes(pack.verificationStatus)
  }
  getResolveMethod (pack) {
    if (this.permanentWhitelist.has(pack.filename)) return VerificationIssueResolveMethod.ALLOW_ALWAYS
    if (this.temporaryWhitelist.has(pack.filename)) return VerificationIssueResolveMethod.ALLOW_ONCE
    return null
  }

  _verify (pack) {
    if (!this.registry.isReady) return VerificationStatus.UNKNOWN

    const publishedPack = this.registry.getPack(pack.filename)
    if (!publishedPack) return VerificationStatus.UNVERIFIED

    if (pack.hash !== (publishedPack.history?.[pack.version] ?? publishedPack).hash)
      return VerificationStatus.FAILED

    return publishedPack.official ? VerificationStatus.OFFICIAL : VerificationStatus.VERIFIED
  }
  verify (pack) {
    const status = this._verify(pack)
    const didChange = status !== pack.verificationStatus
    const hasFailed = didChange && !this.check({ ...pack, verificationStatus: status })

    if (didChange) {
      pack.verificationStatus = status
      Emitter.emit(Events.PackUpdated, pack)
    }

    return hasFailed
  }
  verifyAll (packs = PackManager.getAllPacks(true)) {
    const hasFailed = packs.map(pack => this.verify(pack)).some(Boolean)
    if (hasFailed) this.showModal()
    return hasFailed
  }

  getIssues (packs = PackManager.getAllPacks(true)) {
    return packs.filter(pack => !this.check(pack))
  }
  hasIssues (packs = PackManager.getAllPacks(true)) {
    return packs.some(pack => !this.check(pack))
  }
  showModal () {
    if (!this.hasIssues()) return

    ModalActions.openModal(
      props => <VerificationIssuesModal {...props} />,
      { modalKey: 'BA__verificationIssuesModal' }
    )
  }

  resolveIssue ({ pack, method }) {
    switch (method) {
      case VerificationIssueResolveMethod.DELETE:
      case VerificationIssueResolveMethod.UNINSTALL:
        return this.registry.delete(pack.filename)
      case VerificationIssueResolveMethod.REINSTALL:
        return this.registry.reinstall(pack.filename)
      case VerificationIssueResolveMethod.UPDATE:
        return this.registry.update(pack.filename)
      case VerificationIssueResolveMethod.ALLOW_ONCE:
        return this.addToWhitelist(pack, false)
      case VerificationIssueResolveMethod.ALLOW_ALWAYS:
        return this.addToWhitelist(pack, true)
      default: return false
    }
  }
  async resolveIssues (resolvers) {
    const results = await Promise.all(
      resolvers.map(resolver => this.resolveIssue(resolver))
    )
    return results.every(Boolean)
  }
}

export default new class PackRegistry {
  get name () { return 'PackRegistry' }
  get baseUrl () { return import.meta.env.VITE_PACK_REGISTRY_BASE_URL }
  get mainFilename () { return import.meta.env.VITE_PACK_REGISTRY_MAIN_FILENAME }

  get cacheKey () { return 'registry' }
  get cache () { return Cache[this.cacheKey] }
  set cache (value) { Cache[this.cacheKey] = value }
  get hasCache () { return this.cache != null }

  constructor () {
    this.verifier = new PackVerifier(this)

    this._pending = new Set()
    this._error = null
    this._items = this.cache?.items ?? []
    this._authors = this.cache?.authors ?? []

    this._closeNotice = null

    this.onPackLoaded = pack => {
      this.verifier.verifyAll([pack])
      this.checkForUpdates({ updateRegistry: false })
    }
  }

  isPending (filename = this.mainFilename) {
    return this._pending.has(filename)
  }
  get hasPending () {
    return this._pending.size > 0
  }

  get error () { return this._error }
  set error (value) { this._error = value; this.onChange() }

  get hasError () { return this.error != null }
  get isFatal () { return this.hasError && !this.hasCache }
  get isReady () { return !this.isPending() || this.hasCache }

  get items () {
    return this._items.map(item => ({
      ...item,
      verificationStatus: item.official ? VerificationStatus.OFFICIAL : VerificationStatus.VERIFIED,
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
    return `${this.baseUrl}/raw/${filename}`
  }

  async fetch (filename, parse = true) {
    this._pending.add(filename)
    this.onChange()
    try {
      const response = await Net.fetch(`${this.getSourceURL(filename)}?${Date.now()}`)
      if (!response.ok) throw response
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
      this.cache = data
      this.items = data.items
      this.authors = data.authors

      Logger.info(this.name, `Loaded ${this.items.length} packs.`)
      return true
    }
    catch (error) {
      this.error = error
      Logger.error(this.name, 'Failed to update registry:', error)
      return false
    }
    finally {
      this.verifier.verifyAll()
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
  delete (filename) {
    try {
      PackManager.deleteAddon(filename)
      return true
    }
    catch (error) {
      Logger.error(this.name, `Failed to delete "${filename}":`, error)
      Toasts.error(`Failed to delete "${filename}".`)
      return false
    }
  }

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

    if (updateRegistry) {
      const success = await this.updateRegistry()
      if (!success) {
        if (useToasts) Toasts.error('Unable to check for updates. Please try again later.')
        return
      }
    }

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
