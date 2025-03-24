import { omit, pick } from '@/utils/object'
import cloneDeep from 'lodash-es/cloneDeep'
import SanitizeInjectableSchema from '@/modules/animation/schemas/SanitizeInjectableSchema'

export function getAnimationDefaultSettings (animation, type) {
  return animation.settings?.defaults?.[type] ?? animation.settings?.defaults ?? {}
}

export function sanitizeContext (context) {
  const ctx = omit(context, ['pack', 'animation', 'module', 'meta', 'settings', 'instance'])
  if (context.module) ctx.module = pick(context.module, ['id', 'name'])
  return ctx
}

export function snapshotContext (context) {
  return cloneDeep(sanitizeContext(context))
}

export function sanitizeInjectable (injectable) {
  return SanitizeInjectableSchema.parse(injectable)
}
