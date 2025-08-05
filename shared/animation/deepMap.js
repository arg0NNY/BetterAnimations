import { ZodError } from 'zod'
import isElement from 'lodash-es/isElement'
import { isSourceMap } from '@animation/sourceMap'
import { isLazyInject } from '@animation/schemas/injects/lazy'

export function baseStopPropagation (value) {
  return isElement(value)
    || isSourceMap(value)
    || isLazyInject(value)
}

function deepMap (obj, callback, { stopPropagation = baseStopPropagation, path = [] } = {}) {
  if (typeof obj === 'object' && obj !== null && !stopPropagation(obj)) {
    obj = Array.isArray(obj) ? [...obj] : { ...obj }
    for (const key in obj) {
      obj[key] = deepMap(obj[key], callback, {
        stopPropagation,
        path: path.concat(key)
      })
    }
  }

  const issues = []

  const addIssue = ({ code = 'custom', path: issuePath = [], message, params }) => issues.push({
    code,
    path: path.concat(issuePath),
    message,
    params
  })

  const ctx = { path, addIssue }

  const value = callback(obj, ctx)

  if (issues.length) throw new ZodError(issues)

  return value
}

export default deepMap
