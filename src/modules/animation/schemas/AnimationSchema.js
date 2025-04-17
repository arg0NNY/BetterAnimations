import { z } from 'zod'
import MetaSchema from '@/modules/animation/schemas/MetaSchema'
import SettingsSchema from '@/modules/animation/schemas/SettingsSchema'
import AnimationType from '@/enums/AnimationType'
import { StoreSourceMapDeepSchema } from '@/modules/animation/sourceMap'
import ExtendableAnimateSchema from '@/modules/animation/schemas/ExtendableAnimateSchema'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import { moduleAliases } from '@/data/modules'

const AnimationSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1).trim(),
  modules: ArrayOrSingleSchema(
    z.enum(ModuleKey.values().concat(ModuleKeyAlias.values()))
  ).optional()
    .default(() => [ModuleKeyAlias.Switch, ModuleKeyAlias.Reveal, ModuleKeyAlias.Sidebars])
    .transform(value => new Set([].concat(value).flatMap(key => moduleAliases[key] ?? key))),
  meta: MetaSchema.optional().default({}),
  settings: SettingsSchema.optional().default({ defaults: {} }),
  debug: z.union([
    z.boolean(),
    z.enum(AnimationType.values())
  ]).optional(),
  animate: ExtendableAnimateSchema.pipe(StoreSourceMapDeepSchema).optional(),
  enter: ExtendableAnimateSchema.pipe(StoreSourceMapDeepSchema).optional(),
  exit: ExtendableAnimateSchema.pipe(StoreSourceMapDeepSchema).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  v => ({
    message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties`,
    path: [].concat(Object.keys(v).find(k => ['enter', 'exit', 'animate'].includes(k)) ?? []),
    params: { pointAt: 'key' }
  })
)

export default AnimationSchema
