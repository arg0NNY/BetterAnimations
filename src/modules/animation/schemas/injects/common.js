import { z } from 'zod'
import { ArrayOrSingleSchema } from '@/utils/schemas'
import {
  ElementSchema,
  InjectSchema,
  InjectWithMeta,
  SwitchSchema
} from '@/modules/animation/schemas/utils'
import evaluate from '@emmetio/math-expression'
import Inject from '@/enums/Inject'
import AnimationType from '@/enums/AnimationType'
import ModuleKey from '@/enums/ModuleKey'
import Logger from '@/modules/Logger'
import Mouse from '@/modules/Mouse'
import ModuleType from '@/enums/ModuleType'
import { getPath } from '@/utils/object'
import { zodTransformErrorBoundary } from '@/utils/zod'
import Debug from '@/modules/Debug'

export const ElementInjectSchema = ({ element }) => ElementSchema(Inject.Element, element)

export const HastInjectSchema = ({ wrapper }) => ElementSchema(Inject.Hast, wrapper, false)

export const ContainerInjectSchema = InjectWithMeta(
  ({ container }) => InjectSchema(Inject.Container)
    .transform(() => container),
  { immediate: ['container'] }
)

export const AnchorInjectSchema = InjectWithMeta(
  ({ anchor }) => InjectSchema(Inject.Anchor)
    .transform(() => anchor),
  { immediate: ['anchor'] }
)

export const ModuleInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Module, ModuleKey.values(), {
    currentValue: ctx => ctx.module.id,
    possibleValues: ctx => ctx.meta?.modules && Array.from(ctx.meta.modules)
  }),
  { immediate: ['module'] }
)

export const ModuleTypeInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.ModuleType, ModuleType.values(), { currentValue: ctx => ctx.module.type }),
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

export const StringTemplateInjectSchema = InjectSchema(Inject.StringTemplate).extend({
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
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: e.message + ` "${expression}"`,
      path: ['expression']
    })
    return z.NEVER
  }
})

export const StyleRemovePropertyInjectSchema = InjectWithMeta(
  ({ element }) => InjectSchema(Inject.StyleRemoveProperty).extend({
    target: ArrayOrSingleSchema(z.instanceof(Element)).optional().default(element),
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
  }).transform(zodTransformErrorBoundary(
    ({ functions, 'return': returnValue }) => {
      functions?.forEach(f => f())
      return returnValue
    }
  )),
  { lazy: true }
)

export const ArgumentsInjectSchema = (context, env) => InjectSchema(Inject.Arguments).extend({
  index: z.number().optional()
}).transform(({ index }) => {
  const args = env.args ?? []
  return index === undefined ? args : args[index]
})

export const DebugInjectSchema = InjectWithMeta(
  context => InjectSchema(Inject.Debug).extend({
    data: z.any().optional()
  }).transform(
    ({ data }, ctx) => Debug.animation(context.animation, context.type)
      .debug(Inject.Debug, context.path.concat(ctx.path), context, data)
  ),
  { lazy: true }
)

export const VarGetInjectSchema = ({ vars }) => InjectSchema(Inject.VarGet).extend({
  name: z.string()
}).transform(({ name }) => vars[name])

export const VarSetInjectSchema = InjectWithMeta(
  ({ vars }) => InjectSchema(Inject.VarSet).extend({
    name: z.string(),
    value: z.any()
  }).transform(({ name, value }) => { vars[name] = value }),
  { lazy: true }
)

export const CallInjectSchema = InjectSchema(Inject.Call).extend({
  function: z.function(),
  args: ArrayOrSingleSchema(z.any()).optional()
}).transform(zodTransformErrorBoundary(
  ({ function: fn, args }) => fn(...[].concat(args))
))

export const GetBoundingClientRectInjectSchema = ({ element }) => InjectSchema(Inject.GetBoundingClientRect).extend({
  target: z.instanceof(Element).optional().default(element),
  value: z.enum(['x', 'y', 'width', 'height']).optional()
}).transform(({ target, value }) => {
  const rect = target.getBoundingClientRect()
  return value ? rect[value] : rect
})

export const MouseInjectSchema = ({ container }) => InjectSchema(Inject.Mouse).extend({
  value: z.enum(['x', 'y']).optional(),
  absolute: z.boolean().optional().default(false)
}).transform(({ value, absolute }) => {
  const { x, y } = (() => {
    if (absolute || !container) return { x: Mouse.x, y: Mouse.y }

    const { left, top } = container.getBoundingClientRect()
    return {
      x: Mouse.x - left,
      y: Mouse.y - top
    }
  })()

  switch (value) {
    case 'x': return x
    case 'y': return y
    default: return `${x}px ${y}px`
  }
})

export const IsIntersectedInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.IsIntersected, [true, false], {
    currentValue: ctx => !!ctx.isIntersected,
  }),
  { immediate: ['isIntersected'] }
)

export const GetInjectSchema = InjectSchema(Inject.Get).extend({
  target: z.instanceof(Object),
  key: z.string().optional(),
  path: z.string().optional()
}).transform(({ target, key, path }) => {
  if (key) return target[key]
  if (path) return getPath(target, path)
  return target
})

export const IfInjectSchema = InjectSchema(Inject.If).extend({
  value: z.any(),
  then: z.any(),
  else: z.any().optional()
}).transform(({ value, then, else: elseValue }) => value ? then : elseValue)

export const SwitchInjectSchema = InjectSchema(Inject.Switch).extend({
  value: z.any(),
  case: z.union([
    z.record(z.any()),
    z.tuple([z.any(), z.any()]).array()
  ]),
  default: z.any().optional()
}).transform(({ value, case: cases, default: defaultValue }) => {
  return new Map(
    Array.isArray(cases) ? cases : Object.entries(cases)
  ).get(value) ?? defaultValue
})
