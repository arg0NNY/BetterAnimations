import { z } from 'zod'
import { Literal } from '@/utils/schemas'
import { getPath } from '@/utils/object'
import ObjectDeepSchema from '@/modules/animation/schemas/ObjectDeepSchema'

export const SOURCE_MAP_KEY = '__sourceMap'
export const IS_SOURCE_MAP_KEY = '__isSourceMap'
export const SELF_KEY = '__self'

export const reservedKeys = [SOURCE_MAP_KEY, IS_SOURCE_MAP_KEY, SELF_KEY]

export const SourceMapSchema = z.object({
  [IS_SOURCE_MAP_KEY]: z.literal(true)
}).passthrough()

export const SourceMappedObjectSchema = z.object({
  [SOURCE_MAP_KEY]: SourceMapSchema.optional()
})

export const StoreSourceMapDeepSchema = z.lazy(
  () => z.union([
    Literal,
    z.array(StoreSourceMapDeepSchema),
    z.record(StoreSourceMapDeepSchema)
  ]).transform(
    (value, ctx) => {
      if (typeof value !== 'object' || value === null) return value

      if (
        reservedKeys.map(key => {
          if (!(key in value)) return false
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

export function buildSourceMap (target = {}, path = undefined) {
  return Object.fromEntries([
    [IS_SOURCE_MAP_KEY, true],
    [SELF_KEY, path],
    ...Object.keys(target).map((key) => [key, (path ?? []).concat(key)])
  ])
}

export function storeSourceMap (target, path = undefined) {
  target[SOURCE_MAP_KEY] = buildSourceMap(target, path)
  return target
}

export function isSourceMap (value) {
  return value?.[IS_SOURCE_MAP_KEY] === true
}

export function hasSourceMap (value) {
  return typeof value === 'object' && value !== null
    && isSourceMap(value[SOURCE_MAP_KEY])
}

export function getSourceMap (value) {
  return hasSourceMap(value) ? value[SOURCE_MAP_KEY] : undefined
}

export function getSourcePath (target, key) {
  return getSourceMap(target)?.[key]
}

export function toSourcePath (data, path = [], options = {}) {
  const { useSelf = false } = options
  return getSourcePath(
    getPath(data, path.slice(0, -1)),
    path[path.length - 1] ?? (useSelf ? SELF_KEY : undefined)
  )
}

export function clearSourceMap (value) {
  if (hasSourceMap(value)) delete value[SOURCE_MAP_KEY]
  return value
}

export const ClearSourceMapDeepSchema = z.lazy(
  () => ObjectDeepSchema(ClearSourceMapDeepSchema)
    .transform(value => {
      if (isSourceMap(value)) return value
      clearSourceMap(value)
      return value
    })
)

export function clearSourceMapDeep (value) {
  return ClearSourceMapDeepSchema.parse(value)
}

export function sourceMappedObjectKeys (value) {
  return Object.keys(value).filter(key => key !== SOURCE_MAP_KEY)
}

export function sourceMappedObjectValues (value) {
  return Object.values(value).filter(value => !isSourceMap(value))
}

export function sourceMappedObjectEntries (value) {
  return Object.entries(value).filter(([key]) => key !== SOURCE_MAP_KEY)
}

export function sourceMappedObjectAssign (target, ...source) {
  if (!hasSourceMap(target)) target[SOURCE_MAP_KEY] = buildSourceMap()

  source.forEach(source => {
    const sourceMap = getSourceMap(source)
    sourceMappedObjectEntries(source).forEach(([key, value]) => {
      target[key] = value
      const sourcePath = sourceMap?.[key]
      if (sourcePath === undefined) delete target[SOURCE_MAP_KEY][key]
      else target[SOURCE_MAP_KEY][key] = sourcePath
    })
  })
  return target
}
