import { z } from 'zod'
import { indent } from '@/helpers/text'
import { toPath, visualizeAddonPath } from '@/helpers/json'
import { getPath } from '@/helpers/object'
import objectInspect from 'object-inspect'

export function visualizeAddonZodIssue (addon, issue, options = {}) {
  const { path = issue.path, maxCodeBlocks = 2 } = options

  switch (issue.code) {
    case z.ZodIssueCode.unrecognized_keys:
      return issue.keys
        .map(key => visualizeAddonPath(addon, path.concat(key), { pointAt: 'key' }))
        .filter(Boolean)
        .slice(0, maxCodeBlocks)
        .concat(issue.keys.length > maxCodeBlocks ? `... ${issue.keys.length - maxCodeBlocks} more` : [])
        .join('\n')
    default:
      return visualizeAddonPath(addon, path, issue.params)
  }
}

export function formatZodError (error, options = {}) {
  const { pack, path = [], received } = options

  return '\n' + error.issues.map(issue => {
    const issuePath = path.concat(issue.path)
    let message = `• ${issue.message} at "${toPath(issuePath)}"`

    if (received && !issue.params?.received) {
      issue.params ??= {}
      issue.params.received = getPath(
        received,
        issue.path[issue.path.length - 1] === 'inject'
          ? issue.path.slice(0, -1)
          : issue.path
      )
    }

    if (issue.unionErrors)
      message += indent(
        issue.unionErrors
          .map(e => formatZodError(e, {
            pack,
            path: issue.params?.initialPath
              ? issuePath.slice(0, -issue.params.initialPath.length)
              : path
          }))
          .join(`\nOR`)
      )

    if (!issue.unionErrors && pack) {
      const visualized = visualizeAddonZodIssue(pack, issue, { path: issuePath })
      if (visualized) message += indent('\n' + visualized)
    }

    if ('received' in (issue.params ?? {}))
      message += indent(
        `\n↪ Received: `
        + indent(objectInspect(issue.params.received, { indent: 2 })).trim()
      )

    if (issue.params?.error)
      message += indent(
        `\n↪ Original error: `
        + issue.params.error.stack
      )

    return message
  }).join('\n')
}

export function zodSubParse (schema, value, ctx, options = {}) {
  const { path = [], received = true } = options
  const { success, data, error } = schema.safeParse(value)

  if (!success) {
    error.issues.forEach(i => {
      i.params ??= {}
      i.params.initialPath = structuredClone(i.path)
      if (received) i.params.received = getPath(value, i.path[i.path.length - 1] === 'inject' ? i.path.slice(0, -1) : i.path)
      if (path.length) i.path.unshift(...path)
      ctx.addIssue(i)
    })
    return z.NEVER
  }
  return data
}

export function zodTransformErrorBoundary (transformFn) {
  return (value, ctx) => {
    try {
      return transformFn(value, ctx)
    }
    catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error.message,
        params: { error }
      })
      return z.NEVER
    }
  }
}
