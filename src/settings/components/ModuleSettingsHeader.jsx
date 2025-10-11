import { css } from '@style'
import useAnimationSettings from '@/settings/hooks/useAnimationSettings'
import AnimationType from '@enums/AnimationType'
import Config from '@/modules/Config'
import AnimationCard from '@/settings/components/animation/AnimationCard'
import Core from '@/modules/Core'
import {
  AlertTypes,
  Breadcrumbs,
  Clickable,
  Stack,
  Text,
  Tooltip
} from '@discord/modules'
import SectionContext from '@/settings/context/SectionContext'
import Messages from '@shared/messages'
import ArrowSmallRightIcon from '@/components/icons/ArrowSmallRightIcon'
import { use, useMemo } from 'react'
import DismissibleAlert from '@/settings/components/DismissibleAlert'
import useDismissible from '@/hooks/useDismissible'
import Documentation from '@shared/documentation'
import Hint from '@/settings/components/Hint'
import SwitchIndicator from '@/components/SwitchIndicator'

function ModuleSettingsHeader ({ module, enabled, setEnabled, selected, onSelect, ...props }) {
  const { setSection } = use(SectionContext)

  const parentModules = useMemo(() => Core.getParentModules(module), [module])
  const childModules = useMemo(() => Core.getChildModules(module), [module])
  const breadcrumbs = parentModules.concat(module).map(m => ({
    id: m.id,
    label: m.name
  }))

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

  const accordionHint = (
    <Hint
      className="BA__accordionHint"
      href={Documentation.accordionUrl}
    />
  )

  const accordions = module.getAccordions()
  const accordionsSettings = useAnimationSettings(module, accordions ? [
    {
      animation: accordions.animation,
      type: AnimationType.Enter,
      title: 'Smooth Expand',
      headerAfter: accordionHint,
      switchTooltip: accordions.enter.forceDisabled ? Messages.IMPLEMENTED_BY_ANIMATION(selected.enter.animation?.name) : null,
      ...accordions.enter
    },
    {
      animation: accordions.animation,
      type: AnimationType.Exit,
      title: 'Smooth Collapse',
      headerAfter: accordionHint,
      switchTooltip: accordions.exit.forceDisabled ? Messages.IMPLEMENTED_BY_ANIMATION(selected.exit.animation?.name) : null,
      ...accordions.exit
    }
  ] : [], { hideOverflow: true })

  const errors = [
    selected.enter.error,
    selected.exit.error
  ].filter(Boolean)

  const [alertDismissed, setAlertDismissed] = useDismissible(`moduleAlert:${module.id}`)

  return (
    <Stack gap={8}>
      {module.alert && !alertDismissed && (
        <DismissibleAlert
          messageType={AlertTypes.WARNING}
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
          accordionsSettings={accordionsSettings}
          active={false}
          header
          errors={errors}
        />
        <div className="BA__moduleSettingsHeading">
          <div className="BA__moduleSettingsTitle">
            <Breadcrumbs
              breadcrumbs={breadcrumbs}
              activeId={module.id}
              renderCustomBreadcrumb={({ label }, active) => (
                <Text
                  variant="heading-lg/semibold"
                  className={`BA__moduleSettingsBreadcrumb ${active ? 'BA__moduleSettingsBreadcrumb--active' : ''}`}
                >
                  {label}
                </Text>
              )}
              onBreadcrumbClick={({ id }) => setSection(id)}
            />
            <Tooltip text={`${enabled ? 'Disable' : 'Enable'} ${module.name} animations`} hideOnClick={false}>
              {props => (
                <div {...props}>
                  <SwitchIndicator checked={enabled} onChange={setEnabled} />
                </div>
              )}
            </Tooltip>
          </div>
          {module.description && (
            <Text variant="text-sm/normal">
              {typeof module.description === 'function' ? module.description(setSection) : module.description}
            </Text>
          )}
          {module.controls && (
            <div>
              {module.controls({ module })}
            </div>
          )}

          {childModules.map(m => (
            <Clickable tag="div" onClick={() => setSection(m.id)}>
              <Text
                key={m.id}
                variant="text-md/normal"
                className="BA__moduleSettingsLink"
              >
                {m.name} animations
                <ArrowSmallRightIcon size="xs" />
              </Text>
            </Clickable>
          ))}
        </div>
      </div>
    </Stack>
  )
}

export default ModuleSettingsHeader

css
`.BA__moduleSettingsHeader {
    display: flex;
    gap: 20px;
}
    
.BA__moduleSettingsHeader .BA__animationCardWrapper {
    flex-shrink: 0;
}

.BA__moduleSettingsHeading {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 0;
    flex-grow: 1;
}
    
.BA__moduleSettingsTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.BA__moduleSettingsBreadcrumb {
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
    margin-top: 8px;
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
}

.BA__accordionHint {
    margin: auto 0;
}`
`ModuleSettingsHeader`
