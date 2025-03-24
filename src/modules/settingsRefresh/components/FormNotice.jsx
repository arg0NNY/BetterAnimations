import { SettingsNotice } from '@/modules/DiscordModules'
import Config from '@/modules/Config'
import { useCallback, Suspense, lazy } from 'react'

const SettingsNoticeComponent = lazy(async () => ({ default: await SettingsNotice }))

function FormNotice () {
  const onSave = useCallback(() => Config.save(), [])
  const onReset = useCallback(() => Config.load(), [])

  return (
    <Suspense>
      <SettingsNoticeComponent
        onSave={onSave}
        onReset={onReset}
      />
    </Suspense>
  )
}

export default FormNotice
