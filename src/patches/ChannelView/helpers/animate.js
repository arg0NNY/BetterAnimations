import anime from 'animejs'
import Modules from '@/modules/Modules'
import ModuleKey from '@/enums/ModuleKey'

const animate = (type, node, width = node.clientWidth) => {
  const { duration, easing } = Modules.getModule(ModuleKey.Sidebars).getGeneralSettings()

  return anime({
    targets: node,
    marginRight: type === 'after' ? -width : [-width, 0],
    duration,
    easing,
    complete: type === 'after' ? undefined : () => node.style.removeProperty('margin-right')
  })
}

export default animate
