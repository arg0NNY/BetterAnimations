import { Utils } from '@/BdApi'

function findInReactTree (tree, searchFilter) {
  return Utils.findInTree(tree, searchFilter, { walkable: ['props', 'children'] })
}

export default findInReactTree
