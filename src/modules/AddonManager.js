import { fs, path } from '@/modules/Node'
import Logger from '@/modules/Logger'
import AddonError from '@/structs/AddonError'
import Toasts from '@/modules/Toasts'
import Data from '@/modules/Data'
import Events from '@/modules/Emitter'

const stripBOM = function (fileContent) {
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    fileContent = fileContent.slice(1)
  }
  return fileContent
}

export default class AddonManager {

  constructor () {
    this.timeCache = {}
    this.addonList = []
    this.state = {}
    this.toastQueue = []
  }

  get name () {return ''}
  get extension () {return ''}
  get duplicatePattern () {return /./}
  get addonFolder () {return ''}
  get language () {return ''}
  get prefix () {return 'addon'}
  emit(event, ...args) {return Events.emit(`${this.prefix}-${event}`, ...args);}

  initialize () {
    this.ensureAddonFolder()
    return this.loadAllAddons()
  }

  ensureAddonFolder () {
    if (!fs.existsSync(this.addonFolder))
      fs.mkdirSync(this.addonFolder)
  }

  // Subclasses should overload this and modify the addon object as needed to fully load it
  initializeAddon () {}

  startAddon () {}
  stopAddon () {}

  loadState() {
    const saved = Data[`${this.prefix}s`]
    if (!saved) return
    Object.assign(this.state, saved)
  }

  saveState() {
    Data[`${this.prefix}s`] = this.state
  }

  toast (content, event = 'loaded') {
    this.toastQueue.push({ content, event })
    setTimeout(() => {
      const toasts = this.toastQueue.filter(t => t.event === event)
      if (!toasts.length) return

      if (toasts.length === 1) Toasts.show(toasts[0].content)
      else Toasts.show(`${event.slice(0, 1).toUpperCase() + event.slice(1)} ${toasts.length} ${this.prefix}s.`)

      this.toastQueue = this.toastQueue.filter(t => t.event !== event)
    }, 100)
  }

  watchAddons () {
    if (this.watcher) return Logger.err(this.name, `Already watching ${this.prefix} addons.`)
    Logger.log(this.name, `Starting to watch ${this.prefix} addons...`)
    this.watcher = fs.watch(this.addonFolder, { persistent: false }, async (eventType, filename) => {
      if (!eventType || !filename) return

      const absolutePath = path.resolve(this.addonFolder, filename)
      if (!filename.endsWith(this.extension)) {
        // Let's check to see if this filename has the duplicated file pattern `something(1).ext`
        const match = filename.match(this.duplicatePattern)
        if (!match) return
        const ext = match[0]
        const truncated = filename.replace(ext, '')
        const newFilename = truncated + this.extension

        // If this file already exists, give a warning and move on.
        if (fs.existsSync(newFilename)) {
          Logger.warn(this.name, `Duplicate files found: ${filename} and ${newFilename}`)
          return
        }

        // Rename the file and let it go on
        try {
          fs.renameSync(absolutePath, path.resolve(this.addonFolder, newFilename))
        } catch (error) {
          Logger.err(this.name, `Could not rename file: ${filename} ${newFilename}`, error)
        }
      }
      await new Promise(r => setTimeout(r, 100))
      try {
        const stats = fs.statSync(absolutePath)
        if (!stats.isFile()) return
        if (!stats || !stats.mtime || !stats.mtime.getTime()) return
        if (typeof (stats.mtime.getTime()) !== 'number') return
        if (this.timeCache[filename] == stats.mtime.getTime()) return
        this.timeCache[filename] = stats.mtime.getTime()
        if (eventType == 'rename') this.loadAddon(filename, true)
        if (eventType == 'change') this.reloadAddon(filename, true)
      } catch (err) {
        if (err.code !== 'ENOENT' && !err?.message.startsWith('ENOENT')) return
        delete this.timeCache[filename]
        this.unloadAddon(filename, true)
      }
    })
  }

