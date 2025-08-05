import { generatedLazyInjectSymbol, isLazyInject } from '@animation/schemas/injects/lazy'
import { clearSourceMap, isSourceMap } from '@animation/sourceMap'
import { zodErrorBoundarySymbol } from '@animation/utils'
import { JSAnimation, Timeline, Timer, WAAPIAnimation } from 'animejs'
import Logger from '@logger'
import deepMap, { baseStopPropagation } from '@animation/deepMap'

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

const stopPropagation = value => baseStopPropagation(value)
  || value instanceof Timer
  || value instanceof JSAnimation
  || value instanceof WAAPIAnimation
  || value instanceof Timeline

export function sanitizeInjectable (injectable) {
  try {
    return deepMap(injectable, value => {
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

      if (['function', 'object'].includes(typeof value) && value !== null && injectableSymbol in value)
        return sanitizeInjectable(value[injectableSymbol])

      if (typeof value === 'function' && value[zodErrorBoundarySymbol])
        return createFunctionPlaceholder(
          value[zodErrorBoundarySymbol]
        )

      return value
    }, { stopPropagation })
  } catch (error) {
    if (import.meta.env.MODE === 'development')
      Logger.error('sanitizeInjectable', 'Failed to sanitize injectable:', error)
    return injectable
  }
}
