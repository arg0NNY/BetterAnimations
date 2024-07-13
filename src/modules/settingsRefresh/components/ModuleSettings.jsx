import { Common } from '@/modules/DiscordModules'

function ModuleSettings ({ module }) {
  return (
    <div>
      <Common.FormTitle tag="h2">{module.name}</Common.FormTitle>
    </div>
  )
}

export default ModuleSettings