  unwatchAddons () {
    if (!this.watcher) return Logger.error(this.name, `Was not watching ${this.prefix} addons.`)
    this.watcher.close()
    delete this.watcher
    Logger.log(this.name, `No longer watching ${this.prefix} addons.`)
  }

  // Subclasses should overload this and modify the addon using the fileContent as needed to "require()"" the file
  requireAddon (filename) {
    let fileContent = fs.readFileSync(filename, 'utf8')
    fileContent = stripBOM(fileContent)
    const stats = fs.statSync(filename)
    let addon, parseError
    try {
      addon = JSON.parse(fileContent)
    }
    catch (e) {
      addon = {}
      parseError = e
    }
    if (!addon.author) addon.author = 'Unknown Author'
    if (!addon.version) addon.version = '???'
    if (!addon.description) addon.description = 'Description not provided.'
    // if (!addon.name || !addon.author || !addon.description || !addon.version) return new AddonError(addon.name || path.basename(filename), filename, "Addon is missing name, author, description, or version", {message: "Addon must provide name, author, description, and version.", stack: ""}, this.prefix);
    addon.id = addon.name || path.basename(filename)
    addon.slug = path.basename(filename).replace(this.extension, '').replace(/ /g, '-')
    addon.filename = path.basename(filename)
    addon.added = stats.atimeMs
    addon.modified = stats.mtimeMs
    addon.size = stats.size
    addon.fileContent = fileContent
    addon.installed = addon
    if (this.addonList.find(c => c.id == addon.id)) throw new AddonError(addon, `There is already a ${this.prefix} with name ${addon.name}`, this.prefix)
    this.addonList.push(addon)
    if (parseError) throw new AddonError(addon, parseError.message, parseError, this.prefix)
    return addon
  }

  // Subclasses should use the return (if not AddonError) and push to this.addonList
  loadAddon (filename, shouldToast = true) {
    if (typeof (filename) === 'undefined') return
    let addon
    try {
      addon = this.requireAddon(path.resolve(this.addonFolder, filename))
    } catch (e) {
      const { addon: partialAddon } = e
      if (partialAddon) {
        partialAddon.partial = true
        this.state[partialAddon.id] = false
        this.emit('loaded', partialAddon)
      }
      return e
    }

    const error = this.initializeAddon(addon)
    if (error) {
      this.state[addon.id] = false
      addon.partial = true
      this.emit('loaded', addon)
      return error
    }

    const message = `${addon.name} v${addon.version} was loaded.`
    if (shouldToast) this.toast(message, 'loaded')
    Logger.log(this.name, message)

    this.emit('loaded', addon)

    if (this.state[addon.id] !== false) this.state[addon.id] = true
    return this.startAddon(addon)
  }

  unloadAddon (idOrFileOrAddon, shouldToast = true, isReload = false) {
    const addon = typeof (idOrFileOrAddon) == 'string' ? this.addonList.find(c => c.id == idOrFileOrAddon || c.filename == idOrFileOrAddon) : idOrFileOrAddon
    if (!addon) return false
    if (this.state[addon.id]) this.stopAddon(addon)

    this.addonList.splice(this.addonList.indexOf(addon), 1)
    this.emit('unloaded', addon)

    const message = `${addon.name} was unloaded.`
    if (shouldToast) this.toast(message, 'unloaded')
    Logger.log(this.name, message)

    return true
  }

  reloadAddon (idOrFileOrAddon, shouldToast = true) {
    const addon = typeof (idOrFileOrAddon) == 'string' ? this.addonList.find(c => c.id == idOrFileOrAddon || c.filename == idOrFileOrAddon) : idOrFileOrAddon
    const didUnload = this.unloadAddon(addon, false, true)
    if (addon && !didUnload) return didUnload
    const error = this.loadAddon(addon ? addon.filename : idOrFileOrAddon, false)
    if (!error && shouldToast) this.toast(`${addon.name} was reloaded.`, 'reloaded')
    return error
  }

  isLoaded (idOrFile) {
    const addon = this.addonList.find(c => c.id == idOrFile || c.filename == idOrFile)
    if (!addon) return false
    return true
  }

