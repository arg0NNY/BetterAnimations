import { z } from 'zod'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import AnimationType from '@/enums/AnimationType'
import ModuleKey from '@/enums/ModuleKey'
import ModuleType from '@/enums/ModuleType'
import { omit } from '@/utils/object'

export const DEFAULT_PROPERTIES = {
  type: AnimationType.values(),
  module: ModuleKey.values(),
  'module.type': ModuleType.values()
}

export function computeOverridable (overridable, properties) {
  return Object.assign(
    omit(overridable, ['override']),
    ...[].concat(overridable.override)
      .filter(
        override => override != null
          && Object.entries(override.for).every(
            ([property, values]) => [].concat(values).includes(properties[property])
          )
      )
      .map(v => omit(v, ['for']))
  )
}

const OverridableSchema = (schema, properties = DEFAULT_PROPERTIES) => schema.extend({
  override: ArrayOrSingleSchema(
    schema.partial().extend({
      for: z.strictObject(
        Object.fromEntries(
          Object.entries(properties)
            .map(([property, values]) => [property, ArrayOrSingleSchema(z.enum(values))])
        )
      ).partial()
    })
  ).optional()
})

export default OverridableSchema
