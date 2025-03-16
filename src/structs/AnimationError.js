import BaseError from '@/structs/BaseError'
import objectInspect from 'object-inspect'
import { sanitizeContext } from '@/helpers/animations'

export default class AnimationError extends BaseError {
  constructor (animation, message, { type, context, stage, ...options } = {}) {
    const meta = [
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

    super(message, options, meta)
    this.animation = animation
    this.type = type
    this.context = context
  }

  get name () {
    return 'AnimationError'
  }
}
