import { animate, utils } from 'animejs'
import AnimationType from '@/enums/AnimationType'
import { toAnimeEasing } from '@/utils/easings'

export const heightAccordion = (type, { easing, duration }) => ({ container, element, isIntersected }) => ({
  execute: () => {
    const property = (name, target = container) => type === AnimationType.Exit ? 0 : [
      isIntersected ? utils.get(container, name) : 0,
      utils.get(target, name)
    ]
    return animate(container, {
      height: property('clientHeight', element),
      marginTop: property('marginTop'),
      marginBottom: property('marginBottom'),
      ease: toAnimeEasing(easing),
      duration,
      autoplay: false
    })
  },
  onBeforeBegin: () => element.style.visibility = 'hidden',
  onCompleted: type === AnimationType.Exit ? undefined : () => element.style.removeProperty('visibility'),
  onDestroyed: () => element.style.removeProperty('visibility')
})

export const marginRightAccordion = (type, { easing, duration }) => ({ container, isIntersected }) => ({
  execute: () => {
    const width = Number.parseInt(utils.get(container, 'clientWidth'))
    return animate(container, {
      marginRight: type === AnimationType.Exit ? -width : [
        -width,
        isIntersected ? utils.get(container, 'marginRight') : 0
      ],
      ease: toAnimeEasing(easing),
      duration,
      autoplay: false
    })
  }
})
