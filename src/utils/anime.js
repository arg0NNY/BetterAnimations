
// FIXME: Remove when resolved: https://github.com/juliangarnier/anime/issues/982
export function promisify (instance) {
  if (instance.finished) return instance.finished
  instance.finished = Promise.resolve(instance)
  return instance.finished
}
