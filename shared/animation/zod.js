import { z } from 'zod'
import { indent } from '@utils/text'
import { toPath, visualizeAddonPath } from '@utils/json'
import { getPath } from '@utils/object'
import objectInspect from 'object-inspect'
import { toSourcePath } from '@animation/sourceMap'
import { sanitizeInjectable } from '@animation/injectable/utils'

function stripInject (path) {
  return path[path.length - 1] === 'inject'
    ? path.slice(0, -1)
    : path
}

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
  const {
    pack,
    data = pack,
    context,
    path = context?.path ?? [],
    received = !!data,
    sourceMap = {},
    docs = null
  } = options

  let message = '\n' + error.issues.map(issue => {
    const relativePath = issue.path.slice(path.length)
    const sourcePath = toSourcePath(data, relativePath, sourceMap) ?? issue.path
    let message = `• ${issue.message} at "${toPath(sourcePath)}"`

    if (received && !('received' in (issue.params ?? {}))) {
      issue.params ??= {}
      issue.params.received = getPath(data, stripInject(relativePath))
    }

    if (issue.unionErrors)
      message += indent(
        issue.unionErrors
          .map(e => formatZodError(e, { ...options, received: false }))
          .join(`\nOR`)
      )

    if (!issue.unionErrors && pack) {
      const visualized = visualizeAddonZodIssue(pack, issue, { path: sourcePath })
      if (visualized) message += indent('\n' + visualized)
    }

    if (import.meta.env.VITE_ZOD_ERROR_OUTPUT_ORIGINAL_PATH === 'true')
      message += indent(
        `\n↪ Original path: "${toPath(issue.path)}"`
          + (toPath(sourcePath) === toPath(issue.path) ? ' (same as source)' : '')
      )

    if ('args' in (issue.params ?? {}))
      message += indent(
        `\n↪ Received arguments: `
        + indent(
          '('
            + objectInspect(
                sanitizeInjectable(issue.params.args),
                { indent: 2 }
              ).slice(1, -1)
            + ')'
        ).trim()
      )
    else if ('received' in (issue.params ?? {}))
      message += indent(
        `\n↪ Received: `
        + indent(
          objectInspect(
            sanitizeInjectable(issue.params.received),
            { indent: 2 }
          )
        ).trim()
      )

    if (issue.params?.error)
      message += indent(
        `\n↪ Original error: `
        + issue.params.error.stack
      )

    return message
  }).join('\n')

  if (docs)
    message += indent(
      `\n↪ See documentation: `
      + docs
    )

  return message
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
        params: { error, received: value }
      })
      return z.NEVER
    }
  }
}
