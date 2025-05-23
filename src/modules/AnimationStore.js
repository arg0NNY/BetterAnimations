import { AnimationStore as BaseAnimationStore } from '@shared/animation/store'
import Config from '@/modules/Config'

export class AnimationStore extends BaseAnimationStore {
  get switchCooldownDuration () { return Config.current.general.switchCooldownDuration }
}

export default new AnimationStore
