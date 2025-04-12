import ParseStage from '@/enums/ParseStage'
import * as z from 'zod'
import InjectableSchema from '@/modules/animation/schemas/InjectableSchema'
import AnimationError from '@/structs/AnimationError'
import { formatZodError } from '@/utils/zod'

const ParsableSchema = (stage, schema) => (context, env) =>
  (![ParseStage.Initialize, stage].includes(env.stage) ? z.any() : InjectableSchema(context, env))
    .transform((value, ctx) => {
      try {
        return (
          env.stage === stage
            ? (typeof schema === 'function' ? schema(context, env) : schema)
            : z.any()
        ).parse(value, { path: ctx.path })
      }
      catch (error) {
        throw new AnimationError(
          context.animation,
          formatZodError(error, { pack: context.pack, data: value, context, path: ctx.path }),
          { module: context.module, pack: context.pack, type: context.type, context }
        )
      }
    })

export default ParsableSchema
