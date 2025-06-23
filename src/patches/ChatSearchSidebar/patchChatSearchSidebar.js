import Patcher from '@/modules/Patcher'
import { ChatSearchSidebarKeyed } from '@discord/modules'
import findInReactTree, { byClassName } from '@/utils/findInReactTree'
import ensureOnce from '@utils/ensureOnce'

function patchChatSearchSidebar () {
  const once = ensureOnce()
  const cachedScrolls = new Map()

  Patcher.after(...ChatSearchSidebarKeyed, (self, args, value) => {
    Patcher.after(value, 'type', (self, args, value) => {
      once(() => {
        Patcher.after(value.type.prototype, 'componentDidMount', (self) => {
          self.scrollerRef.current?.scrollTo({ to: cachedScrolls.get(self.props.searchAnalyticsId) ?? 0 })
        })
        Patcher.after(value.type.prototype, 'render', (self, args, value) => {
          const scroller = findInReactTree(value, byClassName('scroller'))
          if (scroller) scroller.props.onScroll =
            () => cachedScrolls.set(self.props.searchAnalyticsId, self.scrollerRef.current?.getDistanceFromTop() ?? 0)
        })
      })
    })
  })
}

export default patchChatSearchSidebar
