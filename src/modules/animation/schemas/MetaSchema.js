import { z } from 'zod'
import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import { ArrayOrSingleSchema } from '@/helpers/schemas'
import { moduleAliases } from '@/data/modules'

const MetaSchema = z.object({
  modules: ArrayOrSingleSchema( z.enum(ModuleKey.values().concat(ModuleKeyAlias.values())) )
    .transform(value => new Set([].concat(value).flatMap(key => moduleAliases[key] ?? key)))
    .optional(),
  forceDisableInternalExpandCollapseAnimations: z.boolean().optional()
}).strict()

export default MetaSchema
