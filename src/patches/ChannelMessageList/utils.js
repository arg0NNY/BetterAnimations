import findInReactTree from '@/utils/findInReactTree'
import { isValidElement } from 'react'

export const findMessageInReactTree = tree => findInReactTree(tree, m => m?.props?.message)

export function getMessageKey (message) {
  message = isValidElement(message) ? findMessageInReactTree(message)?.props?.message : message
  return message?.nonce ?? message?.id
}
