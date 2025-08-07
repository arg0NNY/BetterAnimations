import AnimationType from '@enums/AnimationType'
import ParsableAnimateSchema from '@animation/schemas/ParsableAnimateSchema'
import ParseStage from '@enums/ParseStage'
import ErrorManager from '@error/manager'
import AnimationError from '@error/structs/AnimationError'
import { formatZodError } from '@animation/zod'
import { buildCSS } from '@animation/utils'
import Debug from '@animation/debug'
import { clearSourceMapDeep, getSourcePath, sourceMappedObjectEntries } from '@animation/sourceMap'
import ParsableExtendableAnimateSchema, { ParsableExtendsSchema } from '@animation/schemas/ParsableExtendableAnimateSchema'
import { omit } from '@utils/object'
import { intersect, promisify } from '@utils/anime'
import Documentation from '@shared/documentation'
import isElement from 'lodash-es/isElement'

export function buildContext (pack, animation, type, settings = {}, meta = {}, context = {}) {
  return Object.assign(
    {
      pack,
      animation,
      settings: animation?.settings,
      meta,
      type,
      vars: {}
    },
    settings,
    context
  )
}

export function buildWrapper (data, context) {
  if (!data.hast && !data.css) return null

  const id = `${context.module.id}-${context.type}-${Date.now()}`
  const wrapper = context.document.createElement('div')

  wrapper.setAttribute('data-baa', id)

  wrapper.append(
    ...[].concat(data.hast).filter(isElement)
  )

  if (data.css) {
    const parent = `[data-baa="${id}"]`
    wrapper.append(
      ...[].concat(
        data.css
      ).flat().filter(Boolean).map((css, cssIndex) => {
        const element = context.document.createElement('style')
        element.appendChild(context.document.createTextNode(
          buildCSS(
            clearSourceMapDeep(css),
            (selector, selectorIndex) => {
              if (selector === '{element}') return `${parent} + *`
              if (selector === '{container}') return `[data-ba-container]:has(> ${parent})`

              const attribute = `data-baa-${id}-${cssIndex}-${selectorIndex}`
              try {
                wrapper.querySelectorAll(selector)
                  .forEach(e => e.setAttribute(attribute, ''))
              }
              catch {
                Debug.animation(context.animation, context.type)
                  .invalidSelector(selector, getSourcePath(css, selector) ?? context.path.concat('css'), context)
              }
              return `[${attribute}]`
            }
          )
        ))
        return element
      })
    )
  }

  return wrapper
}

