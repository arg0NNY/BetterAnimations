
export const isNode = (node, type) => typeof type === 'function'
  ? type(node)
  : node?.type === type

export function closest (node, type) {
  if (isNode(node, type)) return node
  if (!node?.parent) return null
  return closest(node.parent, type)
}

export function flatten (nodes, type) {
  return nodes.flatMap(node => {
    if (isNode(node, type)) return [node]
    if (!Array.isArray(node?.layout)) return []
    return flatten(node.layout, type)
  })
}
