import ParseStage from '@enums/ParseStage'
import { z } from 'zod'
import AnimationError from '@error/structs/AnimationError'
import { formatZodError } from '@animation/zod'
import Documentation from '@shared/documentation'
import { parseInjectable } from '@animation/injectable/parse'

const ParsableSchema = (stage, schema) => (context, env) =>
  (
    ![ParseStage.Initialize, stage].includes(env.stage)
      ? z.any()
      : z.any().transform((value, ctx) => parseInjectable(
        value,
        context,
        env,
        { path: ctx.path }
      ))
  )
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
          formatZodError(error, { pack: context.pack, data: value, context, path: ctx.path, docs: Documentation.getDefinitionUrl(Documentation.Definition.Animate) }),
          { module: context.module, pack: context.pack, type: context.type, context }
        )
      }
    })

export default ParsableSchema
