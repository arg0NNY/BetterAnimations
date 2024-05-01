import { z } from 'zod'
import Setting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'

const EnumSchema = values => z.union([z.literal(true), z.enum(values).array()])

const SettingsSchema = z.object({
  [Setting.Duration]: z.object({
    from: z.number().int().nonnegative(),
    to: z.number().int().nonnegative(),
    step: z.number().int().nonnegative(),
  }).optional(),
  [Setting.Easing]: z.literal(true).optional(),
  [Setting.Variant]: z.object({
    key: z.string(),
    name: z.string()
  }).array().optional(),
  [Setting.Position]: EnumSchema(Position.values()).optional(),
  [Setting.Direction]: EnumSchema(Direction.values()).optional(),

  // TODO: Require default value if corresponding setting is defined
  defaults: z.object({
    [Setting.Duration]: z.number().int().nonnegative(),
    [Setting.Easing]: z.string(),
    [Setting.Variant]: z.string(), // TODO: Restrict to provided keys
    [Setting.Position]: z.enum(Position.values()),
    [Setting.Direction]: z.enum(Direction.values())
  }).partial()
}).strict()

export default SettingsSchema
