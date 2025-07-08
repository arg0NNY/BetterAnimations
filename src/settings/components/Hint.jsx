import IconButton from '@/settings/components/IconButton'
import CircleQuestionIcon from '@/settings/components/icons/CircleQuestionIcon'
import { handleClick } from '@discord/modules'
import useConfig from '@/hooks/useConfig'

function Hint ({ href, onClick, ...props }) {
  const { config } = useConfig()
  if (config.general.disableHints) return null

  return (
    <IconButton
      onClick={href ? () => handleClick({ href }) : () => {}}
      {...props}
    >
      <CircleQuestionIcon size="xs" color="currentColor" />
    </IconButton>
  )
}

export default Hint
