import { hasInSettings } from '@/helpers/schemas'
import { InjectSchema, InjectWithMeta, SwitchSchema } from '@/modules/animation/schemas/injects/InjectSchema'
import Position from '@/enums/Position'
import Inject from '@/enums/Inject'
import Setting from '@/enums/AnimationSetting'
import Direction from '@/enums/Direction'

export const DurationInjectSchema = InjectWithMeta(
  ({ duration, settings }) => InjectSchema(Inject.Duration)
    .transform(hasInSettings(Inject.Duration, !!settings?.[Setting.Duration]))
    .transform(() => duration),
  { immediate: ['duration', 'settings'] }
)

export const EasingInjectSchema = InjectWithMeta(
  ({ easing, settings }) => InjectSchema(Inject.Easing)
    .transform(hasInSettings(Inject.Easing, !!settings?.[Setting.Easing]))
    .transform(() => easing),
  { immediate: ['easing', 'settings'] }
)

export const VariantInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Variant, ctx => ctx.settings?.[Setting.Variant]?.map(v => v.key) ?? [], { setting: Setting.Variant }),
  { immediate: [Setting.Variant, 'settings'] }
)

export const PositionInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Position, Position.values(), { defaultValue: Position.Center, setting: Setting.Position }),
  { immediate: [Setting.Position, 'settings'] }
)

export const DirectionInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Direction, Direction.values(), { defaultValue: Direction.Right, setting: Setting.Direction }),
  { immediate: [Setting.Direction, 'settings'] }
)
