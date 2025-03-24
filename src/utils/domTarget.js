
export function getTargetElement (target, defaultElement = undefined) {
  if (!target) return defaultElement
  if (typeof target === 'function') return target()
  if ('current' in target) return target.current
  return target
}
