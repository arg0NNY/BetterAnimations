import AddonManager from '@/modules/AddonManager'
import { path } from '@/modules/Node'
import { Plugins } from '@/BdApi'
import Logger from '@/modules/Logger'
import AddonError from '@/structs/AddonError'
import PackSchema from '@/modules/animation/schemas/PackSchema'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import meta from '@/meta'

export default new class PackManager extends AddonManager {
  get name () {return 'PackManager'}
  get extension () {return '.pack.json'}
  get duplicatePattern () {return /\.pack\s?\([0-9]+\)\.json/}
  get addonFolder () {return path.resolve(Plugins.folder, meta.name)}
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

  loadAddon (filename, shouldToast = true) {
    const error = super.loadAddon(filename, shouldToast)
    if (error) Logger.error('PackManager', `Failed to load pack "${filename}":`, error) // Modals.showAddonErrors({ themes: [error] })
    return error
  }

  /* Overrides */
  initializeAddon (addon) {
    try {
      Object.assign(addon, PackSchema.parse(addon))
    }
    catch (e) {
      const message = e instanceof z.ZodError ? fromZodError(e).message : e.message
      return new AddonError(addon, message, e, this.prefix)
    }
  }

  getAllPacks (includePartial = false) {
    return this.addonList.filter(p => includePartial || !p.partial)
      .sort((a, b) => a.name.localeCompare(b.name))
  }
  getPack (slug) {
    return this.getAllPacks().find(p => p.slug === slug)
  }
  getPackByFile (filename) {
    return this.getAllPacks().find(p => p.filename === filename)
  }
  getAnimation (packOrSlug, key) {
    return (typeof packOrSlug === 'string' ? this.getPack(packOrSlug) : packOrSlug)
      ?.animations.find(a => a.key === key)
  }
}
