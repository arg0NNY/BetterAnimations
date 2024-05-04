import { Common } from '@/modules/DiscordModules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import SettingsPanel from '@/modules/Settings/SettingsPanel'
import config from '@/config.json'
import { save } from '@/modules/SettingsStorage'

function SettingsModal ({ history, ...props }) {
  function onConfirm () {
    save()
  }
  function onCancel () {
    // TODO: Implement cancelling changes
  }

  return (
    <Common.ConfirmModal
      {...props}
      header={`${config.name} Settings`}
      cancelText="Cancel"
      confirmText="Save"
      confirmButtonColor={Common.Button.Colors.BRAND}
      className={DiscordClasses.Modal.large}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <SettingsPanel history={history} />
    </Common.ConfirmModal>
  )
}

export default SettingsModal
