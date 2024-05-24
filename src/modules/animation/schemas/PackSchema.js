import { z } from 'zod'
import regex from '@/helpers/regex'
import AnimationSchema from '@/modules/animation/schemas/AnimationSchema'

const PackSchema = z.object({
  name: z.string().trim().min(2).max(255),
  author: z.string().trim().min(1),
  version: z.string().regex(regex.semver),
  description: z.string().optional(),
  invite: z.string().regex(regex.url).optional(),
  authorLink: z.string().regex(regex.url).optional(),
  donate: z.string().regex(regex.url).optional(),
  patreon: z.string().regex(regex.url).optional(),
  website: z.string().regex(regex.url).optional(),

  animations: AnimationSchema.array()
})

export default PackSchema
