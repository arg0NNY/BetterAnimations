import { hasInSettings } from '@/helpers/schemas'
import { InjectSchema, SwitchSchema } from '@/modules/animation/schemas/injects/InjectSchema'
import Position from '@/enums/Position'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import Direction from '@/enums/Direction'

export const DurationInjectSchema = ({ duration, settings }) => InjectSchema(Inject.Duration)
  .transform(hasInSettings(Inject.Duration, !!settings?.[Setting.Duration]))
  .transform(() => duration)

export const EasingInjectSchema = ({ easing, settings }) => InjectSchema(Inject.Easing)
  .transform(hasInSettings(Inject.Easing, !!settings?.[Setting.Easing]))
  .transform(() => easing)

export const VariantInjectSchema = SwitchSchema(Inject.Variant, ctx => ctx.settings?.[Setting.Variant]?.map(v => v.key) ?? [], { setting: Setting.Variant })

export const PositionInjectSchema = SwitchSchema(Inject.Position, Position.values(), { defaultValue: Position.Center, setting: Setting.Position })

export const DirectionInjectSchema = SwitchSchema(Inject.Direction, Direction.values(), { defaultValue: Direction.Right, setting: Setting.Direction })
