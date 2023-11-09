
const SCROLLER_SELECTOR = '[class*=scroller]'

export function getScrolls (node, selector = SCROLLER_SELECTOR) {
  return Array.from(
    node.querySelectorAll(selector),
    s => s.scrollTop
  )
}

export function applyScrolls (node, scrolls, selector = SCROLLER_SELECTOR) {
  node.querySelectorAll(selector)
    .forEach((s, i) => s.scrollTop = scrolls[i] ?? 0)
}
