import { z } from 'zod'
import { InjectSchema, InjectWithMeta } from '@/modules/animation/schemas/utils'
import Inject from '@/enums/Inject'
import InjectableSchema from '@/modules/animation/schemas/InjectableSchema'
import ParseStage from '@/enums/ParseStage'

export const SnippetInjectSchema = (context, env) => InjectSchema(Inject.Snippet).extend({
  key: z.enum(context.pack.snippets?.map(s => s.key) ?? []),
  params: z.record(z.string(), z.any()).optional()
}).transform(({ key, params }, ctx) => {
  if (env.snippet && env.snippet.depth > 10) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Maximum snippet depth exceeded'
    })
    return z.NEVER
  }

  const snippet = context.pack.snippets?.find(s => s.key === key)
  if (!snippet) return

  const value = InjectableSchema(context, {
    ...env,
    stage: ParseStage.Initialize
  }).parse(snippet.value, { path: ctx.path })

  return InjectableSchema(context, {
    ...env,
    snippet: {
      key: snippet.key,
      params: Object.assign({}, snippet.params, params),
      depth: env.snippet ? env.snippet.depth + 1 : 1
    }
  }).parse(value, { path: ctx.path })
})

export const SnippetParamsInjectSchema = InjectWithMeta(
  (context, { snippet }) => InjectSchema(Inject.SnippetParams).extend({
    name: z.string().optional()
  }).transform(
    ({ name }) => name != null ? snippet.params[name] : snippet.params
  ),
  {
    allowed: ({ env }) => 'snippet' in env
  }
)
