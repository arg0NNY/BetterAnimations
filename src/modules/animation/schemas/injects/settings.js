import * as z from 'zod'
import { hasInSettings } from '@/utils/schemas'
import { InjectSchema, InjectWithMeta, SwitchSchema } from '@/modules/animation/schemas/utils'
import Position from '@/enums/Position'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import Direction from '@/enums/Direction'
import { getCenter, toPercent, toUnit } from '@/utils/position'
import { toAnimeEasing } from '@/utils/easings'

export const DurationInjectSchema = InjectWithMeta(
  ({ duration, settings }) => InjectSchema(Inject.Duration)
    .transform(hasInSettings(Inject.Duration, !!settings?.[Setting.Duration]))
    .transform(() => duration.value),
  { immediate: [Setting.Duration, 'settings'] }
)

export const EasingInjectSchema = InjectWithMeta(
  ({ easing, settings }) => InjectSchema(Inject.Easing)
    .extend({
      raw: z.boolean().optional().default(false)
    })
    .transform(hasInSettings(Inject.Easing, !!settings?.[Setting.Easing]))
    .transform(({ raw }) => raw ? easing : toAnimeEasing(easing)),
  { immediate: [Setting.Easing, 'settings'] }
)

const getVariantKeys = context => context.settings?.[Setting.Variant]?.map(v => v.key) ?? []
export const VariantInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Variant, getVariantKeys, { setting: Setting.Variant, possibleValues: getVariantKeys }),
  { immediate: [Setting.Variant, 'settings'] }
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
      const { position, container, anchor } = context
      const containerRect = container.getBoundingClientRect()

      let [x, y] = (() => {
        if (!position?.isAuto)
          return toUnit(position, unit, containerRect)

        if (anchor)
          return getCenter(
            anchor instanceof Element ? anchor.getBoundingClientRect() : anchor,
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
