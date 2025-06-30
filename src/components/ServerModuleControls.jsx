import { forceAppUpdate } from '@/utils/forceUpdate'
import { Checkbox, Flex, Text } from '@discord/modules'
import DiscordClasses from '@discord/classes'
import Emitter from '@/modules/Emitter'
import Events from '@enums/Events'
import Documentation from '@shared/documentation'
import Hint from '@/settings/components/Hint'

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
        <Hint
          className={DiscordClasses.Margins.marginLeft8}
          href={Documentation.enhanceLayoutUrl}
        />
      </Flex>
    </Checkbox>
  )
}

export default ServerModuleControls
