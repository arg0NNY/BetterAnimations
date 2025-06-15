import { z } from 'zod'
import { ArrayOrSingleSchema } from '@utils/schemas'
import AnimationType from '@enums/AnimationType'
import ModuleKey, { ModuleKeyAlias } from '@enums/ModuleKey'
import ModuleType from '@enums/ModuleType'
import { omit } from '@utils/object'
import { moduleAliases } from '@data/modules'

export const DefaultConditionsSchema = z.strictObject({
  type: z.enum(AnimationType.values()),
  'module.type': z.enum(ModuleType.values()),
  module: ArrayOrSingleSchema(
    z.enum(ModuleKey.values().concat(ModuleKeyAlias.values()))
  ).transform(value => [].concat(value).flatMap(key => moduleAliases[key] ?? key))
}).partial()

export function computeOverridable (overridable, conditionValues, presets = {}) {
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
            ([condition, values]) => [].concat(values).includes(conditionValues[condition])
          )
      )
      .map(v => omit(v, ['for']))
  )
}

const OverrideSchema = (schema, conditionsSchema = DefaultConditionsSchema) =>
  schema.partial().extend({
    for: conditionsSchema
  })

const OverridableSchema = (schema, { conditionsSchema, presets = [] } = {}) => schema.extend({
  override: ArrayOrSingleSchema(
    !presets.length
      ? OverrideSchema(schema, conditionsSchema)
      : z.union([
        OverrideSchema(schema, conditionsSchema),
        z.strictObject({
          preset: z.enum(presets)
        })
      ])
  ).optional()
})

export default OverridableSchema
