import anime from 'animejs'

export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}

const _heightModifier = (type, { duration = 250 } = {}) => ({ container: node, element }) => {
  element.style.visibility = 'hidden'
  return anime({
    targets: node,
    height: type === 'after' ? 0 : [0, anime.get(node, 'height')],
    marginTop: type === 'after' ? 0 : [0, anime.get(node, 'marginTop')],
    marginBottom: type === 'after' ? 0 : [0, anime.get(node, 'marginBottom')],
    easing: 'cubicBezier(0.42, 0, 0.58, 1.0)', // easeInOut
    duration,
    complete: type === 'after' ? undefined : () => {
      element.style.removeProperty('visibility')
      ;['height', 'margin-top', 'margin-bottom'].forEach(p => node.style.removeProperty(p))
    }
  })
}
export const heightModifier = options => ({
  before: _heightModifier('before', options),
  after: _heightModifier('after', options)
})

export function passAnimations (animations) {
  return e => {
    if (e?.props) e.props.animations = animations
    return e
  }
}
