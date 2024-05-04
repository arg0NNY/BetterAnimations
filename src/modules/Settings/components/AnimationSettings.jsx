import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import { range } from '@/helpers/general'
import easings from '@/data/easings'
import ModuleContext from '@/modules/Settings/context/ModuleContext'
import positions from '@/data/positions'
import Auto from '@/enums/Auto'
import directions from '@/data/directions'
import directionAxes from '@/data/directionAxes'
import Direction from '@/enums/Direction'
import AnimationSetting from '@/enums/AnimationSetting'
import { getDirectionsByAxis } from '@/helpers/direction'

function DurationSetting ({ options, value, onChange, ...props }) {
  const { to, from } = options
  const dense = to - from <= 2000

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Duration</Common.FormTitle>
      <Common.Slider
        {...props}
        minValue={from}
        maxValue={to}
        markers={range(from, to, dense ? 50 : 100)}
        onMarkerRender={v => v % (dense ? 100 : 500) === 0 || [to, from].includes(v) ? (v / 1000).toFixed(1) + 's' : ''}
        stickToMarkers={true}
        initialValue={value}
        onValueChange={onChange}
      />
    </Common.FormItem>
  )
}

function EasingSetting ({ value, onChange, defaultValue }) {
  const options = easings.map(e => ({ label: e, value: e }))

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Easing</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Common.FormItem>
  )
}

function VariantSetting ({ options, value, onChange, defaultValue }) {
  options = options.map(o => ({ label: o.name, value: o.key }))

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Variant</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Common.FormItem>
  )
}

function PositionSetting ({ animation, value, onChange, defaultValue }) {
  const module = React.useContext(ModuleContext)

  const options = positions.filter(
    p => p.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Position)
      : (animation.settings.position === true || animation.settings.position.includes(p.value))
  )

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Position</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
    </Common.FormItem>
  )
}

function DirectionSetting ({ animation, value, onChange, axis, onAxisChange, defaultValue }) {
  const module = React.useContext(ModuleContext)

  const options = directions.filter(
    d => d.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Direction)
      : (animation.settings.direction === true || animation.settings.direction.includes(d.value))
  )

  const axisOptions = directionAxes.filter(
    a => animation.settings.direction === true
      || getDirectionsByAxis(a.value).every(d => animation.settings.direction.includes(d))
  )

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">Direction</Common.FormTitle>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
      {value === Auto(Direction).Auto && (
        <div style={{ marginTop: 10 }}>
          <Common.RadioGroup
            options={axisOptions}
            value={axis}
            onChange={option => onAxisChange(option.value)}
          />
        </div>
      )}
    </Common.FormItem>
  )
}

export default function AnimationSettings ({ animation, settings, onChange }) {
  const setSettings = values => onChange(Object.assign({}, settings, values))

  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
      {animation.settings.duration && (
        <DurationSetting
          options={animation.settings.duration}
          value={settings.duration}
          onChange={duration => setSettings({ duration })}
          defaultValue={animation.settings.defaults.duration}
        />
      )}
      {animation.settings.easing && (
        <EasingSetting
          value={settings.easing}
          onChange={easing => setSettings({ easing })}
          defaultValue={animation.settings.defaults.easing}
        />
      )}
      {animation.settings.variant && (
        <VariantSetting
          options={animation.settings.variant}
          value={settings.variant}
          onChange={variant => setSettings({ variant })}
          defaultValue={animation.settings.defaults.variant}
        />
      )}
      {animation.settings.position && (
        <PositionSetting
          animation={animation}
          value={settings.position}
          onChange={position => setSettings({ position })}
          defaultValue={animation.settings.defaults.position}
        />
      )}
      {animation.settings.direction && (
        <DirectionSetting
          animation={animation}
          value={settings.direction}
          onChange={direction => setSettings({ direction })}
          defaultValue={animation.settings.defaults.direction}
          axis={settings.directionAxis}
          onAxisChange={axis => setSettings({ directionAxis: axis })}
        />
      )}
    </div>
  )
}
