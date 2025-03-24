
export function stop (callback) {
  return event => {
    event.stopPropagation()
    callback?.(event)
  }
}
