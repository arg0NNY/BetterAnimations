import { z } from 'zod'
import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import { ArrayOrSingleSchema } from '@/helpers/schemas'
import { moduleAliases } from '@/data/modules'
import AnimationType from '@/enums/AnimationType'

const MetaSchema = z.object({
  modules: ArrayOrSingleSchema( z.enum(ModuleKey.values().concat(ModuleKeyAlias.values())) )
    .optional()
    .default(() => [ModuleKeyAlias.Switch, ModuleKeyAlias.Reveal, ModuleKeyAlias.Sidebars])
    .transform(value => new Set([].concat(value).flatMap(key => moduleAliases[key] ?? key))),
  forceDisableInternalExpandCollapseAnimations: z.boolean().optional(),
  disableSelfIntersect: z.boolean().optional()
}).strict()

export default MetaSchema
