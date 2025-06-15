
export function getPath (obj, path) {
  if (!path.length) return obj
  if (typeof obj !== 'object' || obj === null) return undefined

  const [key, ...rest] = path
  return getPath(obj[key], rest)
}

export function pick (obj, keys = []) {
  return Object.fromEntries(
    keys.filter(k => Object.hasOwn(obj, k))
      .map(k => [k, obj[k]])
  )
}

export function omit (obj, keys = []) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  )
}
