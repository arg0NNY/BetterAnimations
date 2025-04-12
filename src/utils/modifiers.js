import { animate, utils } from 'animejs'
import AnimationType from '@/enums/AnimationType'
import { toAnimeEasing } from '@/utils/easings'

export const heightModifier = (type, { easing, duration }) => ({ container, element }) => ({
  execute: () => animate(container, {
    height: type === AnimationType.Exit ? 0 : [0, utils.get(element, 'clientHeight')],
    marginTop: type === AnimationType.Exit ? 0 : [0, utils.get(container, 'marginTop')],
    marginBottom: type === AnimationType.Exit ? 0 : [0, utils.get(container, 'marginBottom')],
    easing: toAnimeEasing(easing),
    duration: duration.value
  }),
  onBeforeBegin: () => element.style.visibility = 'hidden',
  onCompleted: type === AnimationType.Exit ? undefined : () => element.style.removeProperty('visibility'),
  onDestroyed: () => element.style.removeProperty('visibility')
})

export const marginRightModifier = (type, { easing, duration }) => ({ container }) => ({
  execute: () => {
    const width = Number.parseInt(utils.get(container, 'width'))
    return animate(container, {
      marginRight: type === AnimationType.Exit ? -width : [-width, 0],
      easing: toAnimeEasing(easing),
      duration: duration.value
    })
  },
  // onDestroyed: type === AnimationType.Exit ? undefined : () => container.style.removeProperty('margin-right')
})
