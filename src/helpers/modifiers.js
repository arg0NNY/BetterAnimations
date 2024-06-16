import anime from 'animejs'
import AnimationType from '@/enums/AnimationType'

export const heightModifier = (type, { easing, duration }) => ({ container, element }) => ({
  execute: () => anime({
    targets: container,
    height: type === AnimationType.Exit ? 0 : [0, anime.get(element, 'clientHeight')],
    marginTop: type === AnimationType.Exit ? 0 : [0, anime.get(container, 'marginTop')],
    marginBottom: type === AnimationType.Exit ? 0 : [0, anime.get(container, 'marginBottom')],
    easing,
    duration
  }),
  onBeforeBegin: () => element.style.visibility = 'hidden',
  onCompleted: type === AnimationType.Exit ? undefined : () => {
    element.style.removeProperty('visibility')
    ;['height', 'margin-top', 'margin-bottom'].forEach(p => container.style.removeProperty(p))
  },
  onDestroyed: () => {
    element.style.removeProperty('visibility')
    ;['height', 'margin-top', 'margin-bottom'].forEach(p => container.style.removeProperty(p))
  }
})

export const marginRightModifier = (type, { easing, duration }) => ({ container }) => ({
  execute: () => {
    const width = Number.parseInt(anime.get(container, 'width'))
    return anime({
      targets: container,
      marginRight: type === AnimationType.Exit ? -width : [-width, 0],
      duration,
      easing
    })
  },
  onDestroyed: type === AnimationType.Exit ? undefined : () => container.style.removeProperty('margin-right')
})
