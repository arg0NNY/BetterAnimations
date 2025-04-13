
// FIXME: Remove when resolved: https://github.com/juliangarnier/anime/issues/982
export function promisify (instance) {
  if (instance.finished) return instance.finished
  instance.finished = Promise.resolve(instance)
  return instance.finished
}

export function awaitFrame (instance) {
  requestAnimationFrame(() => !instance.paused && instance.restart())
  return instance
}

export function mergeInlineStyles (instances) {
  return instances.reduce(
    (styles, instance) => Object.assign(styles, instance._inlineStyles),
    {}
  )
}

export function intersect (instance, intersectWith = null) {
  if (intersectWith?.instances) instance._inlineStyles = mergeInlineStyles(intersectWith.instances)
  return instance
}

export function apply (instance, options = {}) {
  const { awaitFrame: shouldAwaitFrame = false, intersectWith = null } = options
  if (shouldAwaitFrame) awaitFrame(instance)
  if (intersectWith) intersect(instance, intersectWith)
  return instance
}
