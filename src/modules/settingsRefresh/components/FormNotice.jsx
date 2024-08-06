import { React } from '@/BdApi'
import { SettingsNotice } from '@/modules/DiscordModules'
import Config from '@/modules/Config'

const SettingsNoticeComponent = React.lazy(async () => ({ default: await SettingsNotice }))

function FormNotice () {
  const onSave = React.useCallback(() => Config.save(), [])
  const onReset = React.useCallback(() => Config.load(), [])

  return (
    <React.Suspense>
      <div className="BA__settingsNotice">
        <SettingsNoticeComponent
          onSave={onSave}
          onReset={onReset}
        />
      </div>
    </React.Suspense>
  )
}

export default FormNotice
