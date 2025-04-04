import { App, Button, Heading, ModalActions, Text } from '@/modules/DiscordModules'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import Enum from '@/enums/Enum'
import Data from '@/modules/Data'
import Modal from '@/components/Modal'

export default new class Prompt {
  Types = Enum({
    HardwareAcceleration: 'hardwareAcceleration'
  })

  get dataKey () { return 'prompts' }
  constructor () {
    this.state = Data[this.dataKey] ?? {}
  }

  saveState () {
    Data[this.dataKey] = this.state
  }

  onStartup () {
    this.showPrompt(this.Types.HardwareAcceleration)
  }

  hasShown (type) {
    return !!this.state[type]
  }
  setHasShown (type, value) {
    this.state[type] = value
    this.saveState()
  }

  _showPrompt (type) {
    switch (type) {
      case this.Types.HardwareAcceleration:
        return this.promptHardwareAccelerationIfNeeded()
    }
  }
  async showPrompt (type, force = false) {
    if (this.hasShown(type) && !force) return

    this.setHasShown(type, !!await Promise.resolve(this._showPrompt(type)))
  }

  promptHardwareAccelerationIfNeeded () {
    if (!App.getEnableHardwareAcceleration())
      return this.promptHardwareAcceleration()
  }
  promptHardwareAcceleration () {
    return new Promise(resolve =>
      ModalActions.openModal(props => (
        <Modal
          {...props}
          cancelText="Cancel"
          confirmText="Enable"
          confirmButtonColor={Button.Colors.RED}
          onCancel={() => resolve(true)}
          onConfirm={() => {
            resolve(false)
            App.setEnableHardwareAcceleration(true)
          }}
        >
          <Heading variant="heading-md/semibold" className={DiscordClasses.Margins.marginBottom8}>HARDWARE ACCELERATION IS DISABLED</Heading>
          <Text variant="text-sm/normal">The animations might be choppy, turn the Hardware Acceleration on to drastically improve the performance. Discord will quit and re-launch.</Text>
        </Modal>
      ))
    )
  }

}
