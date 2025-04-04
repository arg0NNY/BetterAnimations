import { colors, SingleSelect, Slider, Text, TextInput, Tooltip } from '@/modules/DiscordModules'
import { useEffect, useMemo, useState } from 'react'
import { css } from '@/modules/Style'
import { easingBeziers, easingStyles, easingTypes, easingValues } from '@/data/easings'
import { EasingType } from '@/enums/Easing'
import { prevent } from '@/modules/settingsRefresh/utils/eventModifiers'
import CircleWarningIcon from '@/modules/settingsRefresh/components/icons/CircleWarningIcon'
import SettingControl from '@/modules/settingsRefresh/components/controls/SettingControl'

function EasingField ({ label, children }) {
  return (
    <div className="BA__easingField">
      <Text
        className="BA__easingFieldLabel"
        variant="text-xs/medium"
        color="text-muted"
      >
        {label}
      </Text>
      <div className="BA__easingFieldControl">
        {children}
      </div>
    </div>
  )
}

function EasingValueSlider ({ options, value, onChange, ...props }) {
  const {
    min,
    max,
    default: defaultValue,
    fractionDigits = 0
  } = options

  const [draftValue, setDraftValue] = useState(value.toFixed(fractionDigits))
  useEffect(() => setDraftValue(value.toFixed(fractionDigits)), [value])

  function onSubmit () {
    let value = Number(parseFloat(draftValue).toFixed(fractionDigits))
    value = Math.max(min, Math.min(max, !isNaN(value) ? value : defaultValue))
    onChange(value)
    setDraftValue(value.toFixed(fractionDigits))
  }

  return (
    <div className="BA__easingValueSliderWrapper">
      <Slider
        className="BA__easingValueSlider"
        minValue={min}
        maxValue={max}
        onValueRender={value => value.toFixed(fractionDigits)}
        initialValue={value}
        onValueChange={value => onChange(Number(value.toFixed(fractionDigits)))}
        {...props}
      />
      <form
        className="BA__easingValueSliderInput"
        onSubmit={prevent(onSubmit)}
      >
        <TextInput
          size={TextInput.Sizes.MINI}
          value={draftValue}
          onChange={setDraftValue}
          onBlur={onSubmit}
        />
      </form>
    </div>
  )
}

function buildEasingValueSliders (type, items, { easing }) {
  return items.map(([key, label]) => (
    <EasingField label={label}>
      <EasingValueSlider
        options={easingValues[type][key]}
        value={easing[key]}
        onChange={value => easing[key] = value}
      />
    </EasingField>
  ))
}

function EasingEaseControl ({ easing }) {
  return (
    <>
      <EasingField label="Bezier">
        <SingleSelect
          options={easingBeziers}
          value={easing.bezier}
          onChange={bezier => easing.bezier = bezier}
        />
      </EasingField>
      <EasingField label="Style">
        <SingleSelect
          options={easingStyles}
          value={easing.style}
          onChange={style => easing.style = style}
        />
      </EasingField>
    </>
  )
}

function EasingSpringControl ({ easing }) {
  return (
    <>
      {buildEasingValueSliders(EasingType.Spring, [
        ['mass', 'Mass'],
        ['stiffness', 'Stiffness'],
        ['damping', 'Damping'],
        ['velocity', 'Velocity']
      ], { easing })}
    </>
  )
}

function EasingElasticControl ({ easing }) {
  return (
    <>
      <EasingField label="Bezier">
        <SingleSelect
          options={easingBeziers}
          value={easing.bezier}
          onChange={bezier => easing.bezier = bezier}
        />
      </EasingField>
      {buildEasingValueSliders(EasingType.Elastic, [
        ['amplitude', 'Amplitude'],
        ['period', 'Period']
      ], { easing })}
    </>
  )
}

function EasingStepsControl ({ easing }) {
  return (
    <EasingField label="Amount">
      <EasingValueSlider
        options={easingValues[EasingType.Steps]['amount']}
        value={easing.amount}
        onChange={amount => easing.amount = Math.round(amount)}
      />
    </EasingField>
  )
}

function EasingControl ({ value, onChange, exceedsDuration = 0, onReset }) {
  const easing = useMemo(() => new Proxy(value, {
    set (obj, key, value) {
      onChange({ ...obj, [key]: value })
      return true
    }
  }), [value, onChange])

  const AdditionalControl = useMemo(
    () => ({
      [EasingType.Ease]: EasingEaseControl,
      [EasingType.Spring]: EasingSpringControl,
      [EasingType.Elastic]: EasingElasticControl,
      [EasingType.Steps]: EasingStepsControl
    })[easing.type] ?? null,
    [easing.type]
  )

  const afterLabel = exceedsDuration !== 0 && (
    <Tooltip text={`The resulting animation duration is ${exceedsDuration > 0 ? 'above' : 'below'} the limit`}>
      {props => <CircleWarningIcon size="xs" color={colors.STATUS_DANGER} {...props} />}
    </Tooltip>
  )

  return (
    <SettingControl label="Easing" afterLabel={afterLabel} onReset={onReset}>
      <SingleSelect
        options={easingTypes}
        value={easing.type}
        onChange={type => onChange({ type })}
      />
      {AdditionalControl && (
        <AdditionalControl easing={easing} />
      )}
    </SettingControl>
  )
}

export default EasingControl

css
`.BA__easingField {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
}
.BA__easingFieldLabel {
    text-transform: uppercase;
    flex-shrink: 0;
    width: 70px;
}
.BA__easingFieldControl {
    flex-grow: 1;
}

.BA__easingValueSliderWrapper {
    display: flex;
    align-items: center;
    gap: 8px;
}
.BA__easingValueSlider {
    flex-grow: 1;
}
.BA__easingValueSliderInput {
    width: 60px;
    flex-shrink: 0;
}`
`EasingControl`