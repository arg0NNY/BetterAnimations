import Patcher from '@/modules/Patcher'
import { ChatSearchSidebarKeyed } from '@/modules/DiscordModules'
import findInReactTree from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'

const once = ensureOnce()

function patchChatSearchSidebar () {
  let cachedScrolls = new Map()

  Patcher.after(...ChatSearchSidebarKeyed, (self, args, value) => {
    once(() => {
      Patcher.after(value.type.prototype, 'componentDidMount', (self) => {
        self.scrollerRef.current?.scrollTo({ to: cachedScrolls.get(self.props.searchAnalyticsId) ?? 0 })
      })
      Patcher.after(value.type.prototype, 'render', (self, args, value) => {
        const scroller = findInReactTree(value, e => e?.className?.includes('scroller'))
        if (scroller) scroller.onScroll =
          () => cachedScrolls.set(self.props.searchAnalyticsId, self.scrollerRef.current?.getDistanceFromTop() ?? 0)
      })
    })
  })
}

export default patchChatSearchSidebar
