import { z } from 'zod'
import { InjectableBaseSchema } from '@/modules/animation/schemas/InjectableSchema'
import { generatedLazyInjectSymbol, isLazyInject } from '@/modules/animation/schemas/injects/lazy'
import { animeTimelineInjectSymbol } from '@/modules/animation/schemas/injects/anime'
import { clearSourceMap, isSourceMap } from '@/modules/animation/sourceMap'

export const hookSymbol = Symbol('hook')

function createFunctionPlaceholder (name, readme) {
  const fn = function () {}
  Object.defineProperty(fn, 'name', { value: name, writable: false })
  fn.README = readme
  return fn
}

const SanitizeInjectableSchema = z.lazy(
  () => InjectableBaseSchema(SanitizeInjectableSchema).transform(value => {
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
      return createFunctionPlaceholder(
        'hook',
        'Omitted hook (awaiting execution)'
      )

    if (typeof value === 'function' && value[animeTimelineInjectSymbol])
      return value[animeTimelineInjectSymbol]

    return value
  })
)

export default SanitizeInjectableSchema
