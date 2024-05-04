import { z } from 'zod'
import Setting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'
import { formatValuesList } from '@/helpers/schemas'

const EnumSchema = values => z.union([z.literal(true), z.enum(values).array()])

const SettingsSchema = z.object({
  [Setting.Duration]: z.union([
    z.literal(true),
    z.object({
      from: z.number().int().nonnegative().min(100).multipleOf(100),
      to: z.number().int().nonnegative().max(5000).multipleOf(100)
    })
  ]).optional().transform(v => v === true ? { from: 100, to: 2000 } : v),
  [Setting.Easing]: z.literal(true).optional(),
  [Setting.Variant]: z.object({
    key: z.string(),
    name: z.string()
  }).array().optional(),
  [Setting.Position]: EnumSchema(Position.values()).optional(),
  [Setting.Direction]: EnumSchema(Direction.values()).optional(), // TODO: Maybe remove forwards and backwards from default value (when this setting is set to "true")

  defaults: z.object({
    [Setting.Duration]: z.number().int().nonnegative(),
    [Setting.Easing]: z.string(),
    [Setting.Variant]: z.string(),
    [Setting.Position]: z.enum(Position.values()),
    [Setting.Direction]: z.enum(Direction.values())
  }).partial()
}).strict()
  .transform((settings, ctx) => {
    const missingDefaultKeys = Object.keys(settings).filter(k => k !== 'defaults' && !(k in settings.defaults))
    if (!missingDefaultKeys.length) return settings

    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `A default value must be specified for all the defined settings. Missing default values for: ${formatValuesList(missingDefaultKeys)}` })
    return z.NEVER
  })
  .transform((settings, ctx) => {
    if (!settings[Setting.Variant]) return settings

    const variantKeys = settings[Setting.Variant].map(v => v.key)
    const value = settings.defaults[Setting.Variant]
    if (variantKeys.includes(value)) return settings

    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Invalid default value for '${Setting.Variant}'. Expected ${formatValuesList(variantKeys, ' | ')}, received '${value}'` })
    return z.NEVER
  })

export default SettingsSchema
