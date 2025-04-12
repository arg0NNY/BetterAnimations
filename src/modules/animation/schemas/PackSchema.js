import * as z from 'zod'
import regex from '@/utils/regex'
import AnimationSchema from '@/modules/animation/schemas/AnimationSchema'

const PackSchema = z.object({
  name: z.string().trim().min(1),
  author: z.string().trim().min(1),
  version: z.string().regex(regex.semver, { error: 'Should match semver format' }),
  description: z.string().min(1).optional(),
  invite: z.string().optional(),
  authorLink: z.url().optional(),
  donate: z.url().optional(),
  patreon: z.url().optional(),
  website: z.url().optional(),

  animations: AnimationSchema.array()
    .superRefine((animations, ctx) => {
      const keys = {}
      animations.forEach((a, i) => (keys[a.key] ??= []).push(i))
      Object.entries(keys).filter(([, indexes]) => indexes.length > 1)
        .forEach(([key, indexes]) => {
          if (indexes.length <= 1) return
          indexes.forEach(i => ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate animation key: '${key}'`,
            path: [i, 'key']
          }))
        })
    })
})

export default PackSchema
