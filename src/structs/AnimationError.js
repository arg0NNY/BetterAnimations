import { indent } from '@/helpers/text'

export default class AnimationError extends Error {
  constructor (animation, message, { module, pack, type, context, stage }) {
    const meta = [
      `Pack: ${pack.name} v${pack.version} by ${pack.author}`,
      `Module: ${module.name}`,
      `Animation: ${animation.name} (${animation.key})`,
      `Type: ${type}`,
      // context && `Context: ${JSON.stringify(context, null, 2)}`
    ]

    if (import.meta.env.MODE === 'development' && stage)
      meta.push(`Stage: ${stage}`)

    super(message + '\n\n' + indent(meta.filter(Boolean).join('\n'), 2) + '\n')
    this.module = module
    this.pack = pack
    this.animation = animation
    this.type = type
    this.context = context
  }

  get name () {
    return 'AnimationError'
  }
}
