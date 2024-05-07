import { Common } from '@/modules/DiscordModules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import SettingsPanel from '@/modules/settings/SettingsPanel'
import config from '@/config.json'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'
import Config from '@/modules/Config'

function SettingsModal ({ history, ...props }) {
  function onConfirm () {
    Config.save()
  }
  function onCancel () {
    Config.load()
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
