import { React } from '@/BdApi'
import ButtonGroup from '@/modules/settingsRefresh/components/ButtonGroup'
import { Common } from '@/modules/DiscordModules'
import { stop } from '@/modules/settingsRefresh/helpers/stopPropagation'

function AnimationToggleControl ({ enter, exit, setEnter, setExit }) {
  const options = React.useMemo(() => [
    {
      value: 'enter',
      tooltip: 'Enter',
      selected: enter,
      onClick: stop(() => setEnter(!enter)),
      children: <Common.DoorEnterIcon size="xs" color="currentColor" />
    },
    {
      value: 'exit',
      tooltip: 'Exit',
      selected: exit,
      onClick: stop(() => setExit(!exit)),
      children: <Common.DoorExitIcon size="xs" color="currentColor" />
    }
  ], [enter, exit, setEnter, setExit])

  return (
    <ButtonGroup options={options} multiple />
  )
}

export default AnimationToggleControl
