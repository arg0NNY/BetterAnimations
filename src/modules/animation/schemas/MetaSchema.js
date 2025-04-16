import { z } from 'zod'
import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import { moduleAliases } from '@/data/modules'
import AnimationType from '@/enums/AnimationType'

const MetaSchema = z.strictObject({
  modules: ArrayOrSingleSchema( z.enum(ModuleKey.values().concat(ModuleKeyAlias.values())) )
    .optional()
    .default(() => [ModuleKeyAlias.Switch, ModuleKeyAlias.Reveal, ModuleKeyAlias.Sidebars])
    .transform(value => new Set([].concat(value).flatMap(key => moduleAliases[key] ?? key))),
  intersect: z.boolean().optional().default(true),
  revert: z.boolean().optional().default(true),
  accordion: z.union([
    z.boolean(),
    z.strictObject({
      [AnimationType.Enter]: z.boolean().optional().default(true),
      [AnimationType.Exit]: z.boolean().optional().default(true)
    })
  ]).optional()
    .default(true)
    .transform(
      value => typeof value === 'boolean'
        ? { [AnimationType.Enter]: value, [AnimationType.Exit]: value }
        : value
    )
})

export default MetaSchema
