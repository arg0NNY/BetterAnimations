import { z } from 'zod'
import regex from '@/utils/regex'
import AnimationSchema from '@/modules/animation/schemas/AnimationSchema'
import Messages from '@/modules/Messages'

const PackSchema = z.object({
  name: z.string().trim().min(2).max(255),
  author: z.string().trim().min(1),
  version: z.string().regex(regex.semver, 'Should match semver format'),
  description: z.string().optional(),
  invite: z.string().optional(),
  authorLink: z.string().regex(regex.url, Messages.SHOULD_BE_VALID_URL).optional(),
  donate: z.string().regex(regex.url, Messages.SHOULD_BE_VALID_URL).optional(),
  patreon: z.string().regex(regex.url, Messages.SHOULD_BE_VALID_URL).optional(),
  website: z.string().regex(regex.url, Messages.SHOULD_BE_VALID_URL).optional(),

  animations: AnimationSchema.array()
})

export default PackSchema
