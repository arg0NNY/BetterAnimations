import { SingleSelect, Text, TextInput } from '@/modules/DiscordModules'
import { useEffect, useMemo, useState } from 'react'
import { css } from '@style'
import { easingBeziers, easingStyles, easingTypes, easingValues } from '@/data/easings'
import { EasingType } from '@enums/Easing'
import { prevent } from '@/modules/settings/utils/eventModifiers'
import SettingControl from '@/modules/settings/components/controls/SettingControl'
import Slider from '@/components/Slider'
import Documentation from '@shared/documentation'

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
        value={value}
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

function EasingBezierSelect ({ value, onChange }) {
  return (
    <EasingField label="Bezier">
      <SingleSelect
        options={easingBeziers}
        value={value}
        onChange={onChange}
      />
    </EasingField>
  )
}

function EasingEaseControl ({ easing }) {
  return (
    <>
      <EasingBezierSelect
        value={easing.bezier}
        onChange={bezier => easing.bezier = bezier}
      />
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

function EasingBackControl ({ easing }) {
  return (
    <>
      <EasingBezierSelect
        value={easing.bezier}
        onChange={bezier => easing.bezier = bezier}
      />
      {buildEasingValueSliders(EasingType.Back, [
        ['overshoot', 'Overshoot']
      ], { easing })}
    </>
  )
}

function EasingElasticControl ({ easing }) {
  return (
    <>
      <EasingBezierSelect
        value={easing.bezier}
        onChange={bezier => easing.bezier = bezier}
      />
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

function EasingControl ({ value, onChange, onReset }) {
  const easing = useMemo(() => new Proxy(value, {
    set (obj, key, value) {
      onChange({ ...obj, [key]: value })
      return true
    }
  }), [value, onChange])

  const AdditionalControl = useMemo(
    () => ({
      [EasingType.Ease]: EasingEaseControl,
      [EasingType.Back]: EasingBackControl,
      [EasingType.Elastic]: EasingElasticControl,
      [EasingType.Steps]: EasingStepsControl
    })[easing.type] ?? null,
    [easing.type]
  )

  return (
    <SettingControl label="Easing" doc={Documentation.Setting.Easing} onReset={onReset}>
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