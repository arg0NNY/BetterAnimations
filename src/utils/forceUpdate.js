import { Dispatcher } from '@discord/modules'

export function forceAppUpdate () {
  Dispatcher.dispatch({ type: 'DOMAIN_MIGRATION_START' })
  requestIdleCallback(() => Dispatcher.dispatch({ type: 'DOMAIN_MIGRATION_SKIP' }))
}
