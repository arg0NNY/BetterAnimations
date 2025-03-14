import { z } from 'zod'
import ErrorManager from '@/modules/ErrorManager'
import AnimationError from '@/structs/AnimationError'
import { formatZodError } from '@/helpers/zod'

export function executeWithZod (value, fn, context, options = {}) {
  const { path = [] } = options

  const { success, data, error } = z.any()
    .transform(fn)
    .safeParse(value)

  if (!success) {
    ErrorManager.registerAnimationError(
      new AnimationError(
        context.animation,
        formatZodError(error, { pack: context.pack, path: context.path.concat(path), received: value }),
        { module: context.module, pack: context.pack, type: context.type, context }
      )
    )
    context.instance.cancel(true)
    return
  }
  return data
}

export function zodErrorBoundary (fn, context, options = {}) {
  return (...args) => executeWithZod(args, (args, ctx) => {
    try {
      return fn(...args)
    }
    catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error.message,
        params: { error }
      })
      return z.NEVER
    }
  }, context, options)
}
