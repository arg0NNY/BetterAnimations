
function getKey (key) {
  const intKey = parseInt(key)
  return intKey.toString() === key ? intKey : key
}

export function getPath (obj, path) {
  if (typeof path === 'string') return getPath(obj, path.split('.'))
  if (!path.length) return obj
  if (typeof obj !== 'object' || obj === null) return undefined

  const [key, ...rest] = path
  return getPath(
    obj[getKey(key)],
    rest
  )
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
