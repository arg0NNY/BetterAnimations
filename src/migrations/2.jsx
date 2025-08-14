import { configDefaults, packConfigDefaults } from '@data/config'
import PackManager from '@/modules/PackManager'
import { ModalActions, Text, TextButton } from '@discord/modules'
import Modal from '@/components/Modal'
import PackModal from '@/settings/components/pack/PackModal'
import { PackContentLocation } from '@/settings/components/pack/PackContent'
import PackRegistry from '@/modules/PackRegistry'
import Messages from '@shared/messages'
import { getMainConfig } from '@/migrations/utils'

const slug = 'olDays'

const modules = [
  ['guild', 'servers'],
  ['channel', 'channels'],
  ['settings', 'settings'],
  ['messages', 'messages'],
  ['popouts', 'popouts'],
  ['popouts', 'tooltips'],
  ['popouts', 'contextMenu']
]

const switchTypes = {
  slipUp: {
    key: 'containerSlip',
    direction: 'upwards'
  },
  slipDown: {
    key: 'containerSlip',
    direction: 'downwards'
  },
  slipLeft: {
    key: 'containerSlip',
    direction: 'leftwards'
  },
  slipRight: {
    key: 'containerSlip',
    direction: 'rightwards'
  },
  slideUp: {
    key: 'containerSlide',
    direction: 'upwards'
  },
  slideDown: {
    key: 'containerSlide',
    direction: 'downwards'
  },
  slideLeft: {
    key: 'containerSlide',
    direction: 'leftwards'
  },
  slideRight: {
    key: 'containerSlide',
    direction: 'rightwards'
  },
  flipForwards: {
    key: 'containerFlip',
    direction: 'forwards'
  },
  flipBackwards: {
    key: 'containerFlip',
    direction: 'backwards'
  },
  flipLeft: {
    key: 'containerFlip',
    direction: 'leftwards'
  },
  flipRight: {
    key: 'containerFlip',
    direction: 'rightwards'
  },
  scaleUp: {
    key: 'containerScale',
    direction: 'upwards'
  },
  scaleDown: {
    key: 'containerScale',
    direction: 'downwards'
  },
  scaleLeft: {
    key: 'containerScale',
    direction: 'leftwards'
  },
  scaleRight: {
    key: 'containerScale',
    direction: 'rightwards'
  },
  fade: {
    key: 'containerFade'
  },
  scaleForwards: {
    key: 'containerScale',
    direction: 'forwards'
  },
  scaleBackwards: {
    key: 'containerScale',
    direction: 'backwards'
  },
  scaleChange: {
    key: 'containerScaleChange'
  }
}

const revealTypes = {
  fade: {
    key: 'revealFade'
  },
  slip: {
    key: 'revealSlip',
    position: 'auto'
  },
  slipScale: {
    key: 'revealSlipScale',
    position: 'auto'
  },
  flip: {
    key: 'revealFlip',
    position: 'auto'
  },
  scaleForwards: {
    key: 'revealScale',
    position: 'center',
    direction: 'forwards'
  },
  scaleBackwards: {
    key: 'revealScale',
    position: 'center',
    direction: 'backwards'
  },
  scaleForwardsSide: {
    key: 'revealScale',
    position: 'auto',
    direction: 'forwards'
  },
  scaleBackwardsSide: {
    key: 'revealScale',
    position: 'auto',
    direction: 'backwards'
  },
  rotateForwardsLeft: {
    key: 'revealRotate',
    direction: 'forwards',
    variant: 'left'
  },
  rotateForwardsRight: {
    key: 'revealRotate',
    direction: 'forwards',
    variant: 'right'
  },
  rotateBackwardsLeft: {
    key: 'revealRotate',
    direction: 'backwards',
    variant: 'left'
  },
  rotateBackwardsRight: {
    key: 'revealRotate',
    direction: 'backwards',
    variant: 'right'
  }
}

function parseEasing (easing) {
  switch (easing) {
    case 'linear':
      return {
        type: 'linear'
      }
    case 'easeIn':
      return {
        type: 'ease',
        bezier: 'in',
        style: 'sine'
      }
    case 'easeOut':
      return {
        type: 'ease',
        bezier: 'out',
        style: 'sine'
      }
    case 'ease':
    case 'easeInOut':
      return {
        type: 'ease',
        bezier: 'inOut',
        style: 'sine'
      }
    default:
      const [, bezier, style] = easing
        .match(/^ease(In|Out|InOut)(Sine|Quad|Cubic|Quart|Quint|Expo|Circ|Back)$/)
        .map((i) => i.slice(0, 1).toLowerCase() + i.slice(1))

      switch (style) {
        case 'back':
          return {
            type: 'back',
            bezier,
            overshoot: 2.7
          }
        default:
          return {
            type: 'ease',
            bezier,
            style
          }
      }
  }
}

function parsePosition (position) {
  switch (position) {
    case 'bottom': return 'top'
    case 'top': return 'bottom'
    case 'right': return 'left'
    case 'left': return 'right'
  }
}

function generateMutations (config) {
  const data = structuredClone(configDefaults)
  const packData = structuredClone(packConfigDefaults)

  for (const [key, moduleKey] of modules) {
    if (!config[key]) continue

    const moduleData = data.modules[moduleKey]
    const { enabled, type, duration, easing, position } = config[key]
    const { key: animationKey, ...settings } = ['messages', 'popouts'].includes(key)
      ? revealTypes[type]
      : switchTypes[type]

    moduleData.enabled = enabled

    const pointer = {
      packSlug: slug,
      animationKey
    }
    moduleData.enter = pointer
    moduleData.exit = pointer

    settings.duration = duration
    settings.easing = parseEasing(easing)
    if (position) settings.position = parsePosition(position)
    packData.entries.push({
      animation: animationKey,
      module: moduleKey,
      enter: settings,
      exit: settings
    })
  }

  return [
    {
      version: 2,
      data
    },
    {
      slug,
      version: 2,
      data: packData
    }
  ]
}

function promptDownload () {
  return new Promise(resolve => {
    const showPackModal = () => ModalActions.openModal(props => (
      <PackModal
        {...props}
        filename={slug + PackManager.extension}
        location={PackContentLocation.CATALOG}
      />
    ), { onCloseCallback: () => PackRegistry.storage.clear() })

    ModalActions.openModal(props => (
      <Modal
        {...props}
        title={Messages.SETTINGS_MIGRATOR}
        confirmText="Install"
        confirmButtonVariant="primary"
        cancelText="Cancel"
        onConfirm={() => resolve(true)}
      >
        <Text variant="text-md/normal">
          <p>
            Animations from V1 are considered legacy and no longer come preinstalled with BetterAnimations.
          </p>
          <p>
            In order to successfully migrate your settings from V1 to V2
            pack <TextButton text="Ol' Days" onClick={showPackModal} /> will be installed.
            Proceed?
          </p>
        </Text>
      </Modal>
    ), { onCloseCallback: () => resolve(false) })
  })
}

async function downloadPack (signal) {
  if (PackManager.getPack(slug)) return true
  if (!await promptDownload()) return false

  const installed = await PackRegistry.install(slug + PackManager.extension, { signal })
  if (!installed) throw new Error(`Failed to install pack "${slug}"`)
  return true
}

export async function handler (configs, signal) {
  const config = getMainConfig(configs)
  if (!config) return []

  if (!await downloadPack(signal)) return false

  return generateMutations(config.data)
}