export function parse (data = null, context, options = {}) {
  const debug = context.animation ? Debug.animation(context.animation, context.type) : null

  const _parseStage = (stage, data, schema, path = []) => {
    path = context.path.concat(path)
    debug?.parseStart(stage, data, context)
    try {
      data = data ? schema(context, { stage })
        .parse(data, { path }) : {}

      debug?.parseEnd(stage, data, context)
      return data
    }
    catch (error) {
      context.onError(
        error instanceof AnimationError ? error : new AnimationError(
          context.animation,
          formatZodError(error, { pack: context.pack, data, context, path, docs: Documentation.getDefinitionUrl(Documentation.Definition.Animate) }),
          { module: context.module, pack: context.pack, type: context.type, context }
        )
      )
      context.instance.cancel(true)
      return null
    }
  }

  const _hook = (name, stage, data, schema, path = []) => {
    debug?.hook(name, context)
    if (!(name in (data ?? {}))) return data

    data = _parseStage(stage, data, schema, path)
    if (data === null) return null

    data[name]?.()
    return data
  }

  const extend = (data, path = [], _depth = 1) => {
    if (_depth > 10) {
      context.onError(
        new AnimationError(
          context.animation,
          'Maximum extend depth exceeded',
          { module: context.module, pack: context.pack, type: context.type, context }
        )
      )
      context.instance.cancel(true)
      return { success: false, data }
    }

    if (!('extends' in (data ?? {}))) return { success: true, data }

    if (_hook('onBeforeExtend', ParseStage.BeforeExtend, data, ParsableExtendableAnimateSchema, path) === null) return { success: false, data }
    data = omit(data, ['onBeforeExtend'])

    let _data = _parseStage(ParseStage.Extend, data, ParsableExtendableAnimateSchema, path)
    if (_data === null) return { success: false, data }

    _data.extends = _parseStage(ParseStage.Initialize, _data.extends, ParsableExtendsSchema, path.concat('extends'))
    if (_data.extends === null) return { success: false, data }

    const _extends = []
    for (const value of [].concat(_data.extends)) {
      const { success, data } = extend(
        value,
        path.concat('extends', Array.isArray(_data.extends) ? _data.extends.indexOf(value) : []),
        _depth + 1
      )
      if (!success) return { success: false, data }
      _extends.unshift(data)
    }

    data = omit(data, ['extends'])
    _extends.forEach(value => {
      if (!value) return
      sourceMappedObjectEntries(value).forEach(([key, value]) => {
        if (!data[key]) data[key] = []
        data[key] = [].concat(value).concat(data[key])
      })
    })

    return { success: true, data }
  }

  const parseStage = (stage, schema = ParsableAnimateSchema) => {
    if (data === null) return true
    const _data = _parseStage(stage, data, schema)
    if (_data === null) return false
    data = _data
    return true
  }

  const hook = (name, stage, schema = ParsableAnimateSchema) => {
    if (data === null) return true
    const _data = _hook(name, stage, data, schema)
    if (_data === null) return false
    data = _data
    return !context.instance.cancelled
  }

  let before, after, accordion

  const sharedHook = (name, stage, schema = ParsableExtendableAnimateSchema) => () => {
    before?.[name]?.()
    after?.[name]?.()
    return hook(name, stage, schema)
  }

  context.instance.onBeforeDestroy = sharedHook('onBeforeDestroy', ParseStage.BeforeDestroy)
  context.instance.onDestroyed = sharedHook('onDestroyed', ParseStage.Destroyed)

  parsing: {
    const { success, data: _data } = extend(data)
    data = _data
    if (!success) break parsing

    if (!hook('onBeforeLayout', ParseStage.BeforeLayout)) break parsing

    if (!parseStage(ParseStage.Layout)) break parsing
    context.wrapper = data ? buildWrapper(data, context) : null

    if (!hook('onBeforeCreate', ParseStage.BeforeCreate)) break parsing

    if (!parseStage(ParseStage.Anime)) break parsing

    if (!hook('onCreated', ParseStage.Created)) break parsing

    before = options.before
      && (!context.intersectWith?.accordion || context.intersectWith.accordion.began)
        ? options.before(context)
        : null
    after = options.after
      ? options.after(context)
      : null
    accordion = intersect(
      before?.execute() ?? after?.execute() ?? null,
      context.intersectWith?.accordion
    )
  }

  const instances = !context.instance.cancelled
    ? (data?.anime ?? [])
    : []

  instances.pause = () => instances.concat(accordion).forEach(i => i?.pause())
  instances.cancel = () => instances.concat(accordion).forEach(i => i?.cancel())
  instances.revert = () => instances.concat(accordion).forEach(i => i?.revert())

  const finishedAll = Promise.all(instances.map(promisify))

  const raf = fn => context.window.requestAnimationFrame(
    () => !context.instance.cancelled && fn()
  )
  let onBeforeBegin

  const begin = (immediate = true) => {
    if (context.instance.cancelled) return

    onBeforeBegin = () => hook('onBeforeBegin', ParseStage.BeforeBegin)
    if (!immediate) {
      onBeforeBegin()
      if (context.instance.cancelled) return
    }

    raf(() => instances.forEach(
      after && context.intersectWith?.accordion && !context.intersectWith.accordion.completed
        ? i => i.complete()
        : i => i.resume()
    ))
  }

  if (before) {
    onBeforeBegin = () => before.onBeforeBegin?.()
    raf(() => {
      accordion.play()
    })
    promisify(accordion).then(() => {
      before.onCompleted?.()
      begin(false)
    })
  }
  else begin()

  return {
    wrapper: context.wrapper,
    onBeforeBegin,
    accordion,
    instances,
    finished: finishedAll
      .then(() => {
        if (context.instance.cancelled) return

        if (!hook('onCompleted', ParseStage.Completed)) return

        if (before) return promisify(accordion)
        if (after) {
          after.onBeforeBegin?.()
          raf(() => accordion.play())
          return promisify(accordion).then(() => after.onCompleted?.())
        }
      })
  }
}
