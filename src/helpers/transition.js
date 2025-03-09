import { DiscordClasses } from '@/modules/DiscordSelectors.js'

export function directChild (node) {
  return node && [].find.call(node.children, e => !e.getAttribute('data-animation'))
}

export function avoidClickTrap (node) {
  return node?.classList.contains(DiscordClasses.Layer.clickTrapContainer)
    ? directChild(node)
    : node
}

export function passAuto (auto) {
  return e => {
    if (e?.props) e.props.auto = auto
    return e
  }
}
