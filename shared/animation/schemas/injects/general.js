import { z } from 'zod'
import { ArrayOrSingleSchema } from '@utils/schemas'
import {
  ElementSchema,
  InjectSchema,
  InjectWithMeta,
  SwitchSchema,
  TargetSchema,
  TargetsSchema
} from '@animation/schemas/utils'
import Inject from '@enums/Inject'
import AnimationType from '@enums/AnimationType'
import ModuleKey from '@enums/ModuleKey'
import ModuleType from '@enums/ModuleType'
import { getPath, parsePath } from '@utils/json'
import { zodTransformErrorBoundary } from '@utils/zod'
import Debug from '@logger/debug'
import {
  clearSourceMap,
  clearSourceMapDeep,
  getSourcePath,
  SELF_KEY
} from '@animation/sourceMap'
import { restrictForbiddenKeys } from '@animation/keys'
import TrustedFunctionSchema from '@animation/schemas/TrustedFunctionSchema'
import { getRect } from '@utils/position'
import isElement from 'lodash-es/isElement'

export const ElementInjectSchema = ({ element }) => ElementSchema(Inject.Element, element)

export const ContainerInjectSchema = ({ container }) => InjectSchema(Inject.Container)
  .transform(() => container)

export const AnchorInjectSchema = ({ anchor }) => InjectSchema(Inject.Anchor)
  .transform(() => isElement(anchor) ? anchor : undefined)

export const HastInjectSchema = ({ wrapper }) => ElementSchema(Inject.Hast, wrapper, false)

