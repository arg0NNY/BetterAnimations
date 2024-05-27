import anime from 'animejs'
import AnimationType from '@/enums/AnimationType'

export const heightModifier = (type, { easing, duration }) => ({ container, element }) => {
  element.style.visibility = 'hidden'
  return anime({
    targets: container,
    height: type === AnimationType.Exit ? 0 : [0, anime.get(element, 'height')],
    marginTop: type === AnimationType.Exit ? 0 : [0, anime.get(container, 'marginTop')],
    marginBottom: type === AnimationType.Exit ? 0 : [0, anime.get(container, 'marginBottom')],
    easing,
    duration,
    complete: type === AnimationType.Exit ? undefined : () => {
      element.style.removeProperty('visibility')
      ;['height', 'margin-top', 'margin-bottom'].forEach(p => container.style.removeProperty(p))
    }
  })
}

export const marginRightModifier = (type, { easing, duration }) => ({ container }) => {
  const width = Number.parseInt(anime.get(container, 'width'))
  return anime({
    targets: container,
    marginRight: type === AnimationType.Exit ? -width : [-width, 0],
    duration,
    easing,
    complete: type === AnimationType.Exit ? undefined : () => container.style.removeProperty('margin-right')
  })
}
