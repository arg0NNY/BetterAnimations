import Patcher from '@/modules/Patcher'
import {
  Anchor,
  AppPanels,
  Button,
  ButtonGroup,
  handleClick,
  openModal,
  Text,
  useIsModalAtTop
} from '@discord/modules'
import ModuleKey from '@enums/ModuleKey'
import useModule from '@/hooks/useModule'
import useWindow from '@/hooks/useWindow'
import Modal from '@/components/Modal'
import { useEffect, useState } from 'react'
import Documentation from '@shared/documentation'
import { Themes } from '@/BdApi'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import useDismissible, { isDismissed } from '@/hooks/useDismissible'
import Config from '@/modules/Config'
import { css } from '@style'
import classNames from 'classnames'

function getDismissibleKey (theme) {
  return `userPanelMisplacedAlert:${theme.id}`
}

export function UserPanelMisplacedAlertModal ({ theme, setEnhanceLayout, onClose, ...props }) {
  const themeName = theme.name ?? theme.id
  const [isDismissed, setIsDismissed] = useDismissible(getDismissibleKey(theme))

  useEffect(() => {
    if (isDismissed) onClose()
  }, [isDismissed])

  return (
    <Modal
      {...props}
      onClose={onClose}
      footer={false}
    >
      <Text variant="text-md/normal">
        <p>
          User Panel appears to be misplaced.
        </p>
        <p>
          This may be due to the <Anchor onClick={() => handleClick({ href: Documentation.enhanceLayoutUrl })}><b>Enhance layout</b></Anchor> option
          of Servers animations being incompatible with the custom theme <b>{themeName}</b> you have enabled.
        </p>
        <p>
          <ButtonGroup
            direction="vertical"
            fullWidth
          >
            <Button
              text={<>Disable <b>Enhance layout</b></>}
              onClick={() => {
                setEnhanceLayout(false)
                onClose()
              }}
            />
            <Button
              text={<>Disable <b>{themeName}</b></>}
              onClick={() => {
                Themes.disable(theme.id)
                onClose()
              }}
            />
            <Button
              variant="secondary"
              text="How can I make them compatible?"
              onClick={() => handleClick({ href: Documentation.themeCompatibilityUrl })}
            />
          </ButtonGroup>
        </p>
      </Text>
      <Text variant="text-sm/normal" color="text-muted">
        <Anchor onClick={() => setIsDismissed(true)}>Hide this notification</Anchor> if you believe that
        it has been shown to&nbsp;you by&nbsp;mistake.
      </Text>
    </Modal>
  )
}
UserPanelMisplacedAlertModal.key = 'BA__userPanelMisplacedAlert'

function patchAppPanels () {
  Patcher.after(ModuleKey.Servers, AppPanels, 'type', (self, args, value) => {
    const [isCooldown, setIsCooldown] = useState(false)
    const isModalShown = useIsModalAtTop(UserPanelMisplacedAlertModal.key)

    const { isMainWindow } = useWindow()
    const module = useModule(ModuleKey.Servers, true)
    if (!isMainWindow || !module.isEnabled() || !module.settings.enhanceLayout) return

    if (isModalShown) value.props.className = classNames(value.props.className, 'BA__appPanelsHighlight')

    value.props.onMouseEnter = event => {
      if (isCooldown) return

      const { x, y, width } = event.currentTarget.getBoundingClientRect()
      const isValid = y >= window.innerHeight / 2 && x + width <= window.innerWidth / 2 // Is within the bottom left quarter of the window
      if (isValid) return

      const theme = Themes.getAll().find(theme => Themes.isEnabled(theme.id) && !isDismissed(getDismissibleKey(theme)))
      if (!theme) return

      openModal(props => (
        <UserPanelMisplacedAlertModal
          {...props}
          theme={theme}
          setEnhanceLayout={value => {
            module.settings.enhanceLayout = value
            Emitter.emit(Events.ModuleSettingsChanged, module.id)
            Config.save()
          }}
        />
      ), {
        modalKey: UserPanelMisplacedAlertModal.key,
        onCloseCallback: () => {
          setIsCooldown(true)
          setTimeout(() => setIsCooldown(false), 30000)
        }
      })
    }
  })
}

export default patchAppPanels

css
`.BA__appPanelsHighlight {
    z-index: 10000 !important;
}
.BA__appPanelsHighlight > * {
    pointer-events: none !important;
}`
`AppPanels`
