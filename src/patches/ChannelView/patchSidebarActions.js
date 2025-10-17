import Patcher from '@/modules/Patcher'
import { SidebarActions } from '@discord/modules'

/**
 * `SearchBar` fires `setSelectedSearchContext` that stores currently passed `searchContextId` when mounted,
 * and `null` when unmounted, meaning that Discord expects only one instance of `SearchBar` at a time.
 *
 * But since there can be two instances of `SearchBar` while switching servers/channels animation is running,
 * unmount of the old instance happens later than mount of the new one, overriding the `searchContextId` with `null`;
 * therefore, the search sidebar is always considered closed after the animation is finished.
 *
 * This patch makes it to simply ignore the `null` value, preventing it from overriding the actual `searchContextId`.
 * However, it causes the `searchContextId` to still exist even when there are no `SearchBar` instances,
 * but this shouldn't be a problem since if there are no `SearchBar` instances, then there are no `ChatSidebar` instances either,
 * which can display the search sidebar.
 *
 * Hopefully Discord will change this in the future so that this patch can be removed.
 */
function patchSidebarActions () {
  if (!SidebarActions) return
  Patcher.instead(SidebarActions, 'setSelectedSearchContext', (self, [id], original) => {
    if (id === null) return
    original(id)
  })
}

export default patchSidebarActions
