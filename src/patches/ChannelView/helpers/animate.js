import anime from 'animejs'

const animate = (type, node, width = node.clientWidth) => anime({
  targets: node,
  marginRight: type === 'after' ? -width : [-width, 0],
  easing: 'easeInOutQuint',
  duration: 400,
  complete: type === 'after' ? undefined : () => node.style.removeProperty('margin-right')
})

export default animate
