import * as z from 'zod'
import ParsableAnimateSchema, {
  buildPreLayoutEnv,
  HookSchema
} from '@/modules/animation/schemas/ParsableAnimateSchema'
import ParseStage from '@/enums/ParseStage'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import ParsableSchema from '@/modules/animation/schemas/ParsableSchema'

const ExtendsSchema = ParsableSchema(
  ParseStage.Extend,
  z.any()
)

const ParsableExtendableAnimateSchema = (context, env) => {
  env = buildPreLayoutEnv(env)
  return ParsableAnimateSchema(context, env).extend({
    onBeforeExtend: HookSchema(context, env, ParseStage.BeforeExtend),
    extends: ArrayOrSingleSchema(ExtendsSchema(context, env)).optional()
  }).strict()
}

export const ParsableExtendsSchema = (context, env) =>
  ArrayOrSingleSchema(
    ParsableExtendableAnimateSchema(context, env).nullable()
  ).optional()

export default ParsableExtendableAnimateSchema
