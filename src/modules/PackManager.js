import AddonManager from '@/modules/AddonManager'
import { path } from '@/modules/Node'
import { Plugins } from '@/BdApi'
import AddonError from '@error/structs/AddonError'
import PackSchema from '@animation/schemas/PackSchema'
import meta from '@/meta'
import ErrorManager from '@error/manager'
import { formatZodError } from '@utils/zod'
import internalPacks, { internalPackSlugs } from '@packs'
import Documentation from '@shared/documentation'
import PackRegistry from '@/modules/PackRegistry'

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

  isRestricted (pack) {
    return pack.partial || !PackRegistry.verifier.check(pack)
  }
  getAllPacks (includeRestricted = false) {
    return this.addonList.filter(p => includeRestricted || !this.isRestricted(p))
      .sort((a, b) => a.name.localeCompare(b.name))
  }
  _getPack (predicate, includeRestricted = false) {
    return this.addonList.find(
      p => (includeRestricted || !this.isRestricted(p)) && predicate(p)
    )
  }
  getPack (slug, includeRestricted = false) {
    if (internalPackSlugs.includes(slug)) return internalPacks[slug]
    return this._getPack(p => p.slug === slug, includeRestricted)
  }
  getPackByFile (filename, includeRestricted = false) {
    return this._getPack(p => p.filename === filename, includeRestricted)
  }
}
