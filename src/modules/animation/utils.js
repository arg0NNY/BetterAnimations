import { z } from 'zod'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import { formatZodError } from '@/utils/zod'

function buildStyles (entries) {
  return entries.reduce(
    (str, [name, value]) => str + `    ${name.trim()}: ${String(value).trim()};\n`,
    ''
  )
}

export function buildCSS (data, transformSelector = s => s) {
  data = [].concat(data)
  return [...new Set(data.flatMap(Object.keys))].reduce(
    (css, selector) => css + `${transformSelector(selector.trim())} {\n${(
      buildStyles(data.flatMap(i => i[selector] ? Object.entries(i[selector]) : []))
    )}}\n`,
    '\n'
  )
}

export function transformAnimeConfig (config, wrapper) {
  if (config.targets) config.targets = [].concat(config.targets)
    .map(t => typeof t === 'string' ? wrapper.querySelectorAll(t) : t)

  return config
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
        formatZodError(error, { pack: context.pack, path: context.path, received: value }),
        { module: context.module, pack: context.pack, type: context.type, context }
      )
    )
    context.instance.cancel(true)
  }
}

export function zodErrorBoundary (fn, context, options = {}) {
  const { name, ...opts } = options

  return (...args) => executeWithZod(args, (args, ctx) => {
    try {
      return fn(...args)
    }
    catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `An error occurred while executing ${name ? `"${name}"` : 'an external function'}`,
        params: { error, args }
      })
      return z.NEVER
    }
  }, context, opts)
}
