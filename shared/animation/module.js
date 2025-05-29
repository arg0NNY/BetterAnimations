import ModuleType from '@enums/ModuleType'
import { buildContext } from '@animation/parser'
import Debug from '@logger/debug'
import ParsableExtendableAnimateSchema from '@animation/schemas/ParsableExtendableAnimateSchema'
import ParseStage from '@enums/ParseStage'
import AnimationError from '@error/structs/AnimationError'
import { formatZodError } from '@utils/zod'
import Documentation from '@shared/documentation'
import ErrorManager from '@error/manager'
import AnimationType from '@enums/AnimationType'
import Setting from '@enums/AnimationSetting'
import PositionAutoType from '@enums/PositionAutoType'
import Position from '@enums/Position'
import DirectionAutoType from '@enums/DirectionAutoType'
import {
  getAnchorDirection,
  getDirection,
  getDirectionsByAxis,
  getSupportedAxes,
  reverseDirection
} from '@utils/direction'
import Direction from '@enums/Direction'
import { computeOverridable } from '@animation/schemas/OverridableSchema'
import { metaOverridePresets } from '@animation/schemas/MetaSchema'
import Auto from '@enums/Auto'
import internalPacks from '@packs'
import EasingSchema from '@animation/schemas/EasingSchema'
import Axis from '@enums/Axis'
import { getPosition, reversePosition } from '@utils/position'

export default class Module {
  constructor ({
    id,
    name,
    parent = null,
    meta = {},
    description,
    controls,
    alert,
    onToggle
  }) {
    this.id = id
    this.name = name
    this.description = description ?? 'No description provided.'
    this.controls = controls
    this._alert = alert
    this._onToggle = onToggle
    this.meta = meta
    this.parent = parent
    this.animations = {}
  }

  get settings () {
    return {}
  }
  getPack (slug) {
    return internalPacks[slug]
  }
  getAnimationConfig (pack, animation, type) {
    return {}
  }

  onToggle (value) {
    this._onToggle?.(value)
  }
  onSettingsChange () {}

  isEnabled (type = null) {
    if (!type) return this.settings.enabled ?? true

    return (this.settings.enabled ?? true)
      && (!!this.animations[type]?.animate || !!this.getAccordion(type)?.enabled)
  }
  setIsEnabled (value) {
    this.settings.enabled = value
    this.onToggle(value)
  }
  enable () { this.setIsEnabled(true) }
  disable () { this.setIsEnabled(false) }
  toggle () { this.setIsEnabled(!this.isEnabled()) }

  get type () {
    return this.meta.type ?? ModuleType.Reveal
  }

  get alert () {
    if (typeof this._alert === 'function') return this._alert(this.name)
    return this._alert
  }

  findAnimation (packOrSlug, key) {
    const animation = (typeof packOrSlug === 'string' ? this.getPack(packOrSlug) : packOrSlug)
      ?.animations.find(a => a.key === key)
    return animation && this.isSupportedBy(animation) ? animation : null
  }

  getAnimationSettings (pack, animation, type, options = {}) {
    return this.buildSettings(animation, type, this.getAnimationConfig(pack, animation, type), options)
  }

