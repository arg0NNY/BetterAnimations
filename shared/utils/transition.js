import { cloneElement } from 'react'

export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-baa'))
}

export function pass (props = null) {
  return e => cloneElement(e, props)
}

export function passAuto (auto) {
  return pass({ auto })
}
