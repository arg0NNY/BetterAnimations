import { animate, utils } from 'animejs'
import AnimationType from '@/enums/AnimationType'
import { toAnimeEasing } from '@/utils/easings'
import Enum from '@/enums/Enum'

export const AccordionType = Enum({
  MarginTop: 'marginTop',
  MarginBottom: 'marginBottom',
  MarginLeft: 'marginLeft',
  MarginRight: 'marginRight'
})

export function reverseType (type) {
  switch (type) {
    case AccordionType.MarginTop: return AccordionType.MarginBottom
    case AccordionType.MarginBottom: return AccordionType.MarginTop
    case AccordionType.MarginLeft: return AccordionType.MarginRight
    case AccordionType.MarginRight: return AccordionType.MarginLeft
  }
}

export function getSizeProperty (type) {
  switch (type) {
    case AccordionType.MarginTop:
    case AccordionType.MarginBottom:
      return 'clientHeight'
    case AccordionType.MarginLeft:
    case AccordionType.MarginRight:
      return 'clientWidth'
  }
}

export function getMarginProperty (type, opposite = false) {
  switch (opposite ? reverseType(type) : type) {
    case AccordionType.MarginTop: return 'marginTop'
    case AccordionType.MarginBottom: return 'marginBottom'
    case AccordionType.MarginLeft: return 'marginLeft'
    case AccordionType.MarginRight: return 'marginRight'
  }
}

export function buildAccordionGenerator (type, options = {}) {
  const { hideElement = false } = options
  return (animationType, { easing, duration }) => ({ container, element, isIntersected }) => Object.assign(
    {
      execute: () => {
        const value = -(
          utils.get(element, getSizeProperty(type), false)
          + utils.get(container, getMarginProperty(type, true), false)
        )
        return animate(container, {
          autoplay: false,
          duration,
          ease: toAnimeEasing(easing),
          [getMarginProperty(type)]: {
            [AnimationType.Enter]: isIntersected ? 0 : { from: value },
            [AnimationType.Exit]: value
          }[animationType]
        })
      }
    },
    hideElement ? {
      onBeforeBegin: () => element.style.visibility = 'hidden',
      onCompleted: animationType === AnimationType.Exit ? undefined : () => element.style.removeProperty('visibility'),
      onDestroyed: () => element.style.removeProperty('visibility')
    } : null
  )
}
