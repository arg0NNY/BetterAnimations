import { omit, pick } from '@/utils/object'
import cloneDeep from 'lodash-es/cloneDeep'
import { sanitizeInjectable } from '@/modules/animation/schemas/SanitizeInjectableSchema'

export function sanitizeContext (context) {
  const ctx = omit(context, [
    'pack',
    'animation',
    'module',
    'meta',
    'settings',
    'instance',
    'intersectWith',
    'window',
    'document',
    'mouse'
  ])
  if (context.module) ctx.module = pick(context.module, ['id', 'name'])
  if ('vars' in context) ctx.vars = sanitizeInjectable(context.vars)
  return ctx
}

export function snapshotContext (context) {
  return cloneDeep(sanitizeContext(context))
}
