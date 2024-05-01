import { settings } from '@/modules/SettingsStorage'
import PackManager from '@/modules/PackManager'
import modules from '@/data/modules'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import Position from '@/enums/Position'
import Direction from '@/enums/Direction'

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

  getAnimation (type) {
    const config = this.settings[type] ?? {}
    const pack = config.packSlug && PackManager.getPack(config.packSlug)
    const animation = pack && PackManager.getAnimation(pack, config.animationKey)

    const settings = animation ? Object.assign(
      this.buildDefaultSettings(animation),
      config.settings ?? {}
    ) : {}

    return {
      packSlug: config.packSlug ?? null,
      animationKey: config.animationKey ?? null,
      settings,
      pack,
      animation
    }
  }
  getAnimations () {
    return {
      enter: this.getAnimation('enter'),
      exit: this.getAnimation('exit')
    }
  }
  setAnimation (type, packSlug, animationKey, settings = {}) {
    this.settings[type] = { packSlug, animationKey, settings }
  }
  setAnimationSettings (type, settings) {
    this.settings[type].settings = settings
  }

  supportsAutoPosition (animation) {
    if (!this.meta.settings?.supportsAuto?.[AnimationSetting.Position]) return false

    return animation.settings[AnimationSetting.Position] === true
      || [
        Position.Top,
        Position.Bottom,
        Position.Left,
        Position.Right,
        Position.Center
      ].every(v => animation.settings[AnimationSetting.Position].includes(v))
  }
  supportsAutoDirection (animation) {
    if (!this.meta.settings?.supportsAuto?.[AnimationSetting.Direction]) return false

    return animation.settings[AnimationSetting.Direction] === true
      || [
        [Direction.Upwards, Direction.Downwards],
        [Direction.Leftwards, Direction.Rightwards],
        [Direction.Forwards, Direction.Backwards]
      ].some(
        pair => pair.every(v => animation.settings[AnimationSetting.Direction]?.includes(v))
      )
  }
  getAllSettingsSupportingAuto (animation) {
    return [
      [AnimationSetting.Position, this.supportsAutoPosition(animation)],
      [AnimationSetting.Direction, this.supportsAutoDirection(animation)]
    ].filter(a => a[1]).map(a => a[0])
  }

  buildModuleDefaultSettings (animation) {
    return Object.fromEntries(
      Object.entries(this.meta.settings?.defaults ?? {})
        .filter(([key]) => {
          if (key === AnimationSetting.DirectionAxis) key = AnimationSetting.Direction
          // TODO: CHECK IF ANIMATION SUPPORTS MODULE'S DEFAULT VALUE

          return key in (animation.settings ?? {})
        })
    )
  }
  buildDefaultSettings (animation) {
    return Object.assign(
      {},
      animation?.settings?.defaults ?? {},
      this.buildModuleDefaultSettings(animation),
      Object.fromEntries(
        this.getAllSettingsSupportingAuto(animation).map(s => [s, Auto()])
      )
    )
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
