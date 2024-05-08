import { LocaleStore, Dispatcher, updateTheme, ThemeStore } from '@/modules/DiscordModules'

export function forceAppUpdate () {
  const locale = LocaleStore.getLocale()
  Dispatcher.dispatch({ type: 'I18N_LOAD_START', locale })
  setTimeout(() => {
    Dispatcher.dispatch({ type: 'I18N_LOAD_SUCCESS', locale })
    updateTheme(ThemeStore.theme)
  })
}