  initializeAnimation (pack, animation, type) {
    if (typeof pack === 'string') {
      type = pack

      const pointer = this.settings[type] ?? {}
      pack = pointer.packSlug && this.getPack(pointer.packSlug)
      animation = pack && this.findAnimation(pack, pointer.animationKey)
    }

    const config = animation ? this.getAnimationConfig(pack, animation, type) : {}
    const path = animation ? ['animations', pack.animations.indexOf(animation), type in animation ? type : 'animate'] : []

    const settings = animation && this.buildSettings(animation, type, config, { auto: false })
    const meta = animation && this.buildAnimationMeta(animation, type)
    const context = animation && buildContext(pack, animation, type, settings, meta, { module: this, path })

    const debug = Debug.animation(animation, type)
    const data = animation?.[type] ?? animation?.animate

    if (animation) debug.initializeStart(data, context)

    let animate, error
    try {
      animate = animation && ParsableExtendableAnimateSchema(context, { stage: ParseStage.Initialize })
        .parse(data, { path })
    }
    catch (err) {
      error = err instanceof AnimationError ? err : new AnimationError(
        animation,
        formatZodError(err, { pack, data, context, received: false, docs: Documentation.getDefinitionUrl(Documentation.Definition.Animate) }),
        { module: this, pack, type, context }
      )
      ErrorManager.registerAnimationError(error)
    }

    if (animation) debug.initializeEnd(animate, context)

    return {
      packSlug: pack?.slug ?? null,
      animationKey: animation?.key ?? null,
      id: [pack?.slug, animation?.key].filter(Boolean).join('/') || null,
      pack,
      animation,
      path,
      meta,
      config,
      animate,
      error
    }
  }
  initializeAnimations (pack, animation) {
    if (pack && animation)
      return {
        enter: this.initializeAnimation(pack, animation, AnimationType.Enter),
        exit: this.initializeAnimation(pack, animation, AnimationType.Exit)
      }

    this.animations = {
      enter: this.initializeAnimation(AnimationType.Enter),
      exit: this.initializeAnimation(AnimationType.Exit)
    }
  }

  getAnimation (data, type, options, context) {
    if (typeof data === 'string') {
      [type, options, context] = arguments
      data = this.animations[type]
    }

    const { pack, animation, path, meta, config } = data

    const settings = animation && this.buildSettings(animation, type, config, options)
    const ctx = buildContext(pack, animation, type, settings, meta, { module: this, path, ...context })

    return {
      ...data,
      settings,
      context: ctx
    }
  }
  getAnimations (options = {}) {
    return {
      enter: this.getAnimation(AnimationType.Enter, options),
      exit: this.getAnimation(AnimationType.Exit, options)
    }
  }

  setAnimation (type, packSlug, animationKey) {
    this.settings[type] = { packSlug, animationKey }
    this.onSettingsChange()
  }

  isSupportedBy (animation) {
    return animation.modules.has(this.id)
  }

  getSupportsAuto (setting) {
    const [type, options] = [].concat(this.meta.settings?.supportsAuto?.[setting])
    return {
      type,
      options: {
        asDefault: true,
        ...options
      }
    }
  }
  supportsAuto (animation, setting, autoType = null) {
    if (!animation.settings?.[setting]) return false

    const { type } = this.getSupportsAuto(setting)
    if (autoType === null ? !type : type !== autoType) return false
    if (animation.settings[setting] === true) return true

    switch (setting) {
      case Setting.Position:
        if (type === PositionAutoType.Precise) return false // Otherwise the condition above would have already returned `true` (module requires precise positioning for auto, but animation doesn't support it)
        return [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
          Position.Center
        ].every(v => animation.settings[setting].includes(v))
      case Setting.Direction:
        switch (type) {
          case DirectionAutoType.Alternate:
            return getSupportedAxes(animation.settings[setting]).length > 0
          case DirectionAutoType.Anchor:
            return [
              Direction.Upwards,
              Direction.Downwards,
              Direction.Leftwards,
              Direction.Rightwards
            ].every(v => animation.settings[setting]?.includes(v))
        }
      default: return false
    }
  }
  getAllSettingsSupportingAuto (animation, defaultOnly = false) {
    return [
      Setting.Position,
      Setting.Direction
    ].filter(
      s => this.supportsAuto(animation, s)
        && (!defaultOnly || this.getSupportsAuto(s).options.asDefault)
    )
  }

  getOverridableConditionValues (type) {
    return {
      type,
      module: this.id,
      'module.type': this.type
    }
  }
  buildAnimationMeta (animation, type) {
    return computeOverridable(
      animation.meta,
      this.getOverridableConditionValues(type),
      metaOverridePresets
    )
  }
  buildAnimationDefaultSettings (animation, type) {
    return computeOverridable(
      animation.settings.defaults,
      this.getOverridableConditionValues(type)
    )
  }

