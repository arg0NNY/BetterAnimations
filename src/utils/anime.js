
export function promisify (instance) {
  if (instance.finished) return instance.finished
  instance.finished = Promise.resolve(instance)
  return instance.finished
}

export function mergeInlineStyles (instances) {
  return instances.reduce(
    (styles, instance) => Object.assign(styles, instance._inlineStyles),
    {}
  )
}

export function intersect (instance, intersectWith = null) {
  if (!instance) return instance
  if (intersectWith?.instances) instance._inlineStyles = mergeInlineStyles(intersectWith.instances)
  return instance
}
