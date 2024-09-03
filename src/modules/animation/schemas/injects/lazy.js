import { z } from 'zod'

export const lazyInjectSymbol = Symbol('lazyInject')

export const LazyInjectSchema = z.object({
  symbol: z.literal(lazyInjectSymbol),
  generator: z.function()
})

export function wrapLazyInject (generator) {
  return {
    symbol: lazyInjectSymbol,
    generator
  }
}

export function isLazyInject (value) {
  return value?.symbol === lazyInjectSymbol
}
