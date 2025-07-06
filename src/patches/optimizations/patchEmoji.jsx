import Patcher from '@/modules/Patcher'
import { use, useEffect, useMemo } from 'react'
import { AnimeTransitionContext } from '@components/AnimeTransition'
import { EmojiKeyed, Transition } from '@discord/modules'
import classNames from 'classnames'
import { css } from '@style'
import useConfig from '@/hooks/useConfig'

function isEmojiOverload (data, priority, limit = 100) {
  let count = 0
  for (let i = priority; i >= 1; i--) {
    count += data[i]
    if (count > limit) return true
  }
  return false
}

/**
 * If the count of emojis of a certain priority and of priorities above
 * exceed the limit in the context of an active transition (see `isEmojiOverload`),
 * load them after enter animations are finished
 */
function patchEmoji () {
  Patcher.after(...EmojiKeyed, (self, [{ className, size }], value) => {
    const [config] = useConfig()
    const { isEnterActive, state, props, data, tree } = use(AnimeTransitionContext)

    const priority = useMemo(() => size === 'reaction' ? 2 : 1, [size])

    useEffect(() => {
      tree.forEach(t => t.data.emoji[priority] += 1)
      return () => tree.forEach(t => t.data.emoji[priority] -= 1)
    }, [priority])

    if (
      config.general.prioritizeAnimationSmoothness
      && isEnterActive && props?.mountOnEnter
      && (state === Transition.EXITED || isEmojiOverload(data.emoji, priority))
    ) return (
      <div
        className={classNames('emoji', 'BA__emojiPlaceholder', className, {
          jumboable: size === 'jumbo'
        })}
      />
    )

    return value
  })
}

export default patchEmoji

css
`.BA__emojiPlaceholder {
    display: inline-block;
    border-radius: 12%;
    background-color: var(--background-mod-strong);
    flex-shrink: 0;
}`
`Emoji`