  buildModuleDefaultSettings (animation) {
    return Object.fromEntries(
      Object.entries(this.meta.settings?.defaults ?? {})
        .filter(([key]) => {
          if (key === Setting.Overflow) return true
          if ([Setting.DirectionAxis, Setting.DirectionReverse, Setting.DirectionTowards].includes(key))
            key = Setting.Direction
          return key in (animation.settings ?? {})
        })
    )
  }
  buildDefaultSettings (animation, type, normalized = true) {
    const settings = Object.assign(
      { [Setting.Overflow]: true },
      this.buildModuleDefaultSettings(animation),
      this.buildAnimationDefaultSettings(animation, type),
      Object.fromEntries(
        this.getAllSettingsSupportingAuto(animation, true).map(s => [s, Auto()])
      )
    )

    return normalized ? this.normalizeSettings(animation, type, settings) : settings
  }
  buildSettings (animation, type, config, options = {}) {
    const settings = animation ? this.normalizeSettings(
      animation,
      type,
      Object.assign(
        this.buildDefaultSettings(animation, type, false),
        config
      )
    ) : {}

    if ('auto' in options) this.assignAutoValues(animation, type, settings, options.auto)

    return settings
  }

  normalizeSetting (animation, type, setting, value, allSettings, animationDefaults) {
    switch (setting) {
      case Setting.PositionPreserve: {
        if (allSettings[Setting.Position] !== Auto()
          || !this.supportsAuto(animation, Setting.Position, PositionAutoType.Precise)
          || !this.getSupportsAuto(Setting.Position).options.preservable)
          return undefined
        return Boolean(value)
      }
      case Setting.DirectionAxis: {
        if (allSettings[Setting.Direction] !== Auto()
          || !this.supportsAuto(animation, Setting.Direction, DirectionAutoType.Alternate))
          return undefined

        const directions = animation.settings[Setting.Direction] ?? []
        if (getDirectionsByAxis(value)?.every(d => directions.includes(d))) return value
        return animationDefaults[setting] ?? [Axis.Y, Axis.Z, Axis.X].find(axis => getDirectionsByAxis(axis).every(d => directions.includes(d)))
      }
      case Setting.DirectionReverse: {
        if (allSettings[Setting.Direction] !== Auto()
          || !this.supportsAuto(animation, Setting.Direction, DirectionAutoType.Alternate))
          return undefined
        return Boolean(value)
      }
      case Setting.DirectionTowards: {
        if (allSettings[Setting.Direction] !== Auto()
          || !this.supportsAuto(animation, Setting.Direction, DirectionAutoType.Anchor))
          return undefined
        return Boolean(value)
      }
      case Setting.Overflow: {
        if (animation.settings?.[setting] === false)
          return animationDefaults[setting]
        return Boolean(value)
      }
    }

    if (animation.settings?.[setting] === undefined) return undefined

    switch (setting) {
      case Setting.Duration: {
        const { from, to } = animation.settings[setting]
        return Math.max(from, Math.min(to, typeof value === 'number' ? value : animationDefaults[setting]))
      }
      case Setting.Variant: {
        const keys = animation.settings[setting].map(v => v.key)
        if (!keys.includes(value)) return animationDefaults[setting] ?? keys[0]
        return value
      }
      case Setting.Position: {
        if (value === Auto() && this.supportsAuto(animation, setting)) return value
        const values = animation.settings[setting] === true ? Position.values() : animation.settings[setting]
        if (!values.includes(value)) return animationDefaults[setting] ?? values[0]
        return value
      }
      case Setting.Direction: {
        if (value === Auto() && this.supportsAuto(animation, setting)) return value
        const values = animation.settings[setting]
        if (!values.includes(value)) return animationDefaults[setting] ?? values[0]
        return value
      }
      case Setting.Easing: {
        return EasingSchema.catch(animationDefaults[setting]).parse(value)
      }
      default: return undefined
    }
  }
  normalizeSettings (animation, type, settings) {
    const animationDefaults = this.buildAnimationDefaultSettings(animation, type)
    return Object.fromEntries(
      Setting.values()
        .map(key => [key, this.normalizeSetting(animation, type, key, settings[key], settings, animationDefaults)])
        .filter(a => a[1] !== undefined)
    )
  }

