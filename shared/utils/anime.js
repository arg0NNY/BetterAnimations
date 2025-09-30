
export function promisify (instance) {
  if (instance.finished) return instance.finished
  instance.finished = Promise.resolve(instance)
  return instance.finished
}

export function mergeInlineStyles (instances) {
  return [].concat(instances).reduce(
    (styles, instance) => Object.assign(styles, instance._inlineStyles),
    {}
  )
}

// TODO: Find an alternative way to transfer the inline styles, as they are no longer exposed starting from animejs 4.2.0
export function intersect (instance, withInstances = null) {
  if (!instance) return instance
  if (withInstances) instance._inlineStyles = mergeInlineStyles(withInstances)
  return instance
}
