import * as z from 'zod'

export const lazyInjectSymbol = Symbol('lazyInject')
export const generatedLazyInjectSymbol = Symbol('generatedLazyInject')

export const LazyInjectSchema = z.object({
  symbol: z.symbol().refine(v => v === lazyInjectSymbol),
  name: z.string(),
  generator: z.instanceof(Function)
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
