import config from '@/config.json'
import preinstalled from '@/packs/preinstalled.pack.json'
import PackSchema from '@/modules/animation/schemas/PackSchema'

export const PREINSTALLED_PACK_SLUG = 'preinstalled'

function createInternalPack (slug, data) {
  return Object.assign(
    { slug, id: slug },
    PackSchema.parse(data)
  )
}

const internalPacks = {
  [PREINSTALLED_PACK_SLUG]: createInternalPack(PREINSTALLED_PACK_SLUG, {
    author: config.author,
    invite: config.invite,
    ...preinstalled
  })
}

export const internalPackSlugs = Object.keys(internalPacks)

export default internalPacks
