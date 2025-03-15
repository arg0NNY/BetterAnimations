import { z } from 'zod'
import { InjectableBaseSchema } from '@/modules/animation/schemas/InjectableSchema'
import { generatedLazyInjectSymbol, isLazyInject } from '@/modules/animation/schemas/injects/lazy'
import { isInjectPlaceholder } from '@/modules/animation/schemas/injects/placeholder'

export const hookSymbol = Symbol('hook')

const SanitizeInjectableSchema = z.lazy(
  () => InjectableBaseSchema(SanitizeInjectableSchema, [
    z.undefined(),
    z.symbol()
  ]).transform(value => {
    if (
      isLazyInject(value)
      || (typeof value === 'function' && value[generatedLazyInjectSymbol])
    ) {
      const fn = function () {}
      const name = value[generatedLazyInjectSymbol] ?? value.name
      Object.defineProperty(fn, 'name', { value: name, writable: false })
      fn.README = `Omitted lazy inject '${name}' (contents are parsed only when called)`
      return fn
    }

    if (typeof value === 'function' && value[hookSymbol]) {
      const fn = function () {}
      fn.README = `Omitted hook (awaiting execution)`
      return fn
    }

    if (isInjectPlaceholder(value))
      return value.value

    return value
  })
)

export default SanitizeInjectableSchema
