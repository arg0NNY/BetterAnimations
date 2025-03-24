import { z } from 'zod'
import { indent } from '@/utils/text'
import { toPath, visualizeAddonPath } from '@/utils/json'
import { getPath } from '@/utils/object'
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
          .map(e => formatZodError(e, { pack, path }))
          .join(`\nOR`)
      )

    if (!issue.unionErrors && pack) {
      const visualized = visualizeAddonZodIssue(pack, issue, { path: issuePath })
      if (visualized) message += indent('\n' + visualized)
    }

    if ('args' in (issue.params ?? {}))
      message += indent(
        `\n↪ Received arguments: `
        + indent(
          '(' + objectInspect(issue.params.args, { indent: 2 }).slice(1, -1) + ')'
        ).trim()
      )
    else if ('received' in (issue.params ?? {}))
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

export function zodSubParse (schema, value, options = {}) {
  const { path = [], received = true } = options
  const { success, data, error } = schema.safeParse(value, { path })

  if (!success) {
    if (received)
      error.issues.forEach(i => {
        const issuePath = i.path.slice(path.length)
        i.params ??= {}
        i.params.received = getPath(value, issuePath[issuePath.length - 1] === 'inject' ? issuePath.slice(0, -1) : issuePath)
      })
    throw error
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
