import { z } from 'zod'
import { generatedLazyInjectSymbol, isLazyInject } from '@/modules/animation/schemas/injects/lazy'
import { clearSourceMap, isSourceMap } from '@/modules/animation/sourceMap'
import ObjectDeepSchema from '@/modules/animation/schemas/ObjectDeepSchema'
import { zodErrorBoundarySymbol } from '@/modules/animation/utils'
import { Timer } from 'animejs'

export const injectableSymbol = Symbol('injectable')
export function storeInjectable (value, data) {
  value[injectableSymbol] = data
  return value
}

function createFunctionPlaceholder (name, readme) {
  const fn = function () {}
  Object.defineProperty(fn, 'name', { value: name, writable: false })
  if (readme) fn.README = readme
  return fn
}

const SanitizeInjectableSchema = z.lazy(
  () => ObjectDeepSchema(SanitizeInjectableSchema, [
    z.instanceof(Timer)
  ]).transform(value => {
    if (isSourceMap(value)) return value

    clearSourceMap(value)

    if (
      isLazyInject(value)
      || (typeof value === 'function' && value[generatedLazyInjectSymbol])
    ) {
      const name = value[generatedLazyInjectSymbol] ?? value.name
      return createFunctionPlaceholder(
        name,
        `Omitted lazy inject '${name}' (contents are parsed only when called)`
      )
    }

    if (['function', 'object'].includes(typeof value) && injectableSymbol in value)
      return sanitizeInjectable(value[injectableSymbol])

    if (typeof value === 'function' && value[zodErrorBoundarySymbol])
      return createFunctionPlaceholder(
        value[zodErrorBoundarySymbol]
      )

    return value
  })
)

export default SanitizeInjectableSchema

export function sanitizeInjectable (injectable) {
  try {
    return SanitizeInjectableSchema.parse(injectable)
  } catch {
    return injectable
  }
}
