
export function on (obj, ...args) {
  if (obj && obj.addEventListener) obj.addEventListener(...args)
}

export function off (obj, ...args) {
  if (obj && obj.removeEventListener) obj.removeEventListener(...args)
}
