import { z } from 'zod'
import { getPath, omit, pick } from '@shared/utils/object'
import ObjectDeepSchema from '@animation/schemas/ObjectDeepSchema'

export const SOURCE_MAP_KEY = '__sourceMap'
export const IS_SOURCE_MAP_KEY = '__isSourceMap'
export const SELF_KEY = '__self'

export const reservedKeys = [SOURCE_MAP_KEY, IS_SOURCE_MAP_KEY, SELF_KEY]

const sourceMapSymbol = Symbol('sourceMap')

export const SourceMapSchema = z.object({
  [IS_SOURCE_MAP_KEY]: z.literal(sourceMapSymbol)
}).passthrough()

export const SourceMappedObjectSchema = z.object({
  [SOURCE_MAP_KEY]: SourceMapSchema.optional()
})

export function buildSourceMap (target = {}, path = undefined) {
  return Object.fromEntries([
    [IS_SOURCE_MAP_KEY, sourceMapSymbol],
    [SELF_KEY, path],
    ...Object.keys(target).map((key) => [key, (path ?? []).concat(key)])
  ])
}

export function storeSourceMap (target, path = undefined) {
  target[SOURCE_MAP_KEY] = buildSourceMap(target, path)
  return target
}

export function isSourceMap (value) {
  return value?.[IS_SOURCE_MAP_KEY] === sourceMapSymbol
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

const ClearSourceMapDeepSchema = z.lazy(
  () => ObjectDeepSchema(ClearSourceMapDeepSchema)
    .transform(value => {
      if (isSourceMap(value)) return value
      clearSourceMap(value)
      return value
    })
)

export function clearSourceMapDeep (value) {
  const { success, data } = ClearSourceMapDeepSchema.safeParse(value)
  if (!success) throw new Error('Illegal value')
  return data
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

export function sourceMappedPick (obj, keys = []) {
  const value = pick(obj, [SOURCE_MAP_KEY].concat(keys))
  if (hasSourceMap(value))
    value[SOURCE_MAP_KEY] = pick(
      getSourceMap(value),
      [IS_SOURCE_MAP_KEY, SELF_KEY].concat(keys)
    )
  return value
}

export function sourceMappedOmit (obj, keys = []) {
  const value = omit(obj, keys.filter(key => key !== SOURCE_MAP_KEY))
  if (hasSourceMap(value))
    value[SOURCE_MAP_KEY] = omit(
      getSourceMap(value),
      keys.filter(key => ![IS_SOURCE_MAP_KEY, SELF_KEY].includes(key))
    )
  return value
}
