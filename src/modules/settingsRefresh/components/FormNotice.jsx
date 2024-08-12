import { React } from '@/BdApi'
import { SettingsNotice } from '@/modules/DiscordModules'
import Config from '@/modules/Config'

const SettingsNoticeComponent = React.lazy(async () => ({ default: await SettingsNotice }))

function FormNotice () {
  const onSave = React.useCallback(() => Config.save(), [])
  const onReset = React.useCallback(() => Config.load(), [])

  return (
    <React.Suspense>
      <SettingsNoticeComponent
        onSave={onSave}
        onReset={onReset}
      />
    </React.Suspense>
  )
}

export default FormNotice
