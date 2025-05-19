import { z } from 'zod'
import { hasInSettings, InjectSchema, InjectWithMeta, SwitchSchema } from '@animation/schemas/utils'
import Position from '@/enums/Position'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import Direction from '@/enums/Direction'
import { getCenter, toPercent, toUnit } from '@/utils/position'
import { zodErrorBoundary } from '@animation/utils'
import EasingSchema from '@animation/schemas/EasingSchema'
import { getEasingFn } from '@/utils/easings'

export const DurationInjectSchema = InjectWithMeta(
  ({ duration, settings }) => InjectSchema(Inject.Duration)
    .transform(hasInSettings(Inject.Duration, Setting.Duration in settings))
    .transform(() => duration),
  { immediate: [Setting.Duration, 'settings'] }
)

export const EasingInjectSchema = context => InjectSchema(Inject.Easing)
  .extend({
    easing: Setting.Easing in context.settings
      ? EasingSchema.optional().default(context.easing)
      : EasingSchema,
    raw: z.boolean().optional().default(false)
  })
  .transform(
    ({ easing, raw }, { path }) => raw ? easing : zodErrorBoundary(
      getEasingFn(easing),
      context,
      { path, name: 'easing' }
    )
  )

export const PositionInjectSchema =
  (context) => {
    if (context.settings?.[Setting.Position] !== true)
      return SwitchSchema(Inject.Position, Position.values(), { defaultValue: Position.Center, setting: Setting.Position })({
        ...context,
        position: context.position?.isAuto ? context.position.value : context.position
      })

    return InjectSchema(Inject.Position).extend({
      value: z.enum(['x', 'y']).optional(),
      unit: z.enum(['px', '%']).optional().default('px'),
      clip: z.boolean().optional().default(true)
    }).transform(({ value, unit, clip }) => {
      const { position, containerRect, anchorRect } = context

      let [x, y] = (() => {
        if (!position?.isAuto)
          return toUnit(position, unit, containerRect)

        if (anchorRect)
          return getCenter(
            anchorRect,
            unit,
            containerRect
          )

        if (position.value)
          return toUnit(position.value, unit, containerRect)

        const mouse = [
          position.mouse.x - containerRect.x,
          position.mouse.y - containerRect.y
        ]
        if (unit === '%') return toPercent(mouse, containerRect)
        return mouse
      })()

      if (clip)
        switch (unit) {
          case '%': {
            [x, y] = [x, y].map(v => Math.min(1, Math.max(0, v)))
            break
          }
          case 'px': {
            [x, y] = [
              Math.min(containerRect.width, Math.max(0, x)),
              Math.min(containerRect.height, Math.max(0, y))
            ]
            break
          }
        }

      switch (value) {
        case 'x': return x
        case 'y': return y
        default: switch (unit) {
          case '%': return `${x * 100}% ${y * 100}%`
          default: return `${x}px ${y}px`
        }
      }
    })
  }

export const DirectionInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Direction, Direction.values(), { defaultValue: Direction.Right, setting: Setting.Direction }),
  { immediate: [Setting.Direction, 'settings'] }
)

const getVariantKeys = context => context.settings?.[Setting.Variant]?.map(v => v.key) ?? []
export const VariantInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Variant, getVariantKeys, { setting: Setting.Variant, possibleValues: getVariantKeys }),
  { immediate: [Setting.Variant, 'settings'] }
)
