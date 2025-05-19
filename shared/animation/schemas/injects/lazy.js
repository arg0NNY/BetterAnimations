import { z } from 'zod'
import { FunctionSchema } from '@/utils/schemas'

export const lazyInjectSymbol = Symbol('lazyInject')
export const generatedLazyInjectSymbol = Symbol('generatedLazyInject')

export const LazyInjectSchema = z.object({
  symbol: z.literal(lazyInjectSymbol),
  name: z.string(),
  generator: FunctionSchema
})

export function wrapLazyInject (name, generator) {
  return {
    symbol: lazyInjectSymbol,
    name,
    generator
  }
}

export function isLazyInject (value) {
  return value?.symbol === lazyInjectSymbol
}