  isEnabled (idOrFile) {
    const addon = this.addonList.find(c => c.id == idOrFile || c.filename == idOrFile)
    if (!addon) return false
    return this.state[addon.id]
  }

  getAddon (idOrFile) {
    return this.addonList.find(c => c.id == idOrFile || c.filename == idOrFile)
  }

  enableAddon (idOrAddon) {
    const addon = typeof (idOrAddon) == 'string' ? this.addonList.find(p => p.id == idOrAddon) : idOrAddon
    if (!addon || addon.partial) return
    if (this.state[addon.id]) return
    this.state[addon.id] = true
    this.emit('enabled', addon)
    this.startAddon(addon)
    this.saveState()
  }

  disableAddon (idOrAddon) {
    const addon = typeof (idOrAddon) == 'string' ? this.addonList.find(p => p.id == idOrAddon) : idOrAddon
    if (!addon || addon.partial) return
    if (!this.state[addon.id]) return
    this.state[addon.id] = false
    this.emit('disabled', addon)
    this.stopAddon(addon)
    this.saveState()
  }

  toggleAddon (id) {
    if (this.state[id]) this.disableAddon(id)
    else this.enableAddon(id)
  }

  loadNewAddons () {
    const files = fs.readdirSync(this.addonFolder)
    const removed = this.addonList.filter(t => !files.includes(t.filename)).map(c => c.id)
    const added = files.filter(f => !this.addonList.find(t => t.filename == f) && f.endsWith(this.extension) && fs.statSync(path.resolve(this.addonFolder, f)).isFile())
    return { added, removed }
  }

  updateList () {
    const results = this.loadNewAddons()
    for (const filename of results.added) this.loadAddon(filename)
    for (const name of results.removed) this.unloadAddon(name)
  }

  loadAllAddons () {
    this.loadState()
    const errors = []
    const files = fs.readdirSync(this.addonFolder)

    for (const filename of files) {
      const absolutePath = path.resolve(this.addonFolder, filename)
      const stats = fs.statSync(absolutePath)
      if (!stats || !stats.isFile()) continue
      this.timeCache[filename] = stats.mtime.getTime()

      if (!filename.endsWith(this.extension)) {
        // Lets check to see if this filename has the duplicated file pattern `something(1).ext`
        const match = filename.match(this.duplicatePattern)
        if (!match) continue
        const ext = match[0]
        const truncated = filename.replace(ext, '')
        const newFilename = truncated + this.extension

        // If this file already exists, give a warning and move on.
        if (fs.existsSync(newFilename)) {
          Logger.warn('AddonManager', `Duplicate files found: ${filename} and ${newFilename}`)
          continue
        }

        // Rename the file and let it go on
        fs.renameSync(absolutePath, path.resolve(this.addonFolder, newFilename))
      }
      const addon = this.loadAddon(filename, true)
      if (addon instanceof AddonError) errors.push(addon)
    }

    this.saveState()
    this.watchAddons()
    return errors
  }

  unloadAllAddons () {
    this.addonList.slice().forEach(addon => this.unloadAddon(addon, false))
  }

  shutdown () {
    this.unloadAllAddons()
    this.unwatchAddons()
    Logger.info(this.name, 'Shutdown.')
  }

  deleteAddon (idOrFileOrAddon) {
    const addon = typeof (idOrFileOrAddon) == 'string' ? this.addonList.find(c => c.id == idOrFileOrAddon || c.filename == idOrFileOrAddon) : idOrFileOrAddon
    return fs.unlinkSync(path.resolve(this.addonFolder, addon.filename))
  }

  saveAddon (idOrFileOrAddon, content) {
    const addon = typeof (idOrFileOrAddon) == 'string' ? this.addonList.find(c => c.id == idOrFileOrAddon || c.filename == idOrFileOrAddon) : idOrFileOrAddon
    return fs.writeFileSync(path.resolve(this.addonFolder, addon.filename), content)
  }
}
