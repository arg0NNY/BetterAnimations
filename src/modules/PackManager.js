import AddonManager from '@/modules/AddonManager'
import { path } from '@/modules/Node'
import { Plugins } from '@/BdApi'
import AddonError from '@error/structs/AddonError'
import PackSchema from '@animation/schemas/PackSchema'
import meta from '@/meta'
import ErrorManager from '@error/manager'
import { formatZodError } from '@utils/zod'
import internalPacks, { internalPackSlugs } from '@/packs'
import Documentation from '@/modules/Documentation'

export default new class PackManager extends AddonManager {
  get name () {return 'PackManager'}
  get extension () {return '.pack.json'}
  get duplicatePattern () {return /\.pack\s?\([0-9]+\)\.json/}
  get addonFolder () {return path.resolve(Plugins.folder, meta.name)}
  get prefix () {return 'pack'}
  get language () {return 'json'}
  get forbiddenSlugs () {return internalPackSlugs}

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
      return new AddonError(
        this.prefix,
        addon,
        formatZodError(e, { pack: addon, received: false, docs: Documentation.getDefinitionUrl(Documentation.Definition.Pack) })
      )
    }
  }

  getAllPacks (includePartial = false) {
    return this.addonList.filter(p => includePartial || !p.partial)
      .sort((a, b) => {
        if (a.partial !== b.partial) return a.partial ? 1 : -1
        return a.name.localeCompare(b.name)
      })
  }
  _getPack (predicate, includePartial = false) {
    return this.addonList.find(
      p => (includePartial || !p.partial) && predicate(p)
    )
  }
  getPack (slug, includePartial = false) {
    if (internalPackSlugs.includes(slug)) return internalPacks[slug]
    return this._getPack(p => p.slug === slug, includePartial)
  }
  getPackByFile (filename, includePartial = false) {
    return this._getPack(p => p.filename === filename, includePartial)
  }
  getAnimation (packOrSlug, key) {
    return (typeof packOrSlug === 'string' ? this.getPack(packOrSlug) : packOrSlug)
      ?.animations.find(a => a.key === key)
  }
}
