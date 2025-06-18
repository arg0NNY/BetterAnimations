import { Button, FormTitle, ModalActions, UserSettingsModal } from '@discord/modules'
import { css } from '@style'
import useModule from '@/hooks/useModule'
import Config from '@/modules/Config'
import Settings from '@/modules/Settings'
import classNames from 'classnames'
import InternalError from '@error/structs/InternalError'

function ErrorDetailsActions ({ error, className }) {
  const module = useModule(error.module?.id)

  const actions = [
    error instanceof InternalError && (
      <Button
        size={Button.Sizes.SMALL}
        onClick={() => {
          UserSettingsModal.open('updates')
          ModalActions.closeAllModals()
        }}
      >
        Check for updates
      </Button>
    ),
    !(error instanceof InternalError) && module && !Settings.isSettingsModalOpen() && (
      <Button
        size={Button.Sizes.SMALL}
        onClick={() => {
          Settings.openSettingsModal(module.id)
          ModalActions.closeAllModals()
        }}
      >
        Go to Settings
      </Button>
    ),
    module && (
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
  ].filter(Boolean)

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

export default ErrorDetailsActions

css
`.BA__errorDetailsActions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}`
`ErrorDetailsActions`