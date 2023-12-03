import anime from 'animejs'

export function clearContainingStyles (node) {
  if (!node) return

  ['transform', 'perspective', 'filter', 'backdrop-filter', 'opacity', 'translate', 'rotate', 'scale']
    .forEach(s => node.style.removeProperty(s))
}

export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}

const _heightModifier = (type, { duration = 250 } = {}) => ({ node }) => {
  node.style.overflow = 'hidden'
  return anime({
    targets: node,
    height: type === 'after' ? 0 : [0, node.clientHeight],
    marginTop: type === 'after' ? 0 : [0, anime.get(node, 'marginTop')],
    marginBottom: type === 'after' ? 0 : [0, anime.get(node, 'marginBottom')],
    easing: 'cubicBezier(0.42, 0, 0.58, 1.0)', // easeInOut
    duration,
    complete: type === 'after' ? undefined : () => ['overflow', 'height', 'margin-top', 'margin-bottom'].forEach(p => node.style.removeProperty(p))
  })
}
export const heightModifier = options => ({
  before: _heightModifier('before', options),
  after: _heightModifier('after', options)
})
