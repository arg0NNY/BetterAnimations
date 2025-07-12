import { z } from 'zod'
import Setting from '@enums/AnimationSetting'
import Position from '@enums/Position'
import Direction from '@enums/Direction'
import EasingSchema from '@animation/schemas/EasingSchema'
import { MAX_ANIMATION_DURATION, MIN_ANIMATION_DURATION } from '@data/constants'
import { getSupportedAxes } from '@utils/direction'
import { restrictReservedKeys } from '@animation/keys'
import OverridableSchema from '@animation/schemas/OverridableSchema'

export const DurationSchema = (from = MIN_ANIMATION_DURATION, to = MAX_ANIMATION_DURATION) =>
  z.number().int().min(from).max(to)

const DefaultsSchema = settings => {
  const entries = []

  if (Setting.Duration in settings) {
    const { from, to } = settings[Setting.Duration]
    entries.push([Setting.Duration, DurationSchema(from, to)])
  }

  if (Setting.Easing in settings) entries.push(
    [Setting.Easing, EasingSchema]
  )

  if (Setting.Variant in settings) entries.push(
    [Setting.Variant, z.enum(settings[Setting.Variant].map(v => v.key))]
  )

  if (Setting.Position in settings) entries.push(
    [Setting.Position, z.enum(settings[Setting.Position] === true ? Position.values() : settings[Setting.Position])],
    [Setting.PositionPreserve, z.boolean().optional()]
  )

  if (Setting.Direction in settings) entries.push(
    [Setting.Direction, z.enum(settings[Setting.Direction])],
    [Setting.DirectionAxis, z.enum(getSupportedAxes(settings[Setting.Direction])).optional()],
    [Setting.DirectionReverse, z.boolean().optional()],
    [Setting.DirectionTowards, z.boolean().optional()]
  )

  if (Setting.Overflow in settings) entries.push(
    [Setting.Overflow, z.boolean()]
  )

  return OverridableSchema(
    z.strictObject(
      Object.fromEntries(entries)
    )
  )
}

const SettingsSchema = z.object({
  [Setting.Duration]: z.union([
    z.literal(true),
    z.object({
      from: z.number().int().min(MIN_ANIMATION_DURATION).multipleOf(100),
      to: z.number().int().max(MAX_ANIMATION_DURATION).multipleOf(100)
    }).strict()
  ]).optional()
    .transform(v => v === true ? { from: MIN_ANIMATION_DURATION, to: 2000 } : v)
    .refine(
      value => !value || value.to > value.from,
      { message: `'to' must be greater than 'from'`, path: ['to'] }
    ),
  [Setting.Easing]: z.literal(true).optional(),
  [Setting.Variant]: z.object({
    key: z.string().refine(
      restrictReservedKeys,
      { error: ({ input }) => `Forbidden variant key: '${input}'` }
    ),
    name: z.string()
  }).strict().array().nonempty().optional(),
  [Setting.Position]: z.union([
    z.literal(true),
    z.literal('precise'),
    z.literal('enum'),
    z.literal('simple'),
    z.enum(Position.values()).array().nonempty()
  ]).optional()
    .transform(value => {
      switch (value) {
        case 'precise': return true
        case 'enum': return Position.values()
        case 'simple': return [Position.Top, Position.Bottom, Position.Left, Position.Right, Position.Center]
        default: return value
      }
    }),
  [Setting.Direction]: z.union([
    z.literal(true),
    z.enum(Direction.values()).array().nonempty()
  ]).optional()
    .transform(value => value === true
      ? [Direction.Upwards, Direction.Downwards, Direction.Leftwards, Direction.Rightwards]
      : value),
  [Setting.Overflow]: z.boolean().optional(),

  defaults: z.record(z.string(), z.any())
}).strict()
  .transform((settings, ctx) => {
    settings.defaults = DefaultsSchema(settings).parse(
      settings.defaults,
      { path: [...ctx.path, 'defaults'] }
    )
    return settings
  })

export default SettingsSchema
