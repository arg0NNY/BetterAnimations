import * as GeneralInjectSchemas from '@animation/schemas/injects/general'
import * as ObjectInjectSchemas from '@animation/schemas/injects/object'
import * as ArrayInjectSchemas from '@animation/schemas/injects/array'
import * as AnimeInjectSchemas from '@animation/schemas/injects/anime'
import * as SettingsInjectSchemas from '@animation/schemas/injects/settings'
import * as MathInjectSchemas from '@animation/schemas/injects/math'
import * as OperatorsInjectSchemas from '@animation/schemas/injects/operators'
import * as AccordionsInjectSchemas from '@animation/schemas/injects/accordions'
import * as SnippetsInjectSchemas from '@animation/schemas/injects/snippets'
import Spelling from 'spelling'
import Inject from '@enums/Inject'
import { InjectWithMeta } from '@animation/schemas/utils'

function parseInjectSchemas (schemas) {
  return Object.fromEntries(
    Object.entries(schemas)
      .filter(([key]) => key.endsWith('InjectSchema'))
      .map(([key, schema]) => [
        Inject[key.replace(/InjectSchema$/, '')],
        InjectWithMeta(schema)
      ])
  )
}

export const groupedInjectSchemas = {
  general: parseInjectSchemas(GeneralInjectSchemas),
  object: parseInjectSchemas(ObjectInjectSchemas),
  array: parseInjectSchemas(ArrayInjectSchemas),
  anime: parseInjectSchemas(AnimeInjectSchemas),
  settings: parseInjectSchemas(SettingsInjectSchemas),
  math: parseInjectSchemas(MathInjectSchemas),
  operators: parseInjectSchemas(OperatorsInjectSchemas),
  accordions: parseInjectSchemas(AccordionsInjectSchemas),
  snippets: parseInjectSchemas(SnippetsInjectSchemas)
}
export const injectSchemas = Object.assign({}, ...Object.values(groupedInjectSchemas))
export const injectTypes = Object.keys(injectSchemas)
export const injectDict = new Spelling(injectTypes)

export const safeInjects = [
  ...Object.keys(groupedInjectSchemas.settings),
  ...Object.keys(groupedInjectSchemas.math),
  ...Object.keys(groupedInjectSchemas.operators),
  ...Object.keys(groupedInjectSchemas.array),
  ...Object.keys(groupedInjectSchemas.snippets),
  // Anime
  Inject.UtilsRandom,
  Inject.UtilsGet,
  // Common
  Inject.Element,
  Inject.Hast,
  Inject.Container,
  Inject.Anchor,
  Inject.Module,
  Inject.ModuleType,
  Inject.Type,
  Inject.Assign,
  Inject.StringTemplate,
  Inject.Undefined,
  Inject.VarGet,
  Inject.Rect,
  Inject.Window,
  Inject.Mouse,
  Inject.IsIntersected,
  Inject.If,
  Inject.Switch,
  Inject.Raw,
  Inject.Vector,
  Inject.Rotate
]

export const layoutDependentInjects = [
  Inject.Hast
]
