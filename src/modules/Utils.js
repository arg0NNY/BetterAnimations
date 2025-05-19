import Modules from '@/modules/Modules'
import AnimationType from '@/enums/AnimationType'
import { currentGuildChannels } from '@/patches/GuildChannelList/patchGuildChannelList'
import Logger from '@/modules/Logger'
import Config from '@/modules/Config'
import { guildChannelPath } from '@/patches/AppView/patchAppView'
import { injectSchemas, injectTypes } from '@animation/schemas/InjectableSchema'
import { safeInjects } from '@animation/schemas/ParsableAnimateSchema'

export default new class Utils {
  get name () { return 'Utils' }

  setAnimationForAllSupportedModules (packSlug, animationKey) {
    const modules = Modules.getAllModules(true)
      .filter(m => m.findAnimation(packSlug, animationKey))
    modules.forEach(m => AnimationType.values().forEach(t => m.setAnimation(t, packSlug, animationKey)))
    Config.save()
    Logger.log(
      this.name,
      `Set animation '${animationKey}' for the following modules:\n`
        + modules.map(m => `• ${m.name}`).join('\n')
    )
  }

  getCurrentGuildChannels () {
    return currentGuildChannels
  }

  getGuildChannelPath () {
    return guildChannelPath
  }

  Documentation = new class Documentation {
    buildInjectRefList (predicate = () => true) {
      return injectTypes
        .filter(type => predicate(injectSchemas[type], type))
        .map(type => `- <InjectRef inject="${type}" />`)
        .join('\n')
    }
    buildImmediateInjectRefList () {
      return this.buildInjectRefList(([, meta]) => !!meta.immediate)
    }
    buildLazyInjectRefList () {
      return this.buildInjectRefList(([, meta]) => meta.lazy)
    }
    buildSafeInjectRefList () {
      return this.buildInjectRefList((_, type) => safeInjects.includes(type))
    }
  }
}
