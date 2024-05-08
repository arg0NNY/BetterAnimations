
export function getAnimationDefaultSettings (animation, type) {
  return animation.settings?.defaults?.[type] ?? animation.settings?.defaults ?? {}
}