export const ModuleInjectSchema = InjectWithMeta(
  SwitchSchema(Inject.Module, ModuleKey.values(), {
    currentValue: ctx => ctx.module.id,
    possibleValues: ctx => Array.from(ctx.animation.modules)
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

export const StringTemplateInjectSchema = InjectSchema(Inject.StringTemplate).extend({
  template: z.string(),
  values: z.union([z.record(z.any()), z.any().array()])
}).transform(zodTransformErrorBoundary(
  ({ template, values }) => {
    values = clearSourceMap(values)
    return template.replaceAll(
      /\${([^\${}\s]+)}/g,
      (_, key) => String(values[Array.isArray(values) ? +key : key]) ?? ''
    )
  }
))

export const StyleRemovePropertyInjectSchema = InjectWithMeta(
  context => InjectSchema(Inject.StyleRemoveProperty).extend({
    targets: TargetsSchema(context).optional().default([context.element]),
    property: ArrayOrSingleSchema(z.string())
  }).transform(({ targets, property }) => targets.forEach(
      e => [].concat(property).forEach(p => e.style.removeProperty(p))
    )),
  { lazy: true }
)

export const UndefinedInjectSchema = InjectWithMeta(
  InjectSchema(Inject.Undefined).transform(() => undefined),
  { immediate: true }
)

export const FunctionInjectSchema = InjectWithMeta(
  (context, { args }) => InjectSchema(Inject.Function).extend({
    functions: ArrayOrSingleSchema(TrustedFunctionSchema).optional(),
    'return': z.any().optional()
  }).transform(zodTransformErrorBoundary(
    ({ functions, 'return': returnValue }) => {
      const functionReturnValues = [].concat(functions).map(f => f?.(...args))

      // Clear source map because the return value can be used outside the parser (by Anime.js, for example)
      return clearSourceMapDeep(
        returnValue === undefined
          ? functionReturnValues.pop()
          : returnValue
      )
    }
  )),
  { lazy: true }
)

export const ArgumentsInjectSchema =
  (context, { args }) => InjectSchema(Inject.Arguments).extend({
    index: z.number().optional()
  }).transform(({ index }) => index == null ? args : args[index])

export const DebugInjectSchema = InjectWithMeta(
  context => InjectSchema(Inject.Debug).extend({
    data: z.any().optional()
  }).transform(
    value => Debug.animation(context.animation, context.type)
      .debug(Inject.Debug, getSourcePath(value, SELF_KEY), context, value.data)
  ),
  { lazy: true }
)

export const VarSetInjectSchema = InjectWithMeta(
  ({ vars }) => InjectSchema(Inject.VarSet).extend({
    name: z.string().refine(
      restrictForbiddenKeys,
      name => ({ message: `Forbidden variable name: '${name}'` })
    ),
    value: z.any()
  }).transform(({ name, value }) => { vars[name] = value }),
  { lazy: true }
)

export const VarGetInjectSchema = ({ vars }) => InjectSchema(Inject.VarGet).extend({
  name: z.string().refine(
    restrictForbiddenKeys,
    name => ({ message: `Forbidden variable name: '${name}'` })
  )
}).transform(({ name }) => vars[name])

export const CallInjectSchema = InjectSchema(Inject.Call).extend({
  function: TrustedFunctionSchema,
  arguments: ArrayOrSingleSchema(z.any()).optional()
}).transform(zodTransformErrorBoundary(
  ({ function: fn, arguments: args }) => fn(
    ...[].concat(clearSourceMapDeep(args))
  )
))

export const RectInjectSchema = context => InjectSchema(Inject.Rect).extend({
  target: TargetSchema(context).optional(),
  value: z.enum(['x', 'y', 'top', 'left', 'right', 'bottom', 'width', 'height']).optional()
}).transform(({ target, value }) => {
  const rect = target ? getRect(target) : context.containerRect
  return value ? rect[value] : rect
})

export const WindowInjectSchema = ({ window }) => InjectSchema(Inject.Window).extend({
  value: z.enum(['width', 'height'])
}).transform(({ value }) => {
  switch (value) {
    case 'width': return window.innerWidth
    case 'height': return window.innerHeight
  }
})

export const MouseInjectSchema = ({ containerRect, mouse }) => InjectSchema(Inject.Mouse).extend({
  value: z.enum(['x', 'y']).optional(),
  absolute: z.boolean().optional().default(false)
}).transform(({ value, absolute }) => {
  const { x, y } = (() => {
    if (absolute || !containerRect) return { x: mouse.x, y: mouse.y }

    const { left, top } = containerRect
    return {
      x: mouse.x - left,
      y: mouse.y - top
    }
  })()

  switch (value) {
    case 'x': return x
    case 'y': return y
    default: return `${x}px ${y}px`
  }
})

export const IsIntersectedInjectSchema = SwitchSchema(Inject.IsIntersected, [true, false], {
  currentValue: ctx => !!ctx.isIntersected,
})

export const GetInjectSchema = InjectSchema(Inject.Get).extend({
  target: z.union([
    z.record(z.any()),
    z.array(z.any())
  ]),
  key: z.union([
    z.string(),
    z.number()
  ]).refine(
    restrictForbiddenKeys,
    key => ({ message: `Forbidden key: '${key}'` })
  ).optional(),
  path: z.string()
    .startsWith('/', 'JSON Pointer must begin with `/`')
    .superRefine((path, ctx) => {
      if (!path.startsWith('/')) return
      path = parsePath(path)
      const index = path.findIndex(i => !restrictForbiddenKeys(i))
      if (index === -1) return
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Forbidden key '${path[index]}' at index ${index} in JSON Pointer`
      })
    })
    .optional()
}).transform(({ target, key, path }) => {
  if (key != null) return target[key]
  if (path != null) return getPath(target, path)
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
  cases = clearSourceMap(cases)
  return new Map(
    Array.isArray(cases) ? cases : Object.entries(cases)
  ).get(value) ?? defaultValue
})

export const LoadInjectSchema = ({ pack, animation, type }) => InjectSchema(Inject.Load).extend({
  animation: z.enum(pack.animations.map(a => a.key).filter(k => k !== animation.key)),
  type: z.enum(AnimationType.values()).optional().default(type)
}).transform(({ animation: key, type }) => {
  const target = pack.animations.find(a => a.key === key)
  return target?.[type] ?? target?.animate
})

export const RawInjectBaseSchema = InjectSchema(Inject.Raw).extend({
  value: z.any()
})
export const RawInjectSchema = RawInjectBaseSchema.transform(({ value }) => value)
