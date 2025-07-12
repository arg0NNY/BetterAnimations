import { InjectSchema } from '@animation/schemas/utils'
import Inject from '@enums/Inject'
import { z } from 'zod'
import { ArrayOrSingleSchema } from '@utils/schemas'
import { sourceMappedObjectAssign, sourceMappedOmit, sourceMappedPick } from '@animation/sourceMap'
import { restrictForbiddenKeys } from '@animation/keys'

export const AssignInjectSchema = InjectSchema(Inject.Assign).extend({
  target: z.record(z.string(), z.any()),
  source: ArrayOrSingleSchema(z.record(z.string(), z.any())),
}).transform(({ target, source }) => sourceMappedObjectAssign(target, ...[].concat(source)))

export const PickInjectSchema = InjectSchema(Inject.Pick).extend({
  target: z.record(z.string(), z.any()),
  keys: ArrayOrSingleSchema(
    z.string().refine(
      restrictForbiddenKeys,
      { error: ({ input }) => `Forbidden key: '${input}'` }
    )
  )
}).transform(({ target, keys }) => sourceMappedPick(target, [].concat(keys)))

export const OmitInjectSchema = InjectSchema(Inject.Omit).extend({
  target: z.record(z.string(), z.any()),
  keys: ArrayOrSingleSchema(
    z.string().refine(
      restrictForbiddenKeys,
      { error: ({ input }) => `Forbidden key: '${input}'` }
    )
  )
}).transform(({ target, keys }) => sourceMappedOmit(target, [].concat(keys)))
