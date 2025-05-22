
export function generateSeed () {
  return Array(4).fill(null).map(() => (Math.random()*2**32)>>>0)
}

export function sfc32 (a, b, c, d) {
  return () => {
    a |= 0; b |= 0; c |= 0; d |= 0
    let t = (a + b | 0) + d | 0
    d = d + 1 | 0
    a = b ^ b >>> 9
    b = c + (c << 3) | 0
    c = (c << 21 | c >>> 11)
    c = c + t | 0
    return (t >>> 0) / 4294967296
  }
}

export function createSfc32 () {
  const seed = generateSeed()
  return [
    sfc32(...seed),
    seed
  ]
}

export function int (rng, min, max) {
  return min + Math.floor(rng() * (max - min))
}

export function stream (rng, count, fnOrMin, max = -1) {
  return Array(count).fill(null).map(
    typeof fnOrMin === 'function'
      ? (_, i) => fnOrMin(rng, i)
      : () => int(rng, fnOrMin, max)
  )
}
