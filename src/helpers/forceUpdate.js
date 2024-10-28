import { Dispatcher } from '@/modules/DiscordModules'

export function forceAppUpdate () {
  Dispatcher.dispatch({ type: 'DOMAIN_MIGRATION_START' })
  setTimeout(() => Dispatcher.dispatch({ type: 'DOMAIN_MIGRATION_SKIP' }))
}
