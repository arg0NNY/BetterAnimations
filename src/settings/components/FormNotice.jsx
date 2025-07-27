import { SettingsNotice } from '@discord/modules'
import Config from '@/modules/Config'
import { useCallback, Suspense, lazy } from 'react'
import { css } from '@style'

const SettingsNoticeComponent = lazy(async () => ({ default: await SettingsNotice }))

function FormNotice () {
  const onSave = useCallback(() => Config.save(), [])
  const onReset = useCallback(() => Config.load(), [])

  return (
    <div className="BA__formNotice">
      <Suspense>
        <SettingsNoticeComponent
          onSave={onSave}
          onReset={onReset}
        />
      </Suspense>
    </div>
  )
}

export default FormNotice

css
`.BA__formNotice > * {
    background-color: var(--background-base-lowest);
    border: none;
    box-shadow: 0 0 0 1px var(--border-subtle);
}`
`FormNotice`
