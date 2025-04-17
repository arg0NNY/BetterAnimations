import { z } from 'zod'
import AnimationType from '@/enums/AnimationType'

const MetaSchema = z.strictObject({
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
