import { LocaleStore, Dispatcher } from '@/modules/DiscordModules'

function forceAppUpdate (reason = null) {
  const locale = LocaleStore.getLocale()
  Dispatcher.dispatch({ type: 'I18N_LOAD_START', locale })
  setTimeout(() => Dispatcher.dispatch({ type: 'I18N_LOAD_SUCCESS', locale }))
}

export default forceAppUpdate