  assignAutoValues (animation, type, normalizedSettings, values = {}) {
    const settings = normalizedSettings
    const animationDefaults = this.buildAnimationDefaultSettings(animation, type)

    if (values === false) {
      Object.keys(settings).forEach(key => settings[key] === Auto() && delete settings[key])
      return settings
    }

    if (settings[Setting.Position] === Auto()) {
      if (!values.position)
        settings[Setting.Position] = { isAuto: true, mouse: settings[Setting.PositionPreserve] ? values.preservedMouse : values.mouse }
      else {
        const position = reversePosition(values.position)
        const mergedPosition = getPosition(position, values.align)
        const supportedPositions = animation.settings[Setting.Position]

        const value = Array.isArray(supportedPositions) && !supportedPositions.includes(mergedPosition)
          ? position
          : mergedPosition

        settings[Setting.Position] = { isAuto: true, value }
      }
    }

    if (settings[Setting.Direction] === Auto())
      switch (this.getSupportsAuto(Setting.Direction).type) {
        case DirectionAutoType.Alternate: {
          const direction = getDirection(settings[Setting.DirectionAxis], values.direction)
          settings[Setting.Direction] = settings[Setting.DirectionReverse] ? reverseDirection(direction) : direction
          break
        }
        case DirectionAutoType.Anchor: {
          settings[Setting.Direction] = values.position
            ? getAnchorDirection(values.position, settings[Setting.DirectionTowards])
            : animationDefaults[Setting.Direction]
          break
        }
      }

    return settings
  }

  getAccordionAnimation () {
    const { accordion } = this.meta
    if (!accordion) return null

    return {
      name: 'Smooth Expand/Collapse',
      settings: {
        [Setting.Overflow]: false,
        [Setting.Duration]: { from: 100, to: 2000 },
        [Setting.Easing]: true,
        defaults: accordion.defaults
      }
    }
  }
  getAccordion (data, type, options) {
    if (typeof data === 'string') {
      [type, options] = arguments
      data = this.animations[type]
    }

    options ??= {}

    const { accordion } = this.meta
    if (!accordion) return null

    const forceDisabled = data?.meta?.accordion === false
    const animation = this.getAccordionAnimation()
    const config = this.settings.accordion?.[type] ?? {}
    const defaults = () => this.buildDefaultSettings(animation, type)
    const settings = this.buildSettings(animation, type, config.settings, options)
    const context = buildContext(null, animation, type, settings)

    return {
      animate: accordion.create(type, context),
      forceDisabled,
      enabled: !forceDisabled && (config.enabled ?? true),
      setEnabled: forceDisabled ? null : enabled => this.updateAccordion(type, { enabled }),
      settings,
      setSettings: settings => this.updateAccordion(type, { settings }),
      defaults,
      context,
      onReset: () => this.updateAccordion(type, { settings: defaults() })
    }
  }
  getAccordions (options = {}) {
    const animation = this.getAccordionAnimation()
    if (!animation) return null

    return {
      animation,
      enter: this.getAccordion(AnimationType.Enter, options),
      exit: this.getAccordion(AnimationType.Exit, options)
    }
  }
  updateAccordion (type, values) {
    const config = this.settings.accordion ??= {}
    Object.assign(config[type] ??= {}, values)
    this.onSettingsChange()
  }
  buildOptions (data, type, options) {
    if (typeof data === 'string') {
      [type, options] = arguments
      data = this.animations[type]
    }

    const accordion = this.getAccordion(data, type, options)
    if (!accordion?.enabled) return {}

    const key = {
      [AnimationType.Enter]: 'before',
      [AnimationType.Exit]: 'after'
    }[type]

    return { [key]: accordion.animate }
  }
}
