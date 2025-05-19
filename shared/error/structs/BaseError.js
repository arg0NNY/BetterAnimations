import { indent } from '@shared/utils/text'
import config from '@config'

export default class BaseError extends Error {
  constructor (message, options = {}, additionalMeta = []) {
    const { module, pack } = options

    const meta = [
      `${config.name} ${config.version}`,
      module && `Module: ${module.name}`,
      pack && 'Pack: ' + [
        pack.name,
        pack.version && `v${pack.version}`,
        pack.author && `by ${pack.author}`
      ].filter(Boolean).join(' '),
      ...additionalMeta
    ]

    super(message + '\n\n' + indent(meta.filter(Boolean).join('\n'), 2) + '\n')
    this.module = module
    this.pack = pack
  }
}
