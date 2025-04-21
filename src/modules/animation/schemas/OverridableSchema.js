import { z } from 'zod'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import AnimationType from '@/enums/AnimationType'
import ModuleKey, { ModuleKeyAlias } from '@/enums/ModuleKey'
import ModuleType from '@/enums/ModuleType'
import { omit } from '@/utils/object'
import { moduleAliases } from '@/data/modules'

export const DefaultPropertiesSchema = z.strictObject({
  type: ArrayOrSingleSchema(z.enum(AnimationType.values())),
  module: ArrayOrSingleSchema(
    z.enum(ModuleKey.values().concat(ModuleKeyAlias.values()))
  ).transform(value => [].concat(value).flatMap(key => moduleAliases[key] ?? key)),
  'module.type': ArrayOrSingleSchema(z.enum(ModuleType.values()))
}).partial()

export function computeOverridable (overridable, properties, presets = {}) {
  return Object.assign(
    omit(overridable, ['override']),
    ...[].concat(overridable.override)
      .flatMap(
        override => override != null && 'preset' in override
          ? presets[override.preset]
          : override
      )
      .filter(
        override => override != null
          && Object.entries(override.for).every(
            ([property, values]) => [].concat(values).includes(properties[property])
          )
      )
      .map(v => omit(v, ['for']))
  )
}

const OverrideSchema = (schema, propertiesSchema = DefaultPropertiesSchema) =>
  schema.partial().extend({
    for: propertiesSchema
  })

const OverridableSchema = (schema, { propertiesSchema, presets = [] } = {}) => schema.extend({
  override: ArrayOrSingleSchema(
    !presets.length
      ? OverrideSchema(schema, propertiesSchema)
      : z.union([
        OverrideSchema(schema, propertiesSchema),
        z.strictObject({
          preset: z.enum(presets)
        })
      ])
  ).optional()
})

export default OverridableSchema
