import AddonManager from '@/modules/AddonManager'
import { path } from '@/modules/Node'
import { Plugins } from '@/BdApi'
import config from '@/config.json'
import Logger from '@/modules/Logger'
import AddonError from '@/structs/AddonError'
import PackSchema from '@/modules/Animation/schemas/PackSchema'
import Toasts from '@/modules/Toasts'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export default new class PackManager extends AddonManager {
  get name () {return 'PackManager'}
  get extension () {return '.pack.json'}
  get duplicatePattern () {return /\.pack\s?\([0-9]+\)\.json/}
  get addonFolder () {return path.resolve(Plugins.folder, config.name)}
  get prefix () {return 'pack'}
  get language () {return 'json'}

  /* Aliases */
  updatePackList () {return this.updateList()}
  loadAllPacks () {return this.loadAllAddons()}

  enablePack (idOrAddon) {return this.enableAddon(idOrAddon)}
  disablePack (idOrAddon) {return this.disableAddon(idOrAddon)}
  togglePack (id) {return this.toggleAddon(id)}

  unloadPack (idOrFileOrAddon) {return this.unloadAddon(idOrFileOrAddon)}
  loadPack (filename) {return this.loadAddon(filename)}
  reloadPack (idOrFileOrAddon) {return this.reloadAddon(idOrFileOrAddon)}

  loadAddon (filename, shouldCTE = true) {
    const error = super.loadAddon(filename, shouldCTE)
    if (error && shouldCTE) Logger.error('PackManager', 'Failed to load pack:', error) // Modals.showAddonErrors({ themes: [error] })
    return error
  }

  /* Overrides */
  initializeAddon (addon) {
    try {
      PackSchema.parse(addon)
    }
    catch (e) {
      const message = e instanceof z.ZodError ? fromZodError(e).message : e.message
      return new AddonError(addon.name || addon.filename, addon.filename, message, e, this.prefix)
    }
  }

  startAddon (id) {return this.addPack(id)}
  stopAddon (id) {return this.removePack(id)}

  addPack (idOrAddon) {
    const addon = typeof (idOrAddon) == 'string' ? this.addonList.find(p => p.id == idOrAddon) : idOrAddon
    if (!addon) return
    // DOMManager.injectTheme(addon.slug + '-theme-container', addon.css)
    Toasts.show(`${addon.name} has been enabled.`)
  }

  removePack (idOrAddon) {
    const addon = typeof (idOrAddon) == 'string' ? this.addonList.find(p => p.id == idOrAddon) : idOrAddon
    if (!addon) return
    // DOMManager.removeTheme(addon.slug + '-theme-container')
    Toasts.show(`${addon.name} has been disabled.`)
  }
}
