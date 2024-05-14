
let meta = {}
export function saveMeta (m) { meta = m }

export default new Proxy({}, { get: (obj, prop) => meta[prop] ?? undefined })
