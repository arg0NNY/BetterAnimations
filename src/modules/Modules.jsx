import BaseModule from '@animation/module'
import PackManager from '@/modules/PackManager'
import modules from '@data/modules'
import Config from '@/modules/Config'
import Events from '@enums/Events'
import Emitter from '@/modules/Emitter'
import Logger from '@logger'
import ModuleKey from '@enums/ModuleKey'
import ServerModuleControls from '@/components/ServerModuleControls'
import Messages from '@shared/messages'
import { forceAppUpdate } from '@/utils/forceUpdate'
import meta from '@/meta'
import { Anchor } from '@discord/modules'

class Module extends BaseModule {
  get settings () {
    return Config.current.modules[this.id] ??= {}
  }
  getPack (slug) {
    return PackManager.getPack(slug)
  }
  getAnimationConfig (pack, animation, type) {
    return Config.pack(pack.slug).getAnimationConfig(animation.key, this.id, type)
  }

  onToggle (value) {
    super.onToggle(value)
    Emitter.emit(Events.ModuleToggled, this.id, value)
  }
  onSettingsChange () {
    super.onSettingsChange()
    Emitter.emit(Events.ModuleSettingsChanged, this.id)
  }
}

const moduleOptions = {
  [ModuleKey.Servers]: {
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between servers and&nbsp;other full-screen pages, such as DMs and Discover.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;elements in&nbsp;the&nbsp;server list.
      </>
    ),
    controls: ServerModuleControls,
    alert: Messages.HEAVY_MODULE_ALERT,
    onToggle: forceAppUpdate
  },
  [ModuleKey.Channels]: {
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between channels and other pages sharing the&nbsp;same sidebar.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;elements in&nbsp;the&nbsp;sidebar.
      </>
    ),
    alert: Messages.HEAVY_MODULE_ALERT
  },
  [ModuleKey.Settings]: {
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between sections of&nbsp;the&nbsp;settings.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;order of&nbsp;sections in&nbsp;the&nbsp;navigation sidebar.
      </>
    )
  },
  [ModuleKey.Layers]: {
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between full-screen views of&nbsp;the&nbsp;Discord&nbsp;app, such as User&nbsp;Settings, Server&nbsp;Settings, {meta.name} Settings, etc.
        Supports auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;user’s navigation history across layered views.
      </>
    )
  },
  [ModuleKey.Tooltips]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;informative floating UI elements application-wide,
        such as various control descriptions, server titles in&nbsp;the&nbsp;server list and other non-interactive elements that provide clarity to&nbsp;Discord's interfaces.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;anchor element.
      </>
    )
  },
  [ModuleKey.Popouts]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;interactive floating UI elements application-wide, such as User Profiles, Select Inputs, Pinned Messages, etc.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;anchor element.
        Context Menus that have a&nbsp;strictly defined anchor element are&nbsp;controlled by&nbsp;this&nbsp;module.
      </>
    )
  },
  [ModuleKey.ContextMenu]: {
    description: setSection => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;context menu that is activated by&nbsp;right-clicking on&nbsp;various UI elements.
        Supports auto-position and auto-direction for&nbsp;applicable animations determined by&nbsp;the&nbsp;location of&nbsp;the&nbsp;pointer.
        Context Menus that have a&nbsp;strictly defined anchor element, with the exception of&nbsp;context submenus, are controlled by&nbsp;<Anchor onClick={() => setSection(ModuleKey.Popouts)}>Popouts</Anchor>.
      </>
    )
  },
  [ModuleKey.Messages]: {
    description: () => (
      <>
        Animates the&nbsp;appearance of&nbsp;new messages and the&nbsp;disappearance of&nbsp;deleted messages and other UI elements in&nbsp;the&nbsp;chat.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during dynamic content updates.
      </>
    )
  },
  [ModuleKey.ChannelList]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;channels in&nbsp;the&nbsp;channel list triggered by&nbsp;switching categories,
        creating or deleting a&nbsp;channel, and other actions that change the contents of&nbsp;the&nbsp;channel list.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during dynamic content updates.
      </>
    )
  },
  [ModuleKey.Modals]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;full-screen modal windows.
      </>
    )
  },
  [ModuleKey.ModalsBackdrop]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;a&nbsp;dimming overlay behind modal windows.
        Backdrop animations can alter the&nbsp;static styles of&nbsp;the&nbsp;backdrop.
      </>
    )
  },
  [ModuleKey.MembersSidebar]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;sidebars inside the&nbsp;chat area, such as Member List, Message Search Results, etc.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during the&nbsp;switch.
      </>
    )
  },
  [ModuleKey.ThreadSidebar]: {
    description: () => (
      <>
        Animates the&nbsp;appearance and disappearance of&nbsp;full-screen sidebars, such as Thread Chat, Forum Post Chat, etc.
        Supports smooth expand and collapse transitions to&nbsp;prevent abrupt layout shifts during the&nbsp;switch.
      </>
    )
  },
  [ModuleKey.ThreadSidebarSwitch]: {
    description: () => (
      <>
        Animates the&nbsp;transitions when switching between full-screen sidebars, such as between threads or forum posts.
      </>
    )
  }
}

export default new class Modules {
  get name () { return 'Core' }

  constructor () {
    this.modules = modules.map(
      options => new Module({
        ...options,
        ...moduleOptions[options.id]
      })
    )

    this.globalChangeEvents = [Events.PackLoaded, Events.PackUnloaded, Events.SettingsChanged]
    this.onGlobalChange = () => this.onChange()
    this.onModuleChange = id => this.onChange(id)
  }

  initialize () {
    this.modules.forEach(m => m.initializeAnimations())
    this.listenEvents()

    Logger.log(this.name, `Initialized ${this.modules.length} animation modules.`)
  }

  shutdown () {
    this.unlistenEvents()

    Logger.log(this.name, 'Shutdown.')
  }

  onChange (id = null) {
    if (!id) return this.modules.forEach(m => m.initializeAnimations())
    this.getModule(id)?.initializeAnimations()
  }
  listenEvents () {
    this.globalChangeEvents.forEach(e => Emitter.on(e, this.onGlobalChange))
    Emitter.on(Events.ModuleSettingsChanged, this.onModuleChange)
  }
  unlistenEvents () {
    this.globalChangeEvents.forEach(e => Emitter.off(e, this.onGlobalChange))
    Emitter.off(Events.ModuleSettingsChanged, this.onModuleChange)
  }

  getAllModules (includeNested = false) {
    return this.modules.filter(m => includeNested || !m.parent)
  }
  getModule (id) {
    return this.modules.find(m => m.id === id)
  }
  getParentModule (module) {
    return module.parent && this.getModule(module.parent)
  }
  getParentModules (module, _list = []) {
    const parent = this.getParentModule(module)
    if (!parent) return _list

    return this.getParentModules(parent, [parent, ..._list])
  }
  getChildModules (module) {
    return this.modules.filter(m => m.parent === module.id)
  }
}
