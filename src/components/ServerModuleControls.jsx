import { Checkbox, Stack, Text } from '@discord/modules'
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
        Emitter.emit(Events.ModuleSettingsChanged, module.id)
      }}
    >
      <Stack direction="horizontal" gap={8}>
        <Text variant="text-sm/normal">Enhance layout</Text>
        <Hint href={Documentation.enhanceLayoutUrl} />
      </Stack>
    </Checkbox>
  )
}

export default ServerModuleControls
