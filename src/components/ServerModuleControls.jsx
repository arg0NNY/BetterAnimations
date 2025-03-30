import { forceAppUpdate } from '@/utils/forceUpdate'
import { Alert, AlertTypes, Checkbox, Flex, ModalActions, ModalSize, Text } from '@/modules/DiscordModules'
import IconButton from '@/modules/settingsRefresh/components/IconButton'
import { DiscordClasses } from '@/modules/DiscordSelectors'
import CircleQuestionIcon from '@/modules/settingsRefresh/components/icons/CircleQuestionIcon'
import Modal from '@/components/Modal'
import meta from '@/meta'
import Emitter from '@/modules/Emitter'
import Events from '@/enums/Events'

// TODO: Add preview of the animation when this option is disabled and enabled
function EnhanceLayoutModal ({ module, ...props }) {
  return (
    <Modal
      title="Enhance layout"
      size={ModalSize.MEDIUM}
      confirmText="Got it"
      {...props}
    >
      <Text variant="text-md/normal">
        Discord’s default layout is&nbsp;poorly compatible with&nbsp;server-switching animations, forcing {meta.name} to&nbsp;animate unrelated areas
        (Server List and User Panel) with&nbsp;huge performance losses.
        This&nbsp;option restructures Discord’s layout to&nbsp;isolate animations to&nbsp;only the&nbsp;server area with&nbsp;no&nbsp;visual changes.
        However, it may clash with&nbsp;other plugins or&nbsp;themes you have enabled. Try disabling this&nbsp;option if&nbsp;you encounter conflicts.
      </Text>
      <Alert messageType={AlertTypes.INFO} className={DiscordClasses.Margins.marginTop8}>
        When this option is&nbsp;disabled {meta.name} will still apply minor layout tweaks (required for&nbsp;animations to&nbsp;function).
        Consider disabling {module.name} animations entirely if&nbsp;the&nbsp;conflict persists.
      </Alert>
    </Modal>
  )
}

function ServerModuleControls ({ module }) {
  return (
    <Checkbox
      value={module.settings.enhanceLayout}
      onChange={(_, value) => {
        module.settings.enhanceLayout = value
        if (module.isEnabled()) forceAppUpdate()
        else Emitter.emit(Events.ModuleSettingsChanged, module.id)
      }}
    >
      <Flex>
        <Text variant="text-sm/normal">Enhance layout</Text>
        <IconButton
          className={DiscordClasses.Margins.marginLeft8}
          tooltip="Learn more"
          onClick={() => ModalActions.openModal(
            props => <EnhanceLayoutModal module={module} {...props} />
          )}
        >
          <CircleQuestionIcon size="xs" color="currentColor" />
        </IconButton>
      </Flex>
    </Checkbox>
  )
}

export default ServerModuleControls
