import { z } from 'zod'
import ParseStage from '@/enums/ParseStage.js'

export const injectPlaceholderSymbol = Symbol('injectPlaceholder')

export const InjectPlaceholderSchema = z.object({
  symbol: z.literal(injectPlaceholderSymbol),
  value: z.any(),
  path: z.string().array()
}).passthrough()

export function wrapWithPlaceholder (value, path = []) {
  return {
    symbol: injectPlaceholderSymbol,
    value,
    path
  }
}

export function wrapWithPlaceholderIfNeeded (env, value, path = []) {
  if (env.stage !== ParseStage.Initialize) return value
  return wrapWithPlaceholder(value, path)
}

export function isInjectPlaceholder (value) {
  return value?.symbol === injectPlaceholderSymbol
}
