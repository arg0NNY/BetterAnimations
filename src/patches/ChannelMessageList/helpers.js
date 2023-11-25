
export function getMessageKey (message) {
  return message?.nonce ?? message?.id
}
