import BaseError from '@error/structs/BaseError'
import objectInspect from 'object-inspect'
import { sanitizeContext } from '@utils/animations'
import { isDev } from '@/env'

export default class AnimationError extends BaseError {
  constructor (animation, message, { type, context, stage, ...options } = {}) {
    const meta = [
      `Animation: ${animation.name} (${animation.key})`,
      `Type: ${type}`
    ]

    if (isDev && stage)
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
    this.animationType = type
    this.context = context
  }

  get name () {
    return 'AnimationError'
  }
}
