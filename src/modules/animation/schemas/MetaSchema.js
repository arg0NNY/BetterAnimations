import { z } from 'zod'
import OverridableSchema from '@/modules/animation/schemas/OverridableSchema'

const MetaSchema = OverridableSchema(
  z.strictObject({
    intersect: z.boolean().optional().default(true),
    revert: z.boolean().optional().default(true),
    accordion: z.boolean().optional().default(true)
  })
)

export default MetaSchema
