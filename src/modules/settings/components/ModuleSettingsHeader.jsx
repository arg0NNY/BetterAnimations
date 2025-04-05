import { css } from '@/modules/Style'
import useAnimationSettings from '@/modules/settings/hooks/useAnimationSettings'
import AnimationType from '@/enums/AnimationType'
import Config from '@/modules/Config'
import AnimationCard from '@/modules/settings/components/AnimationCard'
import Modules from '@/modules/Modules'
import {
  AlertTypes,
  Breadcrumbs,
  Clickable,
  FormText,
  FormTitle,
  Switch,
  Tooltip
} from '@/modules/DiscordModules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import SectionContext from '@/modules/settings/context/SectionContext'
import Messages from '@/modules/Messages'
import ArrowSmallRightIcon from '@/modules/settings/components/icons/ArrowSmallRightIcon'
import { useContext, useMemo } from 'react'
import DismissibleAlert from '@/modules/settings/components/DismissibleAlert'
import useDismissible from '@/modules/settings/hooks/useDismissible'

function ModuleSettingsHeader ({ module, enabled, setEnabled, selected, onSelect, ...props }) {
  const { setSection } = useContext(SectionContext)

  const parentModules = useMemo(() => Modules.getParentModules(module), [module])
  const childModules = useMemo(() => Modules.getChildModules(module), [module])
  const breadcrumbs = parentModules.concat(module).map(m => ({
    id: m.id,
    label: m.name
  }))

  const toggleSwitch = <Switch checked={enabled} onChange={setEnabled} />

  const handleSetSettings = (pack, animation, type) => value => Config.pack(pack.slug).setAnimationConfig(animation.key, module.id, type, value)

  const defaultSettings = (animation, type) => module.buildDefaultSettings(animation, type)
  const handleResetSettings = (pack, animation, type) => {
    const setSettings = handleSetSettings(pack, animation, type)
    return () => setSettings(defaultSettings(animation, type))
  }

  const setEnterEnabled = selected.enter.animation ? value => !value && onSelect(AnimationType.Enter, null, null) : null
  const setExitEnabled = selected.exit.animation ? value => !value && onSelect(AnimationType.Exit, null, null) : null

  const animationSettings = useAnimationSettings(module, [
    {
      animation: selected.enter.animation,
      type: AnimationType.Enter,
      title: selected.enter.animation?.name,
      subtitle: true,
      settings: selected.enter.animation && module.getAnimationSettings(selected.enter.pack, selected.enter.animation, AnimationType.Enter),
      setSettings: selected.enter.animation && handleSetSettings(selected.enter.pack, selected.enter.animation, AnimationType.Enter),
      enabled: !!selected.enter.animation,
      setEnabled: setEnterEnabled,
      context: selected.enter.context,
      switchTooltip: !selected.enter.animation ? Messages.SELECT_ANIMATION_TO_ENABLE : null,
      defaults: () => defaultSettings(selected.enter.animation, AnimationType.Enter),
      onReset: selected.enter.animation && handleResetSettings(selected.enter.pack, selected.enter.animation, AnimationType.Enter)
    },
    {
      animation: selected.exit.animation,
      type: AnimationType.Exit,
      title: selected.exit.animation?.name,
      subtitle: true,
      settings: selected.exit.animation && module.getAnimationSettings(selected.exit.pack, selected.exit.animation, AnimationType.Exit),
      setSettings: selected.exit.animation && handleSetSettings(selected.exit.pack, selected.exit.animation, AnimationType.Exit),
      enabled: !!selected.exit.animation,
      setEnabled: setExitEnabled,
      context: selected.exit.context,
      switchTooltip: !selected.exit.animation ? Messages.SELECT_ANIMATION_TO_ENABLE : null,
      defaults: () => defaultSettings(selected.exit.animation, AnimationType.Exit),
      onReset: selected.exit.animation && handleResetSettings(selected.exit.pack, selected.exit.animation, AnimationType.Exit)
    }
  ])

  const modifiers = module.getModifiers()
  const modifiersSettings = useAnimationSettings(module, modifiers ? [
    {
      animation: modifiers.animation,
      type: AnimationType.Enter,
      title: 'Smooth Expand',
      switchTooltip: modifiers.enter.forceDisabled ? Messages.FORCE_DISABLED_BY_ANIMATION(selected.enter.animation?.name) : null,
      ...modifiers.enter
    },
    {
      animation: modifiers.animation,
      type: AnimationType.Exit,
      title: 'Smooth Collapse',
      switchTooltip: modifiers.exit.forceDisabled ? Messages.FORCE_DISABLED_BY_ANIMATION(selected.exit.animation?.name) : null,
      ...modifiers.exit
    }
  ] : [], { hideOverflow: true })

  const errors = [
    selected.enter.error,
    selected.exit.error
  ].filter(Boolean)

  const [alertDismissed, setAlertDismissed] = useDismissible(`moduleAlert:${module.id}`)

  return (
    <>
      {module.alert && !alertDismissed && (
        <DismissibleAlert
          messageType={AlertTypes.WARNING}
          className={DiscordClasses.Margins.marginBottom8}
          onDismiss={() => setAlertDismissed(true)}
        >
          {module.alert}
        </DismissibleAlert>
      )}
      <div className="BA__moduleSettingsHeader">
        <AnimationCard
          {...props}
          enter={!!selected.enter.animation}
          exit={!!selected.exit.animation}
          setEnter={setEnterEnabled}
          setExit={setExitEnabled}
          animationSettings={animationSettings}
          modifiersSettings={modifiersSettings}
          active={false}
          previewAlwaysActive
          wide
          errors={errors}
        />
        <div className="BA__moduleSettingsHeading">
          <div className="BA__moduleSettingsTitle">
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              activeId={module.id}
              renderCustomBreadcrumb={({ label }, active) => (
                <FormTitle
                  tag="h1"
                  className={`BA__moduleSettingsBreadcrumb ${active ? 'BA__moduleSettingsBreadcrumb--active' : ''}`}
                >{label}</FormTitle>
              )}
              onBreadcrumbClick={({ id }) => setSection(id)}
            />
            <Tooltip text={`${enabled ? 'Disable' : 'Enable'} ${module.name} animations`} hideOnClick={false}>
              {props => <div {...props}>{toggleSwitch}</div>}
            </Tooltip>
          </div>
          {module.description && (
            <FormText type={FormText.Types.DESCRIPTION} className={DiscordClasses.Margins.marginTop8}>
              {typeof module.description === 'function' ? module.description(setSection) : module.description}
            </FormText>
          )}
          {module.controls && (
            <div className={DiscordClasses.Margins.marginTop8}>
              {module.controls({ module })}
            </div>
          )}

          {childModules.map(m => (
            <Clickable tag="div" onClick={() => setSection(m.id)}>
              <FormTitle
                key={m.id}
                tag="label"
                className="BA__moduleSettingsLink"
              >
                {m.name} animations
                <ArrowSmallRightIcon size="xs" />
              </FormTitle>
            </Clickable>
          ))}
        </div>
      </div>
    </>
  )
}

