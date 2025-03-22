import { z } from 'zod'
import Setting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'
import { formatValuesList } from '@/helpers/schemas'
import AnimationType from '@/enums/AnimationType'

const EnumSchema = values => z.union([z.literal(true), z.enum(values).array()])

const DefaultsSchema = z.object({
  [Setting.Duration]: z.number().int().nonnegative(),
  [Setting.Easing]: z.string(),
  [Setting.Variant]: z.string(),
  [Setting.Position]: z.string(),
  [Setting.Direction]: z.string(),
  [Setting.Overflow]: z.boolean()
}).strict().partial()

const SettingsSchema = z.object({
  [Setting.Duration]: z.union([
    z.literal(true),
    z.object({
      from: z.number().int().min(100).multipleOf(100),
      to: z.number().int().max(5000).multipleOf(100)
    }).strict()
  ]).optional()
    .transform(v => v === true ? { from: 100, to: 2000 } : v)
    .refine(
      value => !value || value.to > value.from,
      { message: `'to' must be greater than 'from'`, path: ['to'] }
    ),
  [Setting.Easing]: z.literal(true).optional(),
  [Setting.Variant]: z.object({
    key: z.string().refine(
      key => key !== 'inject',
      key => ({ message: `Forbidden variant key: '${key}'` })
    ),
    name: z.string()
  }).strict().array().nonempty().optional(),
  [Setting.Position]: z.union([
    z.literal(true),
    z.literal('precise'),
    z.literal('enum'),
    z.literal('simple'),
    z.enum(Position.values()).array()
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
    z.enum(Direction.values()).array()
  ]).optional()
    .transform(value => value === true
      ? [Direction.Upwards, Direction.Downwards, Direction.Leftwards, Direction.Rightwards]
      : value),
  [Setting.Overflow]: z.boolean().optional(),

  defaults: DefaultsSchema.extend({
    [AnimationType.Enter]: DefaultsSchema,
    [AnimationType.Exit]: DefaultsSchema
  }).strict().partial()
    .pipe(
      z.union([
        z.object({
          [AnimationType.Enter]: DefaultsSchema,
          [AnimationType.Exit]: DefaultsSchema
        }).strict(),
        DefaultsSchema
      ])
    )
}).strict()
  .transform((settings, ctx) => {
    const defaults = settings.defaults[AnimationType.Enter]
      ? AnimationType.values().map(t => settings.defaults[t])
      : [settings.defaults]
    const missingDefaultKeys = [...new Set(
      defaults.flatMap(obj => Object.keys(settings).filter(k => k !== 'defaults' && !(k in obj)))
    )]
    if (!missingDefaultKeys.length) return settings

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `A default value must be specified for all the defined settings. Missing default values for: ${formatValuesList(missingDefaultKeys)}`,
      path: ['defaults'],
      params: { pointAt: 'key' }
    })
    return z.NEVER
  })
  .transform((settings, ctx) => {
    if (
      [
        [Setting.Variant, settings[Setting.Variant]?.map(v => v.key)],
        [Setting.Position, settings[Setting.Position] === true ? Position.values() : settings[Setting.Position]],
        [Setting.Direction, settings[Setting.Direction]]
      ].every(([key, values]) => {
        if (!settings[key]) return true

        return (settings.defaults[AnimationType.Enter] ? AnimationType.values() : [null]).map(t => {
          const value = (t ? settings.defaults[t] : settings.defaults)[key]
          if (values.includes(value)) return true

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid default value for '${key}'. Expected ${formatValuesList(values, ' | ')}, received '${value}'`,
            path: ['defaults', t, key].filter(Boolean)
          })
          return false
        }).every(Boolean)
      })
    ) return settings
    else return z.NEVER
  })

export default SettingsSchema
