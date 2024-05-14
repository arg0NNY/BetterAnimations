
let meta = {} // TODO: Move all "config.json" references to this meta
export function saveMeta (m) { meta = m }

export default new Proxy({}, { get: (obj, prop) => meta[prop] ?? undefined })
