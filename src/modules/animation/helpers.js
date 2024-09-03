
function buildStyles (styles) {
  return Object.entries(styles).reduce(
    (str, [name, value]) => str + `    ${name.trim()}: ${String(value).trim()};\n`,
    ''
  )
}
export function buildCSS (data, transformSelector = s => s) {
  return Object.entries(data).reduce(
    (css, [selector, styles]) => css + `${transformSelector(selector.trim())} {\n${buildStyles(styles)}}\n`,
    ''
  )
}

export function transformAnimeConfig (config, wrapper) {
  if (config.targets) config.targets = [].concat(config.targets)
    .map(t => typeof t === 'string' ? wrapper.querySelectorAll(t) : t)

  return config
}
