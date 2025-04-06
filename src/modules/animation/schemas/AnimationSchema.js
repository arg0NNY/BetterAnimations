import { z } from 'zod'
import MetaSchema from '@/modules/animation/schemas/MetaSchema'
import SettingsSchema from '@/modules/animation/schemas/SettingsSchema'
import AnimationType from '@/enums/AnimationType'
import AnimateSchema from '@/modules/animation/schemas/AnimateSchema'

const AnimationSchema = z.object({
  key: z.string().min(1).trim(),
  name: z.string().min(1).trim(),
  meta: MetaSchema.optional().default({}),
  settings: SettingsSchema.optional().default({ defaults: {} }),
  debug: z.union([
    z.boolean(),
    z.enum(AnimationType.values())
  ]).optional(),
  animate: AnimateSchema.optional(),
  enter: AnimateSchema.optional(),
  exit: AnimateSchema.optional(),
}).strict().refine(
  v => v.animate ? !(v.enter || v.exit) : (v.enter && v.exit),
  v => ({
    message: `Animation definition is required and must be either inside a single 'animate' property or inside 'enter' and 'exit' properties`,
    path: [].concat(Object.keys(v).find(k => ['enter', 'exit', 'animate'].includes(k)) ?? []),
    params: { pointAt: 'key' }
  })
)

export default AnimationSchema
