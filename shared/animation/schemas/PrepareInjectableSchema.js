import { z } from 'zod'
import { Literal } from '@utils/schemas'
import { forbiddenKeys } from '@animation/keys'
import { storeSourceMap } from '@animation/sourceMap'
import deepMap from '@animation/deepMap'

const PrepareInjectableSchema = z.lazy(
  () => z.any().transform(
    (value, ctx) => deepMap(value, (value, { path }) => {
      if (typeof value !== 'object' || value === null) return value

      if (
        forbiddenKeys.map(key => {
          if (!Object.hasOwn(value, key)) return false
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Forbidden key: '${key}'`,
            path: path.concat(key),
            params: { pointAt: 'key' }
          })
          return true
        }).some(Boolean)
      ) return z.NEVER

      return storeSourceMap(value, ctx.path.concat(path))
    })
  )
)

export default PrepareInjectableSchema
