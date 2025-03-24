import { indent } from '@/utils/text'

function getKey (key) {
  const intKey = parseInt(key)
  return intKey.toString() === key ? intKey : key
}

export function getPath (obj, path) {
  if (typeof path === 'string') return getPath(obj, path.split('/'))
  if (!path.length) return obj
  if (typeof obj !== 'object' || obj === null) return undefined

  const [key, ...rest] = path
  return getPath(
    obj[getKey(key)],
    rest
  )
}

export function toPath (path) {
  if (!path?.length) return ''
  return '/' + path.join('/')
}

export function positionToLineColumn (content, position) {
  let lineBreaks = 0,
    lastLineBreakPosition = -1

  for (let i = 0; i < position; i++) {
    if (content.charAt(i) !== '\n') continue
    lineBreaks += 1
    lastLineBreakPosition = i
  }

  return {
    line: lineBreaks,
    column: position - lastLineBreakPosition - 1
  }
}

export function visualizePosition (content, start, end = undefined, options = {}) {
  const { lineClamp = 2 } = options

  const { line, column } = start
  const lineCounterLength = String(line + lineClamp + 1).length
  const startLine = Math.max(line - lineClamp, 0)
  const lines = content.slice(startLine, line + lineClamp + 1)
    .map((l, i) => `${startLine + i + 1}`.padStart(lineCounterLength) + '│' + l)

  lines.splice(
    line - startLine + 1,
    0,
    (
      ' '.repeat(lineCounterLength)
      + '│'
      + ' '.repeat(column)
      + '^'.repeat(line === end?.line ? end.column - column : 1)
    )
  )

  const viewWidth = Math.max(...lines.map(l => l.length))

  const border = (cornerLeft, center, cornerRight) =>
    cornerLeft
    + '─'.repeat(lineCounterLength)
    + center
    + '─'.repeat(viewWidth - lineCounterLength)
    + cornerRight

  return [
    border('┌', '┬', '┐'),
    ...lines.map(l => '│' + l.padEnd(viewWidth) + ' │'),
    border('└', '┴', '┘')
  ].join('\n')
}

export function visualizeAddonPath (addon, path, options = {}) {
  const { pointAt = 'value' } = options

  if (Array.isArray(path)) path = toPath(path)

  const pointer = addon.pointers?.[path] ?? {}
  const start = pointer[pointAt]
  const end = pointer[pointAt + 'End']
  if (!start) return

  return visualizePosition(addon.fileContent, start, end, options)
}

export function visualizeAddonParseError (addon, error, rawContent, options = {}) {
  const [, position] = error.message.match(/at position (\d+)/) ?? []
  if (typeof position !== 'string') return

  const { line, column } = positionToLineColumn(rawContent, +position) ?? {}
  console.log(line, column)
  if (typeof line !== 'number') return

  return visualizePosition(addon.fileContent, { line, column }, undefined, options)
}

export function formatAddonParseError (addon, error, rawContent) {
  let message = '\n• ' + error.message
  const visualized = visualizeAddonParseError(addon, error, rawContent)
  if (visualized) message += indent('\n' + visualized + '\n')
  return message
}
