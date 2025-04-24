import ModuleKey from '@/enums/ModuleKey'
import { internalPackSlugs } from '@/packs'

export const configDefaults = {
  modules: {
    [ModuleKey.Servers]: {
      enabled: true,
      enhanceLayout: true,
      enter: {
        packSlug: 'test',
        animationKey: 'example'
      },
      exit: {
        packSlug: 'test',
        animationKey: 'example'
      }
    }
  },
  packs: Object.fromEntries(
    internalPackSlugs.map(slug => [slug, {}])
  ),
  general: {
    switchCooldownDuration: 1000
  }
}
