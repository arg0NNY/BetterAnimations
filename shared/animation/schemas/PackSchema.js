import { z } from 'zod'
import regex from '@utils/regex'
import AnimationSchema from '@animation/schemas/AnimationSchema'
import Messages from '@shared/messages'
import PrepareInjectableSchema from '@animation/schemas/PrepareInjectableSchema'

export const SnippetSchema = z.strictObject({
  key: z.string().min(1),
  params: z.record(z.string(), z.any()).optional(),
  value: PrepareInjectableSchema
})

const BasePackSchemaShape = {
  name: z.string().trim().min(1),
  author: z.string().trim().min(1),
  version: z.string().regex(regex.semver, 'Should match semver format'),
  description: z.string().min(1).optional(),
  changelog: z.record(z.string(), z.any()).optional(),
  invite: z.string().optional(),
  authorLink: z.string().regex(regex.url, Messages.SHOULD_BE_VALID_URL).optional(),
  donate: z.string().regex(regex.url, Messages.SHOULD_BE_VALID_URL).optional()
}

const PackSchema = z.object({
  ...BasePackSchemaShape,
  snippets: SnippetSchema.array().optional(),
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

export const PackFallbackSchema = ({
  name = 'Invalid name',
  author = 'Unknown',
  version = '0.0.0',
  ...rest
}) => {
  const fallbackValues = {
    name,
    author,
    version,
    ...rest
  }

  return z.object(
    Object.fromEntries(
      Object.entries(BasePackSchemaShape)
        .map(([key, schema]) => [
          key,
          schema.catch(fallbackValues[key])
        ])
    )
  )
}

export default PackSchema
