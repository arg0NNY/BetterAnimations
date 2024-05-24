import PackManager from '@/modules/PackManager'
import modules from '@/data/modules'
import Auto from '@/enums/Auto'
import Setting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'
import { getDirection, getDirectionsByAxis } from '@/helpers/direction'
import Axis from '@/enums/Axis'
import { getPosition, reversePosition } from '@/helpers/position'
import Config from '@/modules/Config'
import { getAnimationDefaultSettings } from '@/helpers/animations'
import AnimationType from '@/enums/AnimationType'
import ModuleType from '@/enums/ModuleType'
import { buildContext } from '@/modules/animation/parser'
import ParseStage from '@/enums/ParseStage'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { AnimateSchema } from '@/modules/animation/schemas/AnimationSchema'
import Events from '@/enums/Events'
import Emitter from '@/modules/Emitter'
import Logger from '@/modules/Logger'

class Module {
  constructor (id, name, meta = {}) {
    this.id = id
    this.name = name
    this.meta = meta
  }

  get settings () {
    return Config.current.modules[this.id] ??= {}
  }
  getSettings () { return this.settings }

  isEnabled () {
    return this.settings.enabled ?? true
  }
  enable () { this.settings.enabled = true }
  disable () { this.settings.enabled = false }
  toggle () { this.settings.enabled = !this.settings.enabled }
  setIsEnabled (value) { this.settings.enabled = value }

  get type () {
    return this.meta.type ?? ModuleType.Reveal
  }
  getType () { return this.type }

  findAnimation (packOrSlug, key) {
    const animation = PackManager.getAnimation(packOrSlug, key)
    return this.isSupportedBy(animation) ? animation : null
  }

  initializeAnimation (type) {
    const pointer = this.settings[type] ?? {}
    const pack = pointer.packSlug && PackManager.getPack(pointer.packSlug)
    const animation = pack && this.findAnimation(pack, pointer.animationKey)
    const config = animation ? Config.pack(pack.slug).getAnimationConfig(animation.key, this.id, type) : {}

    const settings = animation && this.buildSettings(animation, type, config, { auto: false })
    let animate
    try {
      animate = animation && AnimateSchema(
        buildContext(animation, type, settings, { module: this }),
      { stage: ParseStage.Initialize }
      ).parse(animation[type] ?? animation.animate)
    }
    catch (e) {
      e = e instanceof z.ZodError ? fromZodError(e).message : e
      console.error(`Failed to initialize '${type}' animation:`, e)
    }

    return {
      packSlug: pointer.packSlug ?? null,
      animationKey: pointer.animationKey ?? null,
      pack,
      animation,
      config,
      animate
    }
  }
  initializeAnimations () {
    this.animations = {
      enter: this.initializeAnimation(AnimationType.Enter),
      exit: this.initializeAnimation(AnimationType.Exit)
    }
  }

