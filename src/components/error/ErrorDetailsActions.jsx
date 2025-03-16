import { React, Utils } from '@/BdApi'
import { Button, FormTitle, ModalActions } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import useModule from '@/hooks/useModule'
import Config from '@/modules/Config'
import Settings from '@/modules/Settings'

function ErrorDetailsActions ({ error, className }) {
  const module = useModule(error.module?.id, true)

  const actions = [
    module && !Settings.isSettingsModalOpen() && (
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
      <FormTitle>Helpful actions</FormTitle>
      <div className={Utils.className('BA__errorDetailsActions', className)}>
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