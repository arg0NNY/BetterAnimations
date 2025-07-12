import { z } from 'zod'
import { Literal } from '@utils/schemas'
import { forbiddenKeys } from '@animation/keys'
import { storeSourceMap } from '@animation/sourceMap'

const PrepareInjectableSchema = z.lazy(
  () => z.union([
    Literal,
    z.array(PrepareInjectableSchema),
    z.record(z.string(), PrepareInjectableSchema)
  ]).transform(
    (value, ctx) => {
      if (typeof value !== 'object' || value === null) return value

      if (
        forbiddenKeys.map(key => {
          if (!Object.hasOwn(value, key)) return false
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Forbidden key: '${key}'`,
            path: [key],
            params: { pointAt: 'key' }
          })
          return true
        }).some(Boolean)
      ) return z.NEVER

      return storeSourceMap(value, ctx.path)
    }
  )
)

export default PrepareInjectableSchema
