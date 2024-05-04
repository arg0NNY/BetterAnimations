import { Common } from '@/modules/DiscordModules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import SettingsPanel from '@/modules/Settings/SettingsPanel'
import config from '@/config.json'
import { load, save } from '@/modules/SettingsStorage'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'

function SettingsModal ({ history, ...props }) {
  function onConfirm () {
    save()
  }
  function onCancel () {
    load()
    Emitter.emit(Events.SettingsChanged)
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
