
export function buildIndent (level) {
  return ' '.repeat(level * 2)
}

export function indent (text, level = 1) {
  const indent = buildIndent(level)
  return (text.slice(0, 2) !== '\n' ? indent : '') + text.replaceAll('\n', `\n${indent}`)
}

export function capitalize (text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