  getAnimation (type, options = {}, context = null) {
    const { animation, config, animate: cachedAnimate } = this.animations[type]

    const settings = animation && this.buildSettings(animation, type, config, options)
    const ctx = buildContext(animation, type, settings, { module: this, ...context })

    let animate
    try {
      animate = cachedAnimate && context && AnimateSchema(ctx, { stage: ParseStage.Execute })
        .parse(cachedAnimate)
    }
    catch (e) {
      e = e instanceof z.ZodError ? fromZodError(e).message : e
      console.error(`Failed to parse '${type}' animation:`, e)
    }

    return {
      ...this.animations[type],
      settings,
      context: ctx,
      animate
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
  }

  isSupportedBy (animation) {
    return !animation.meta?.modules
      || (animation.meta.modules.has(this.id))
  }

  getGeneralSettings () {
    return this.settings.settings ?? {}
  }
  setGeneralSettings (settings) {
    this.settings.settings = settings
  }

  supportsAuto (animation, setting) {
    if (!this.meta.settings?.supportsAuto?.[setting] || !animation.settings?.[setting]) return false
    if (animation.settings[setting] === true) return true

    switch (setting) {
      case Setting.Position:
        return [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
          Position.Center
        ].every(v => animation.settings[setting].includes(v))
      case Setting.Direction:
        return [
          [Direction.Upwards, Direction.Downwards],
          [Direction.Leftwards, Direction.Rightwards],
          [Direction.Forwards, Direction.Backwards]
        ].some(
          pair => pair.every(v => animation.settings[setting]?.includes(v))
        )
      default: return false
    }
  }
  getAllSettingsSupportingAuto (animation) {
    return [
      Setting.Position,
      Setting.Direction
    ].filter(s => this.supportsAuto(animation, s))
  }

  buildModuleDefaultSettings (animation) {
    return Object.fromEntries(
      Object.entries(this.meta.settings?.defaults ?? {})
        .filter(([key]) => {
          if (key === Setting.DirectionAxis) key = Setting.Direction
          return key in (animation.settings ?? {})
        })
    )
  }
  buildDefaultSettings (animation, type, normalized = true) {
    const settings = Object.assign(
      {},
      getAnimationDefaultSettings(animation, type),
      this.buildModuleDefaultSettings(animation),
      Object.fromEntries(
        this.getAllSettingsSupportingAuto(animation).map(s => [s, Auto()])
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

    if ('auto' in options) this.assignAutoValues(animation, settings, options.auto)

    return settings
  }

  normalizeSetting (animation, type, setting, value, allSettings = {}) {
    switch (setting) {
      case Setting.DirectionAxis: {
        if (allSettings[Setting.Direction] !== Auto()) return undefined

        const directions = animation.settings[Setting.Direction] ?? []
        if (directions === true) return value
        if (getDirectionsByAxis(value)?.every(d => directions.includes(d))) return value
        return [Axis.Y, Axis.Z, Axis.X].find(axis => getDirectionsByAxis(axis).every(d => directions.includes(d)))
      }
    }

    if (animation.settings?.[setting] === undefined) return undefined

    switch (setting) {
      case Setting.Duration: {
        const { from, to } = animation.settings[setting]
        if (value > to) return to
        if (value < from) return from
        return value
      }
      case Setting.Variant: {
        const keys = animation.settings[setting].map(v => v.key)
        if (!keys.includes(value)) return getAnimationDefaultSettings(animation, type)[setting] ?? keys[0]
        return value
      }
      case Setting.Position:
      case Setting.Direction: {
        const values = animation.settings[setting]
        if (
          values === true
            || (value === Auto() && this.supportsAuto(animation, setting))
        ) return value
        if (!values.includes(value)) return getAnimationDefaultSettings(animation, type)[setting] ?? values[0]
        return value
      }
      default: return value
    }
  }
  normalizeSettings (animation, type, settings) {
    return Object.fromEntries(
      Object.entries(settings).map(([key, value]) => [key, this.normalizeSetting(animation, type, key, value, settings)])
        .filter(a => a[1] !== undefined)
    )
  }

  assignAutoValues (animation, normalizedSettings, values) {
    const settings = normalizedSettings

    if (values === false) {
      Object.keys(settings).forEach(key => settings[key] === Auto() && delete settings[key])
      return settings
    }

    if (settings[Setting.Position] === Auto()) {
      const position = reversePosition(values.position)
      const mergedPosition = getPosition(position, values.align)
      const supportedPositions = animation.settings[Setting.Position]

      settings[Setting.Position] = supportedPositions !== true && !supportedPositions.includes(mergedPosition)
        ? position
        : mergedPosition
    }

    if (settings[Setting.Direction] === Auto())
      settings[Setting.Direction] = getDirection(settings.directionAxis, values.direction)

    return settings
  }

  getModifierAnimation () {
    const { modifier } = this.meta
    if (!modifier) return null

    return {
      name: 'Smooth expand/collapse',
      settings: {
        [Setting.Duration]: { from: 100, to: 2000 },
        [Setting.Easing]: true,
        defaults: modifier.defaults
      }
    }
  }
  getModifier (type, options = {}) {
    const { modifier } = this.meta
    if (!modifier) return null

    const forceDisabled = !!this.animations[type]?.animation?.meta?.forceDisableInternalExpandCollapseAnimations
    const animation = this.getModifierAnimation()
    const config = this.settings.modifier?.[type] ?? {}
    const settings = this.buildSettings(animation, type, config.settings, options)

    return {
      enabled: !forceDisabled && (config.enabled ?? true),
      forceDisabled,
      animate: modifier.create(type, settings),
      defaults: getAnimationDefaultSettings(animation, type),
      settings
    }
  }
  getModifiers (options = {}) {
    const animation = this.getModifierAnimation()
    if (!animation) return null

    return {
      animation,
      enter: this.getModifier(AnimationType.Enter, options),
      exit: this.getModifier(AnimationType.Exit, options)
    }
  }
  updateModifier (type, values) {
    const config = this.settings.modifier ??= {}
    Object.assign(config[type] ??= {}, values)
  }
  buildOptions () {
    const options = {}
    const modifiers = this.getModifiers()
    if (modifiers?.enter?.enabled) options.before = modifiers.enter.animate
    if (modifiers?.exit?.enabled) options.after = modifiers.exit.animate
    return options
  }
}

export default new class Modules {
  get name () { return 'Core' }

  constructor () {
    this.modules = modules.map(m => new Module(m.id, m.name, m.meta))

    this.globalChangeEvents = [Events.PackLoaded, Events.PackUnloaded, Events.SettingsChanged]
    this.onGlobalChange = () => this.onChange()
    this.onModuleChange = id => this.onChange(id)
  }

  initialize () {
    this.modules.forEach(m => m.initializeAnimations())
    this.listenEvents()

    Logger.log(this.name, `Initialized ${this.modules.length} animation modules.`)
  }

  shutdown () {
    this.unlistenEvents()

    Logger.log(this.name, 'Shutdown.')
  }

  onChange (id = null) {
    if (!id) return this.modules.forEach(m => m.initializeAnimations())
    this.getModule(id)?.initializeAnimations()
  }
  listenEvents () {
    this.globalChangeEvents.forEach(e => Emitter.on(e, this.onGlobalChange))
    Emitter.on(Events.ModuleSettingsChanged, this.onModuleChange)
  }
  unlistenEvents () {
    this.globalChangeEvents.forEach(e => Emitter.off(e, this.onGlobalChange))
    Emitter.off(Events.ModuleSettingsChanged, this.onModuleChange)
  }

  getModule (id) {
    return this.modules.find(m => m.id === id)
  }
}
