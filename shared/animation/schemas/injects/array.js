import { z } from 'zod'
import { InjectSchema } from '@animation/schemas/utils'
import Inject from '@/enums/Inject'

const ArrayInjectBaseSchema = inject => InjectSchema(inject).extend({
  target: z.array(z.any())
})

export const IncludesInjectSchema = ArrayInjectBaseSchema(Inject.Includes).extend({
  value: z.any()
}).transform(({ target, value }) => target.includes(value))
