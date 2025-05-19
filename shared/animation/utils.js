import { z } from 'zod'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import { formatZodError } from '@/utils/zod'
import { trust } from '@animation/schemas/TrustedFunctionSchema'

function buildStyles (styles) {
  return Object.entries(styles).reduce(
    (str, [name, value]) => str + `    ${name.trim()}: ${String(value).trim()};\n`,
    ''
  )
}

export function buildCSS (data, transformSelector = s => s) {
  return Object.entries(data).reduce(
    (css, [selector, styles], index) => css + `${transformSelector(selector.trim(), index)} {\n${buildStyles(styles)}}\n`,
    '\n'
  )
}

export function executeWithZod (value, fn, context, options = {}) {
  const { path = [] } = options

  try {
    return z.any()
      .transform(fn)
      .parse(value, { path })
  }
  catch (error) {
    ErrorManager.registerAnimationError(
      new AnimationError(
        context.animation,
        formatZodError(error, { pack: context.pack, data: value, context, path }),
        { module: context.module, pack: context.pack, type: context.type, context }
      )
    )
    context.instance.cancel(true)
  }
}

export const zodErrorBoundarySymbol = Symbol('zodErrorBoundary')
export function zodErrorBoundary (fn, context, options = {}) {
  const { name = 'untitled', ...opts } = options

  const boundary = (...args) => executeWithZod(args, (args, ctx) => {
    try {
      return fn(...args)
    }
    catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `An error occurred while executing ${name ? `'${name}'` : 'an external function'}`,
        params: { error, args }
      })
      return z.NEVER
    }
  }, context, opts)
  boundary[zodErrorBoundarySymbol] = name
  return trust(boundary)
}
