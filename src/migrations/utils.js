
export function getMainConfig (configs) {
  return configs.find(config => !config.slug)
}