export default ModuleSettingsHeader

css
`.BA__moduleSettingsHeader {
    margin-bottom: 32px;
    display: flex;
    gap: 16px;
}
    
.BA__moduleSettingsHeader .BA__animationCardWrapper {
    flex-shrink: 0;
}

.BA__moduleSettingsHeading {
    padding: 12px 0;
    flex-grow: 1;
}
    
.BA__moduleSettingsTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.BA__moduleSettingsBreadcrumb {
    margin-bottom: 0;
    color: var(--header-muted);
}
.BA__moduleSettingsBreadcrumb:not(.BA__moduleSettingsBreadcrumb--active) {
    cursor: pointer;
}
.BA__moduleSettingsBreadcrumb:hover,
.BA__moduleSettingsBreadcrumb.BA__moduleSettingsBreadcrumb--active {
    color: var(--header-primary);
}

.BA__moduleSettingsLink {
    display: flex;
    align-items: center;
    gap: 2px;
    color: var(--header-secondary);
    margin-top: 16px;
    cursor: pointer;
}
.BA__moduleSettingsLink:hover {
    text-decoration: underline;
}
.BA__moduleSettingsLink svg {
    transition: transform .2s;
}
.BA__moduleSettingsLink:hover svg {
    transform: translateX(4px);
}`
`ModuleSettingsHeader`
