import { forceAppUpdate } from '@/utils/forceUpdate'
import { Checkbox, Flex, handleClick, Text } from '@discord/modules'
import IconButton from '@/modules/settings/components/IconButton'
import DiscordClasses from '@discord/classes'
import CircleQuestionIcon from '@/modules/settings/components/icons/CircleQuestionIcon'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Documentation from '@shared/documentation'

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
          onClick={() => handleClick({ href: Documentation.enhanceLayoutUrl })}
        >
          <CircleQuestionIcon size="xs" color="currentColor" />
        </IconButton>
      </Flex>
    </Checkbox>
  )
}

export default ServerModuleControls
