
export function stop (callback) {
  return event => {
    event.stopPropagation()
    callback?.(event)
  }
}

export function prevent (callback) {
  return event => {
    event.preventDefault()
    callback?.(event)
  }
}
