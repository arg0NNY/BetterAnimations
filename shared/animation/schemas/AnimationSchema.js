import { z } from 'zod'
import MetaSchema from '@animation/schemas/MetaSchema'
import SettingsSchema from '@animation/schemas/SettingsSchema'
import AnimationType from '@enums/AnimationType'
import ExtendableAnimateSchema from '@animation/schemas/ExtendableAnimateSchema'
import { ArrayOrSingleSchema } from '@utils/schemas'
import ModuleKey, { ModuleKeyAlias } from '@enums/ModuleKey'
import { moduleAliases } from '@data/modules'
import PrepareInjectableSchema from '@animation/schemas/PrepareInjectableSchema'

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
  animate: ExtendableAnimateSchema.pipe(PrepareInjectableSchema).optional(),
  enter: ExtendableAnimateSchema.pipe(PrepareInjectableSchema).optional(),
  exit: ExtendableAnimateSchema.pipe(PrepareInjectableSchema).optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  v => ({
    message: `Execution definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties`,
    path: [].concat(Object.keys(v).find(k => ['enter', 'exit', 'animate'].includes(k)) ?? []),
    params: { pointAt: 'key' }
  })
)

export default AnimationSchema
