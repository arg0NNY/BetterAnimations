import { settings } from '@/modules/SettingsStorage'
import PackManager from '@/modules/PackManager'
import modules from '@/data/modules'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'
import { getDirection, getDirectionsByAxis } from '@/helpers/direction'
import Axis from '@/enums/Axis'

class Module {
  constructor (id, name, meta = {}) {
    this.id = id
    this.name = name
    this.meta = meta
  }

  get settings () {
    if (!settings.modules[this.id]) settings.modules[this.id] = {}
    return settings.modules[this.id]
  }
  getSettings () { return this.settings }

  isEnabled () {
    return this.settings.enabled ?? true
  }
  enable () { this.settings.enabled = true }
  disable () { this.settings.enabled = false }
  toggle () { this.settings.enabled = !this.settings.enabled }
  setIsEnabled (value) { this.settings.enabled = value }

  getAnimation (type, options = {}) {
    const config = this.settings[type] ?? {}
    const pack = config.packSlug && PackManager.getPack(config.packSlug)
    const animation = pack && PackManager.getAnimation(pack, config.animationKey)

    const settings = animation ? this.normalizeSettings(
      animation,
      Object.assign(
        this.buildDefaultSettings(animation, false),
        config.settings ?? {}
      )
    ) : {}

    if (options.auto) this.assignAutoValues(animation, settings, options.auto)

    return {
      packSlug: config.packSlug ?? null,
      animationKey: config.animationKey ?? null,
      settings,
      pack,
      animation
    }
  }
  getAnimations (options = {}) {
    return {
      enter: this.getAnimation('enter', options),
      exit: this.getAnimation('exit', options)
    }
  }
  setAnimation (type, packSlug, animationKey, settings = {}) {
    this.settings[type] = { packSlug, animationKey, settings }
  }
  // TODO: Move animation settings to separate config file for pack
  setAnimationSettings (type, settings) {
    this.settings[type].settings = settings
  }

  supportsAuto (animation, setting) {
    if (!this.meta.settings?.supportsAuto?.[setting] || !animation.settings?.[setting]) return false
    if (animation.settings[setting] === true) return true

    switch (setting) {
      case AnimationSetting.Position:
        return [
          Position.Top,
          Position.Bottom,
          Position.Left,
          Position.Right,
          Position.Center
        ].every(v => animation.settings[setting].includes(v))
      case AnimationSetting.Direction:
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
      AnimationSetting.Position,
      AnimationSetting.Direction
    ].filter(s => this.supportsAuto(animation, s))
  }

  buildModuleDefaultSettings (animation) {
    return Object.fromEntries(
      Object.entries(this.meta.settings?.defaults ?? {})
        .filter(([key]) => {
          if (key === AnimationSetting.DirectionAxis) key = AnimationSetting.Direction
          return key in (animation.settings ?? {})
        })
    )
  }
  buildDefaultSettings (animation, normalized = true) {
    const settings = Object.assign(
      {},
      animation?.settings?.defaults ?? {},
      this.buildModuleDefaultSettings(animation),
      Object.fromEntries(
        this.getAllSettingsSupportingAuto(animation).map(s => [s, Auto()])
      )
    )

    return normalized ? this.normalizeSettings(animation, settings) : settings
  }

  normalizeSetting (animation, setting, value, allSettings = {}) {
    switch (setting) {
      case AnimationSetting.DirectionAxis: {
        if (allSettings[AnimationSetting.Direction] !== Auto()) return undefined

        const directions = animation.settings[AnimationSetting.Direction] ?? []
        if (directions === true) return value
        if (getDirectionsByAxis(value)?.every(d => directions.includes(d))) return value
        return [Axis.Y, Axis.Z, Axis.X].find(axis => getDirectionsByAxis(axis).every(d => directions.includes(d)))
      }
    }

    if (animation.settings?.[setting] === undefined) return undefined

    switch (setting) {
      case AnimationSetting.Duration: {
        const { from, to } = animation.settings[setting]
        if (value > to) return to
        if (value < from) return from
        return value
      }
      case AnimationSetting.Variant: {
        const keys = animation.settings[setting].map(v => v.key)
        if (!keys.includes(value)) return animation.settings.defaults?.[setting] ?? keys[0]
        return value
      }
      case AnimationSetting.Position:
      case AnimationSetting.Direction: {
        const values = animation.settings[setting]
        if (
          values === true
            || (value === Auto() && this.supportsAuto(animation, setting))
        ) return value
        if (!values.includes(value)) return animation.settings.defaults?.[setting] ?? values[0]
        return value
      }
      default: return value
    }
  }
  normalizeSettings (animation, settings) {
    return Object.fromEntries(
      Object.entries(settings).map(([key, value]) => [key, this.normalizeSetting(animation, key, value, settings)])
        .filter(a => a[1] !== undefined)
    )
  }

  assignAutoValues (animation, normalizedSettings, values) {
    const settings = normalizedSettings

    if (settings[AnimationSetting.Direction] === Auto()) {
      settings[AnimationSetting.Direction] = getDirection(settings.directionAxis, values.direction)
    }

    return settings
  }
}

export default new class Modules {
  constructor () {
    this.modules = modules.map(m => new Module(m.id, m.name, m.meta))
  }

  getModule (id) {
    return this.modules.find(m => m.id === id)
  }
}
