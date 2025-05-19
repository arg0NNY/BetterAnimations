import { z } from 'zod'
import OverridableSchema from '@animation/schemas/OverridableSchema'
import ModuleKey from '@/enums/ModuleKey'
import AnimationType from '@/enums/AnimationType'

export const metaOverridePresets = {
  accordion: [
    {
      for: {
        module: [ModuleKey.Messages, ModuleKey.MembersSidebar, ModuleKey.ThreadSidebar]
      },
      accordion: false
    },
    {
      for: {
        module: ModuleKey.Messages,
        type: AnimationType.Exit
      },
      accordion: true
    }
  ]
}

const MetaSchema = OverridableSchema(
  z.strictObject({
    intersect: z.boolean().optional().default(true),
    revert: z.boolean().optional().default(true),
    accordion: z.boolean().optional().default(true)
  }),
  { presets: Object.keys(metaOverridePresets) }
)

export default MetaSchema
