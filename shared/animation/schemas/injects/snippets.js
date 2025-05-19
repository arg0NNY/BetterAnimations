import { z } from 'zod'
import { InjectSchema, InjectWithMeta } from '@animation/schemas/utils'
import Inject from '@shared/enums/Inject'
import InjectableSchema from '@animation/schemas/InjectableSchema'
import ParseStage from '@shared/enums/ParseStage'
import AnimationError from '@error/structs/AnimationError'
import { formatZodError } from '@/utils/zod'

export const SnippetInjectSchema = (context, env) => InjectSchema(Inject.Snippet).extend({
  key: z.enum(context.pack.snippets?.map(s => s.key) ?? []),
  params: z.record(z.string(), z.any()).optional(),
  raw: z.boolean().optional().default(false)
}).transform(({ key, params, raw }, ctx) => {
  if (env.snippet && env.snippet.depth > 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Maximum snippet depth exceeded'
    })
    return z.NEVER
  }

  const snippetIndex = context.pack.snippets?.findIndex(s => s.key === key)
  if (snippetIndex == null || snippetIndex === -1) return

  const snippet = context.pack.snippets[snippetIndex]
  if (raw) return snippet.value

  const snippetEnv = {
    ...env,
    snippet: {
      key: snippet.key,
      params: Object.assign({}, snippet.params, params),
      depth: env.snippet ? env.snippet.depth + 1 : 1
    }
  }

  const path = ['snippets', snippetIndex, 'value']
  try {
    const value = InjectableSchema(context, {
      ...snippetEnv,
      stage: ParseStage.Initialize
    }).parse(snippet.value, { path })

    return InjectableSchema(context, snippetEnv)
      .parse(value, { path })
  }
  catch (error) {
    throw error instanceof AnimationError ? error : new AnimationError(
      context.animation,
      formatZodError(error, { pack: context.pack, data: snippet.value, context, path, sourceMap: { useSelf: true } }),
      { module: context.module, pack: context.pack, type: context.type, context }
    )
  }
})

export const SnippetParamsInjectSchema = InjectWithMeta(
  (context, { snippet }) => InjectSchema(Inject.SnippetParams).extend({
    name: z.string()
  }).transform(({ name }) => snippet.params[name]),
  {
    allowed: ({ env }) => 'snippet' in env
  }
)
