import { indent } from '@/helpers/text'
import objectInspect from 'object-inspect'
import { sanitizeContext } from '@/helpers/animations'

export default class AnimationError extends Error {
  constructor (animation, message, { module, pack, type, context, stage }) {
    const meta = [
      `Pack: ${pack.name} v${pack.version} by ${pack.author}`,
      `Module: ${module.name}`,
      `Animation: ${animation.name} (${animation.key})`,
      `Type: ${type}`
    ]

    if (import.meta.env.MODE === 'development' && stage)
      meta.push(`Stage: ${stage}`)

    if (context)
      meta.push(
        'Context: '
        + objectInspect(
          sanitizeContext(context),
          { indent: 2 }
        )
      )

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
