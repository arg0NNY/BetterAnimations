import AddonManager from '@/modules/AddonManager'
import { path } from '@/modules/Node'
import { Plugins } from '@/BdApi'
import AddonError from '@/structs/AddonError'
import PackSchema from '@/modules/animation/schemas/PackSchema'
import meta from '@/meta'
import ErrorManager from '@/modules/ErrorManager'
import { formatZodError } from '@/helpers/zod'

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
    if (error) ErrorManager.registerAddonError(error)
    return error
  }

  /* Overrides */
  initializeAddon (addon) {
    try {
      Object.assign(addon, PackSchema.parse(addon))
    }
    catch (e) {
      return new AddonError(this.prefix, addon, formatZodError(e, { pack: addon }))
    }
  }

  getAllPacks (includePartial = false) {
    return this.addonList.filter(p => includePartial || !p.partial)
      .sort((a, b) => {
        if (a.partial !== b.partial) return a.partial ? 1 : -1
        return a.name.localeCompare(b.name)
      })
  }
  getPack (slug, includePartial = false) {
    return this.getAllPacks(includePartial).find(p => p.slug === slug)
  }
  getPackByFile (filename, includePartial = false) {
    return this.getAllPacks(includePartial).find(p => p.filename === filename)
  }
  getAnimation (packOrSlug, key) {
    return (typeof packOrSlug === 'string' ? this.getPack(packOrSlug) : packOrSlug)
      ?.animations.find(a => a.key === key)
  }
}
