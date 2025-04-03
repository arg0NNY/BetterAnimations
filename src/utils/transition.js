import { DiscordClasses } from '@/modules/DiscordSelectors.js'

export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}

export function avoidClickTrap (node) {
  return node?.classList.contains(DiscordClasses.Layer.clickTrapContainer)
    ? directChild(node)
    : node
}

export function pass (props) {
  return e => {
    if (e?.props) Object.assign(e.props, props)
    return e
  }
}

export function passAuto (auto) {
  return pass({ auto })
}
