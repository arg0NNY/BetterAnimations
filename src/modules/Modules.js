import { settings } from '@/modules/SettingsStorage'
import PackManager from '@/modules/PackManager'
import modules from '@/data/modules'
import Auto from '@/enums/Auto'
import Setting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'
import { getDirection, getDirectionsByAxis } from '@/helpers/direction'
import Axis from '@/enums/Axis'
import { getPosition, reversePosition } from '@/helpers/position'

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
        if (!keys.includes(value)) return animation.settings.defaults?.[setting] ?? keys[0]
        return value
      }
      case Setting.Position:
      case Setting.Direction: {
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
}

export default new class Modules {
  constructor () {
    this.modules = modules.map(m => new Module(m.id, m.name, m.meta))
  }

  getModule (id) {
    return this.modules.find(m => m.id === id)
  }
}
