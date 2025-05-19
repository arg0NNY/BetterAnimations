import BaseAnimationStore from '@shared/animation/store'
import Config from '@/modules/Config'

const AnimationStore = new class AnimationStore extends BaseAnimationStore {
  get switchCooldownDuration () { return Config.current.general.switchCooldownDuration }
}

export default AnimationStore
