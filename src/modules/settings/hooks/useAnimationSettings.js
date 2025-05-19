import { useAdvancedMode } from '@/modules/settings/hooks/useMode'
import Setting from '@shared/enums/AnimationSetting'
import ModuleType from '@shared/enums/ModuleType'
import AnimationType from '@shared/enums/AnimationType'
import AnimationSettingContainer from '@shared/enums/AnimationSettingContainer'
import isEqual from 'lodash-es/isEqual'
import { pick } from '@utils/object'

function isSame (array, key) {
  return array.every(item => isEqual(item?.[key], array[0]?.[key]))
}

function canMerge (settings) {
  const _isSame = key => isSame(settings, key)

  if (!_isSame('type')) return false

  const base = _isSame('animation') && _isSame('value')
  switch (settings[0].type) {
    case Setting.Position: return base && _isSame('preserve')
    case Setting.Direction: return base && _isSame('axis') && _isSame('reverse') && _isSame('towards')
    default: return base
  }
}

function mergeFunctions (array) {
  return Object.fromEntries(
    Object.entries(array[0] ?? {}).filter(([, value]) => typeof value === 'function')
      .map(([key]) => [
        key,
        (...args) => array.forEach(item => item[key]?.(...args))
      ])
  )
}

function _useAnimationSettings (module, items, options = {}) {
  const { hideOverflow = false } = options
  const isAdvanced = useAdvancedMode()

  const sets = items.map(({ animation, settings, setSettings: _setSettings, defaults }) => {
    if (!animation) return []

    const setSettings = values => _setSettings({ ...settings, ...values })

    const buildSetting = (setting, props = {}) => {
      const value = settings[setting]
      const defaultValue = defaults()[setting]
      return {
        module,
        animation,
        type: setting,
        value,
        onChange: value => setSettings({ [setting]: value }),
        defaultValue,
        onReset: !isEqual(value, defaultValue) ? () => setSettings({ [setting]: defaults()[setting] }) : null,
        ...props
      }
    }

    return [
      animation.settings?.[Setting.Duration] && buildSetting(Setting.Duration),
      animation.settings?.[Setting.Variant] && buildSetting(Setting.Variant),
      animation.settings?.[Setting.Position] && (() => {
        const keys = [Setting.Position, Setting.PositionPreserve]
        const values = pick(settings, keys)
        const defaultValues = pick(defaults(), keys)
        return buildSetting(Setting.Position, {
          preserve: settings[Setting.PositionPreserve],
          onPreserveChange: value => setSettings({ [Setting.PositionPreserve]: value }),
          onReset: !isEqual(values, defaultValues) ? () => setSettings(defaultValues) : null
        })
      })(),
      animation.settings?.[Setting.Direction] && (() => {
        const keys = [Setting.Direction, Setting.DirectionAxis, Setting.DirectionReverse, Setting.DirectionTowards]
        const values = pick(settings, keys)
        const defaultValues = pick(defaults(), keys)
        return buildSetting(Setting.Direction, {
          axis: settings[Setting.DirectionAxis],
          onAxisChange: value => setSettings({ [Setting.DirectionAxis]: value }),
          reverse: settings[Setting.DirectionReverse],
          onReverseChange: value => setSettings({ [Setting.DirectionReverse]: value }),
          towards: settings[Setting.DirectionTowards],
          onTowardsChange: value => setSettings({ [Setting.DirectionTowards]: value }),
          onReset: !isEqual(values, defaultValues) ? () => setSettings(defaultValues) : null
        })
      })(),
      isAdvanced && animation.settings?.[Setting.Easing] && buildSetting(Setting.Easing),
      isAdvanced && !hideOverflow && !module.meta?.settings?.hideOverflow && buildSetting(Setting.Overflow, {
        forced: animation.settings?.[Setting.Overflow] === false
      })
    ].filter(Boolean)
  })

  if (!isSame(items, 'animation'))
    return [{
      type: AnimationSettingContainer.Group,
      children: sets.map(settings => ({
        type: AnimationSettingContainer.List,
        children: settings
      }))
    }]

  return Array(Math.max(...sets.map(s => s.length), 0)).fill(null).map((_, i) => {
    const settings = sets.map(s => s[i] ?? null)
    const shouldMerge = !isAdvanced && module.meta?.type === ModuleType.Switch && isSame(items, 'enabled') && canMerge(settings)

    if (!shouldMerge) return {
      type: AnimationSettingContainer.Group,
      children: settings
    }

    return {
      ...settings[0],
      defaultValue: isSame(settings, 'defaultValue') ? settings[0].defaultValue : null,
      ...mergeFunctions(settings)
    }
  })
}

function useAnimationSettingsHeaders (module, items, settings = _useAnimationSettings(module, items)) {
  const typeLabel = type => ({
    [AnimationType.Enter]: 'Enter',
    [AnimationType.Exit]: 'Exit'
  }[type])

  const headers = items.map(({
    animation,
    type,
    enabled,
    setEnabled,
    settings,
    defaults,
    onReset,
    title,
    subtitle,
    headerAfter,
    switchTooltip
  }) => ({
    key: type,
    title: title || typeLabel(type) || animation.name,
    subtitle: title && subtitle
      ? (subtitle === true ? typeLabel(type) : subtitle)
      : null,
    headerAfter,
    enabled,
    setEnabled,
    switchTooltip,
    onReset: onReset && !isEqual(settings, defaults()) ? onReset : null
  }))

  if (!settings.some(s => s.type === AnimationSettingContainer.Group)) return [{
    key: 'both',
    title: items[0]?.animation?.name || 'No animations selected',
    enabled: items.every(i => i.enabled),
    ...mergeFunctions(headers)
  }]

  return headers
}

function useAnimationSettings (module, items, options = {}) {
  const settings = _useAnimationSettings(module, items, options)
  return {
    headers: useAnimationSettingsHeaders(module, items, settings),
    settings
  }
}

export default useAnimationSettings
