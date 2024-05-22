import { z } from 'zod'
import { ArrayOrSingleSchema, buildSwitchSchema } from '@/helpers/schemas'
import { InjectSchema, InjectWithMeta, SwitchSchema } from '@/modules/animation/schemas/injects/InjectSchema'
import evaluate from '@emmetio/math-expression'
import Inject from '@/enums/Inject'
import AnimationType from '@/enums/AnimationType'
import ModuleKey from '@/enums/ModuleKey'

export const ElementInjectSchema = ({ element }) => InjectSchema(Inject.Element)
  .extend({
    querySelector: z.string().optional(),
    querySelectorAll: z.string().optional()
  })
  .transform((params, ctx) => {
    if ('querySelector' in params && 'querySelectorAll' in params) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Inject type '${Inject.Element}' can't have both 'querySelector' and 'querySelectorAll' defined in pair` })
      return z.NEVER
    }
    if (params.querySelectorAll) return Array.from(element.querySelectorAll(params.querySelectorAll))
    if (params.querySelector) return element.querySelector(params.querySelector)
    return element
  })

export const ContainerInjectSchema = ({ container }) => InjectSchema(Inject.Container)
  .transform(() => container)

export const ModuleInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Module, ModuleKey.values(), {
    currentValue: ctx => ctx.module.id,
    possibleValues: ctx => ctx.meta?.modules && Array.from(ctx.meta.modules)
  }),
  { immediate: ['module'] }
)

export const TypeInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Type, AnimationType.values(), { currentValue: ctx => ctx.type }),
  { immediate: ['type'] }
)

export const ObjectAssignInjectSchema = InjectSchema(Inject.ObjectAssign).extend({
  target: z.record(z.any()),
  source: ArrayOrSingleSchema(z.record(z.any())),
}).transform(params => Object.assign(params.target, ...[].concat(params.source)))

export const WaitInjectSchema = InjectSchema(Inject.Wait).extend({
  duration: z.number().positive()
}).transform(params => ({ duration: params.duration }))

export const StringTemplateSchema = InjectSchema(Inject.StringTemplate).extend({
  template: z.string(),
  values: z.union([z.record(z.any()), z.any().array()])
}).transform(({ template, values }) => template.replaceAll(
  /\${([^\${}\s]+)}/g,
  (_, key) => String(values[Array.isArray(values) ? +key : key]) ?? ''
))

export const MathInjectSchema = InjectSchema(Inject.Math).extend({
  expression: z.string()
}).transform(({ expression }, ctx) => {
  try { return evaluate(expression) }
  catch (e) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: e.message + ` "${expression}"` })
    return z.NEVER
  }
})

export const StyleRemovePropertyInjectSchema = InjectWithMeta(
  ({ element }) => InjectSchema(Inject.StyleRemoveProperty).extend({
    target: ArrayOrSingleSchema(z.instanceof(HTMLElement)).optional().default(element),
    property: ArrayOrSingleSchema(z.string())
  }).transform(({ target, property }) => [].concat(target).forEach(
      e => [].concat(property).forEach(p => e.style.removeProperty(p))
    )),
  { lazy: true }
)

export const UndefinedInjectSchema = InjectWithMeta(
  InjectSchema(Inject.Undefined).transform(() => undefined),
  { immediate: true }
)

export const FunctionInjectSchema = InjectWithMeta(
  InjectSchema(Inject.Function).extend({
    functions: z.array(z.function()).optional(),
    'return': z.any().optional()
  }).transform(({ functions, 'return': returnValue }) => {
    functions?.forEach(f => f())
    return returnValue
  }),
  { lazy: true }
)
