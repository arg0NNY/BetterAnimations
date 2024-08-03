import PackManager from '@/modules/PackManager'
import modules from '@/data/modules'
import Auto from '@/enums/Auto'
import Setting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'
import { getAnchorDirection, getDirection, getDirectionsByAxis } from '@/helpers/direction'
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
import DirectionAutoType from '@/enums/DirectionAutoType'

class Module {
  constructor (id, name, meta = {}, { parent } = {}) {
    this.id = id
    this.name = name
    this.meta = meta
    this.parent = parent
    this.animations = {}
  }

  get settings () {
    return Config.current.modules[this.id] ??= {}
  }
  getSettings () { return this.settings }

  isEnabled (type = null) {
    if (!type) return this.settings.enabled ?? true

    return (this.settings.enabled ?? true)
      && (!!this.animations[type]?.animate || !!this.getModifier(type)?.enabled)
  }
  enable () { this.settings.enabled = true }
  disable () { this.settings.enabled = false }
  toggle () { this.settings.enabled = !this.settings.enabled }
  setIsEnabled (value) {
    this.settings.enabled = value
    Emitter.emit(Events.ModuleToggled, this.id, value)
  }

  get type () {
    return this.meta.type ?? ModuleType.Reveal
  }
  getType () { return this.type }

  findAnimation (packOrSlug, key) {
    const animation = PackManager.getAnimation(packOrSlug, key)
    return this.isSupportedBy(animation) ? animation : null
  }

  getAnimationSettings (pack, animation, type, options = {}) {
    return this.buildSettings(animation, type, Config.pack(pack.slug).getAnimationConfig(animation.key, this.id, type), options)
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
      id: [pointer.packSlug, pointer.animationKey].filter(Boolean).join('/') || null,
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
      animate = cachedAnimate && context && AnimateSchema(ctx, { stage: ParseStage.Layout })
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
    Emitter.emit(Events.ModuleSettingsChanged, this.id)
  }

  isSupportedBy (animation) {
    return animation.meta.modules.has(this.id)
  }

  supportsAuto (animation, setting) {
    const type = this.meta.settings?.supportsAuto?.[setting]
    if (!type || !animation.settings?.[setting]) return false
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
        switch (type) {
          case DirectionAutoType.Alternate:
            return [
              [Direction.Upwards, Direction.Downwards],
              [Direction.Leftwards, Direction.Rightwards],
              [Direction.Forwards, Direction.Backwards]
            ].some(
              pair => pair.every(v => animation.settings[setting]?.includes(v))
            )
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
          if (key === Setting.Overflow) return true
          if ([Setting.DirectionAxis, Setting.DirectionTowards].includes(key))
            key = Setting.Direction
          return key in (animation.settings ?? {})
        })
    )
  }
  buildDefaultSettings (animation, type, normalized = true) {
    const settings = Object.assign(
      { [Setting.Overflow]: true },
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

    if ('auto' in options) this.assignAutoValues(animation, type, settings, options.auto)

    return settings
  }

  normalizeSetting (animation, type, setting, value, allSettings = {}) {
    const animationDefaults = getAnimationDefaultSettings(animation, type)

    switch (setting) {
      case Setting.DirectionAxis: {
        if (allSettings[Setting.Direction] !== Auto()
          || this.meta.settings?.supportsAuto?.[Setting.Direction] !== DirectionAutoType.Alternate)
          return undefined

        const directions = animation.settings[Setting.Direction] ?? []
        if (directions === true) return value
        if (getDirectionsByAxis(value)?.every(d => directions.includes(d))) return value
        return [Axis.Y, Axis.Z, Axis.X].find(axis => getDirectionsByAxis(axis).every(d => directions.includes(d)))
      }
      case Setting.DirectionTowards: {
        if (allSettings[Setting.Direction] !== Auto()
          || this.meta.settings?.supportsAuto?.[Setting.Direction] !== DirectionAutoType.Anchor)
          return undefined
        return Boolean(value)
      }
      case Setting.Overflow: {
        if (animation.settings?.[setting] === false)
          return animationDefaults[setting]

        return value
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
        if (!keys.includes(value)) return animationDefaults[setting] ?? keys[0]
        return value
      }
      case Setting.Position:
      case Setting.Direction: {
        const values = animation.settings[setting]
        if (
          values === true
            || (value === Auto() && this.supportsAuto(animation, setting))
        ) return value
        if (!values.includes(value)) return animationDefaults[setting] ?? values[0]
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

  assignAutoValues (animation, type, normalizedSettings, values) {
    const settings = normalizedSettings
    const animationDefaults = getAnimationDefaultSettings(animation, type)

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
      switch (this.meta.settings.supportsAuto[Setting.Direction]) {
        case DirectionAutoType.Alternate:
          settings[Setting.Direction] = getDirection(settings[Setting.DirectionAxis], values.direction)
          break
        case DirectionAutoType.Anchor:
          settings[Setting.Direction] = values.position
            ? getAnchorDirection(values.position, settings[Setting.DirectionTowards])
            : animationDefaults[Setting.Direction]
          break
      }


    return settings
  }

  getModifierAnimation () {
    const { modifier } = this.meta
    if (!modifier) return null

    return {
      name: 'Smooth expand/collapse',
      settings: {
        [Setting.Overflow]: false,
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
      animate: modifier.create(type, settings),
      forceDisabled,
      enabled: !forceDisabled && (config.enabled ?? true),
      setEnabled: forceDisabled ? null : enabled => this.updateModifier(type, { enabled }),
      settings,
      setSettings: settings => this.updateModifier(type, { settings }),
      defaults: getAnimationDefaultSettings(animation, type),
      onReset: () => this.updateModifier(type, { settings: this.buildDefaultSettings(animation, type) })
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
    Emitter.emit(Events.ModuleSettingsChanged, this.id)
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
    this.modules = modules.map(({ id, name, meta, ...options }) => new Module(id, name, meta, options))

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

  getAllModules (includeNested = false) {
    return this.modules.filter(m => includeNested || !m.parent)
  }
  getModule (id) {
    return this.modules.find(m => m.id === id)
  }
  getParentModule (module) {
    return module.parent && this.getModule(module.parent)
  }
  getParentModules (module, _list = []) {
    const parent = this.getParentModule(module)
    if (!parent) return _list

    return this.getParentModules(parent, [parent, ..._list])
  }
  getChildModules (module) {
    return this.modules.filter(m => m.parent === module.id)
  }
}
