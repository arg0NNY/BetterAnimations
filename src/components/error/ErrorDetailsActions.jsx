import { Button, FormTitle, ModalActions, UserSettingsModal } from '@discord/modules'
import { css } from '@style'
import useModule from '@/hooks/useModule'
import Config from '@/modules/Config'
import Settings from '@/settings'
import classNames from 'classnames'
import InternalError from '@error/structs/InternalError'
import { memo } from 'react'
import useConfig from '@/hooks/useConfig'
import Messages from '@shared/messages'

function useSetting (error) {
  const { config, onChange } = useConfig()

  if (!(error instanceof InternalError)) return null

  switch (error.category) {
    case InternalError.Category.PRIORITIZE_ANIMATION_SMOOTHNESS:
      return {
        name: Messages.PRIORITIZE_ANIMATION_SMOOTHNESS,
        value: config.general.prioritizeAnimationSmoothness,
        setValue: value => {
          config.general.prioritizeAnimationSmoothness = value
          onChange()
        }
      }
    case InternalError.Category.CACHE_USER_SETTINGS_SECTIONS:
      return {
        name: Messages.CACHE_USER_SETTINGS_SECTIONS,
        value: config.general.cacheUserSettingsSections,
        setValue: value => {
          config.general.cacheUserSettingsSections = value
          onChange()
        }
      }
    default: return null
  }
}

function useActions (error) {
  const module = useModule(error.module?.id)
  const setting = useSetting(error)

  const actions = []

  if (error instanceof InternalError) {
    actions.push(
      <Button
        size={Button.Sizes.SMALL}
        onClick={() => {
          UserSettingsModal.open('updates')
          Settings.closeSettingsModal()
          ModalActions.closeAllModals()
        }}
      >
        Check for updates
      </Button>
    )

    if (setting) actions.push(
      <Button
        size={Button.Sizes.SMALL}
        color={Button.Colors.PRIMARY}
        disabled={!setting.value}
        onClick={() => {
          setting.setValue(false)
          Config.save()
        }}
      >
        {setting.value ? 'Disable' : 'Disabled'} {setting.name}
      </Button>
    )
  }
  else if (module && !Settings.isSettingsModalOpen()) actions.push(
    <Button
      size={Button.Sizes.SMALL}
      onClick={() => {
        Settings.openSettingsModal(module.id)
        ModalActions.closeAllModals()
      }}
    >
      Go to Settings
    </Button>
  )

  if (module) actions.push(
    <Button
      size={Button.Sizes.SMALL}
      color={Button.Colors.PRIMARY}
      disabled={!module.isEnabled()}
      onClick={() => {
        module.setIsEnabled(false)
        Config.save()
      }}
    >
      {module.isEnabled() ? 'Disable' : 'Disabled'} {error.module.name} animations
    </Button>
  )

  return actions
}

function ErrorDetailsActions ({ error, className }) {
  const actions = useActions(error)

  if (!actions.length) return null

  return (
    <>
      <FormTitle>Suggested actions</FormTitle>
      <div className={classNames('BA__errorDetailsActions', className)}>
        {actions}
      </div>
    </>
  )
}

export default memo(ErrorDetailsActions)

css
`.BA__errorDetailsActions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}`
`ErrorDetailsActions`