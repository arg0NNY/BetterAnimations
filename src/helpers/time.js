
export function formatSeconds (time, precision = 1) {
  const seconds = time / 1000
  return `${Math.floor(seconds)}.${Math.round((seconds % 1) * 10**precision)}s`
}
