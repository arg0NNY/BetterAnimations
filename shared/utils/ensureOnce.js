
function ensureOnce () {
  let triggered = new Map()
  return (fn, key = 'default') => {
    if (triggered.get(key)) return

    fn()
    triggered.set(key, true)
  }
}

export default ensureOnce
