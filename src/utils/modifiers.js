import { animate, utils } from 'animejs'
import AnimationType from '@/enums/AnimationType'
import { toAnimeEasing } from '@/utils/easings'
import { awaitFrame } from '@/utils/anime'

export const heightModifier = (type, { easing, duration }) => ({ container, element }) => ({
  execute: () => awaitFrame(
    animate(container, {
      height: type === AnimationType.Exit ? 0 : [0, utils.get(element, 'clientHeight')],
      marginTop: type === AnimationType.Exit ? 0 : [0, utils.get(container, 'marginTop')],
      marginBottom: type === AnimationType.Exit ? 0 : [0, utils.get(container, 'marginBottom')],
      ease: toAnimeEasing(easing),
      duration
    })
  ),
  onBeforeBegin: () => element.style.visibility = 'hidden',
  onCompleted: type === AnimationType.Exit ? undefined : () => element.style.removeProperty('visibility'),
  onDestroyed: () => element.style.removeProperty('visibility')
})

export const marginRightModifier = (type, { easing, duration }) => ({ container }) => ({
  execute: () => {
    const width = Number.parseInt(utils.get(container, 'width'))
    return awaitFrame(
      animate(container, {
        marginRight: type === AnimationType.Exit ? -width : [-width, 0],
        ease: toAnimeEasing(easing),
        duration
      })
    )
  }
})
