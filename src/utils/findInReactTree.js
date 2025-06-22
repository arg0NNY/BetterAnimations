import { Utils } from '@/BdApi'

function findInReactTree (tree, searchFilter) {
  return Utils.findInTree(tree, searchFilter, { walkable: ['props', 'children'] })
}

export const byClassName = className => m => m?.props?.className?.includes(className)

export default findInReactTree
