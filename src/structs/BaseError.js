import { indent } from '@/helpers/text'

export default class BaseError extends Error {
  constructor (message, options = {}, additionalMeta = []) {
    const { module, pack } = options

    const meta = [
      pack && 'Pack: ' + [
        pack.name,
        pack.version && `v${pack.version}`,
        pack.author && `by ${pack.author}`
      ].filter(Boolean).join(' '),
      module && `Module: ${module.name}`,
      ...additionalMeta
    ]

    super(message + '\n\n' + indent(meta.filter(Boolean).join('\n'), 2) + '\n')
    this.module = module
    this.pack = pack
  }
}
