
export function mangled (module = {}, map = {}) {
  const mangled = {}
  const values = Object.values(module)
  for (const key in map) {
    mangled[key] = values.find(map[key])
  }
  return mangled
}

export function keyed (module = {}, filter = () => false) {
  const key = Object.keys(module).find(key => filter(module[key]))
  return [key && module, key]
}

export async function lazyKeyed (modulePromise, filter) {
  return keyed(await modulePromise, filter)
}

export function unkeyed (keyed) {
  return keyed[0][keyed[1]]
}

export function unkeyedFn (keyedComponent) {
  return (...args) => unkeyed(keyedComponent)(...args)
}
