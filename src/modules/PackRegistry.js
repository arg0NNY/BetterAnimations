import { Net, Utils } from '@/BdApi'
import Logger from '@/modules/Logger'
import Toasts from '@/modules/Toasts'
import Emitter from '@/modules/Emitter'
import Events from '@shared/enums/Events'
import PackManager from '@/modules/PackManager'
import Notices from '@/modules/Notices'
import Settings from '@/modules/Settings'
import meta from '@/meta'
import SettingsSection from '@shared/enums/SettingsSection'

export default new class PackRegistry {
  get name () { return 'PackRegistry' }
  get baseUrl () { return import.meta.env.VITE_PACK_REGISTRY_BASE_URL }
  get mainFilename () { return import.meta.env.VITE_PACK_REGISTRY_MAIN_FILENAME }

  constructor () {
    this._pending = false
    this._items = []

    this.onPackLoaded = () => this.checkForUpdates({ updateRegistry: false })
  }
  get pending () { return this._pending }
  set pending (value) { this._pending = value; this.onChange() }
  get items () {
    return this._items.map(item => ({
      ...item,
      installed: PackManager.getPackByFile(item.filename, true)
    }))
  }
  set items (value) { this._items = value; this.onChange() }

  onChange () {
    Emitter.emit(Events.PackRegistryUpdated)
  }

  initialize () {
    this.updateRegistry()
      .then(() => this.checkForUpdates({ updateRegistry: false }))
      .then(() => this.listenPackEvents())

    Logger.info(this.name, 'Initialized.')
  }

  fetch (filename, parse = true) {
    return Net.fetch(`${this.baseUrl}/${filename}?${Date.now()}`)
      .then(res => parse ? res.json() : res.text())
      .catch(err => Logger.error(this.name, `Failed to fetch "${filename}"`, err))
  }
  async updateRegistry () {
    if (this.pending) return

    this.pending = true
    Logger.info(this.name, 'Updating registry...')
    const data = await this.fetch(this.mainFilename)
    this.pending = false
    if (!data?.items) return

    this.items = data.items
    Logger.info(this.name, `Loaded ${this.items.length} packs.`)
  }
  async install (filename) {
    const content = await this.fetch(filename, false)
    if (!content) return

    PackManager.saveAddon({ filename }, content)
  }
  async update (pack) {
    const content = await this.fetch(pack.filename, false)
    if (!content) return

    PackManager.saveAddon(pack, content)
  }

  isUnofficial (pack) {
    if (!this.items?.length) return false
    return !this.items.some(item => ['filename', 'name', 'author'].every(key => item[key] === pack[key]))
  }
  hasUpdate (pack) {
    if (!this.items?.length) return false

    const latest = this.items.find(item => item.filename === pack.filename)
    if (!latest) return false

    let hasUpdate
    try {
      hasUpdate = Utils.semverCompare(pack.version, latest.version) > 0
    }
    catch (e) {
      Logger.warn(this.name, `Failed to compare versions for "${pack.filename}":`, e)
      hasUpdate = false
    }

    return hasUpdate && latest.version
  }

  async checkForUpdates (options = {}) {
    const { useToasts = false, updateRegistry = true } = options
    Logger.info(this.name, 'Checking for updates...')

    if (updateRegistry) await this.updateRegistry()

    const updatesCount = PackManager.getAllPacks(true)
      .reduce((count, pack) => count + (this.hasUpdate(pack) ? 1 : 0), 0)
    if (!updatesCount) {
      Logger.info(this.name, 'No updates found.')
      if (useToasts) Toasts.success('Everything is up to date!')
      return
    }

    Logger.info(this.name, `Found ${updatesCount} updates.`)
    if (useToasts) return Toasts.show(`Found updates for ${updatesCount} of your packs!`)

    this.showUpdatesNotice(updatesCount)
  }

  showUpdatesNotice (updatesCount = 1, onClick = () => Settings.openSettingsModal(SettingsSection.Library)) {
    const closeNotice = Notices.info(`${meta.name} has found updates for ${updatesCount} of your packs!`, {
      buttons: [{
        label: 'View Library',
        onClick: () => {
          closeNotice()
          onClick()
        }
      }]
    })
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
