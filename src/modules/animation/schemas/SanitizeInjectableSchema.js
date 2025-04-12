import * as z from 'zod'
import { generatedLazyInjectSymbol, isLazyInject } from '@/modules/animation/schemas/injects/lazy'
import { animeTimelineInjectSymbol } from '@/modules/animation/schemas/injects/anime'
import { clearSourceMap, isSourceMap } from '@/modules/animation/sourceMap'
import ObjectDeepSchema from '@/modules/animation/schemas/ObjectDeepSchema'
import { zodErrorBoundarySymbol } from '@/modules/animation/utils'

export const hookSymbol = Symbol('hook')

function createFunctionPlaceholder (name, readme) {
  const fn = function () {}
  Object.defineProperty(fn, 'name', { value: name, writable: false })
  if (readme) fn.README = readme
  return fn
}

const SanitizeInjectableSchema = z.lazy(
  () => ObjectDeepSchema(SanitizeInjectableSchema).transform(value => {
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

    if (typeof value === 'function' && value[hookSymbol])
      return sanitizeInjectable(value[hookSymbol])

    if (typeof value === 'function' && value[zodErrorBoundarySymbol])
      return createFunctionPlaceholder(
        value[zodErrorBoundarySymbol]
      )

    if (typeof value === 'function' && value[animeTimelineInjectSymbol])
      return sanitizeInjectable(value[animeTimelineInjectSymbol])

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
