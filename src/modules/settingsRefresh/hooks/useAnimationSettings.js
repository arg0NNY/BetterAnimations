import { useAdvancedMode } from '@/modules/settingsRefresh/hooks/useMode'
import Setting from '@/enums/AnimationSetting'
import { getAnimationDefaultSettings } from '@/helpers/animations'
import ModuleType from '@/enums/ModuleType'
import AnimationType from '@/enums/AnimationType'

function isSame (array, key) {
  return array.every(item => item?.[key] === array[0]?.[key])
}

function canMerge (settings) {
  const _isSame = key => isSame(settings, key)

  if (!_isSame('type')) return false

  const base = _isSame('animation') && _isSame('value')
  switch (settings[0].type) {
    case Setting.Direction: return base && _isSame('axis') && _isSame('towards')
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

function _useAnimationSettings (module, items) {
  const isAdvanced = useAdvancedMode()

  const sets = items.map(({ animation, type, settings, setSettings: _setSettings }) => {
    const defaults = getAnimationDefaultSettings(animation, type)
    const setSettings = values => _setSettings({ ...settings, ...values })

    const buildSetting = (setting, props = {}) => ({
      module,
      animation,
      type: setting,
      value: settings[setting],
      defaultValue: defaults[setting],
      onChange: value => setSettings({ [setting]: value }),
      ...props
    })

    return [
      animation.settings?.[Setting.Duration] && buildSetting(Setting.Duration),
      isAdvanced && animation.settings?.[Setting.Easing] && buildSetting(Setting.Easing),
      animation.settings?.[Setting.Variant] && buildSetting(Setting.Variant),
      animation.settings?.[Setting.Position] && buildSetting(Setting.Position),
      animation.settings?.[Setting.Direction] && buildSetting(Setting.Direction, {
        axis: settings[Setting.DirectionAxis],
        onAxisChange: value => setSettings({ [Setting.DirectionAxis]: value }),
        towards: settings[Setting.DirectionTowards],
        onTowardsChange: value => setSettings({ [Setting.DirectionTowards]: value })
      }),
      isAdvanced && !module.meta?.settings?.hideOverflow && buildSetting(Setting.Overflow, {
        forced: animation.settings?.[Setting.Overflow] === false
      })
    ].filter(Boolean)
  })

  return Array(Math.max(...sets.map(s => s.length))).fill(null).map((_, i) => {
    const settings = sets.map(s => s[i] ?? null)
    const shouldMerge = !isAdvanced && module.meta?.type === ModuleType.Switch && isSame(items, 'enabled') && canMerge(settings)

    if (!shouldMerge) return {
      type: Setting.Group,
      children: settings
    }

    return {
      ...settings[0],
      defaultValue: isSame(settings, 'defaultValue') ? settings[0].defaultValue : null,
      ...mergeFunctions(settings)
    }
  })
}

function useAnimationSettingsHeaders (module, items, settings) {
  const headers = items.map(({ animation, type, enabled, setEnabled, onReset }) => ({
    title: {
      [AnimationType.Enter]: 'Enter',
      [AnimationType.Exit]: 'Exit'
    }[type] || animation.name,
    enabled,
    setEnabled,
    onReset
  }))

  if (!settings.some(s => s.type === Setting.Group)) return [{
    title: items[0]?.animation?.name || 'Animation Settings',
    enabled: items.every(i => i.enabled),
    ...mergeFunctions(headers)
  }]

  return headers
}

function useAnimationSettings (module, items) {
  const settings = _useAnimationSettings(module, items)
  return {
    headers: useAnimationSettingsHeaders(module, items, settings),
    settings
  }
}

export default useAnimationSettings
