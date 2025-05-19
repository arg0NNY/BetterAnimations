import Toast, { ToastTypes } from '@/components/Toast'
import { Button } from '@/modules/DiscordModules'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@enums/Events'
import ErrorManager from '@error/manager'

function ErrorToast ({ onView }) {
  useEmitterEffect(Events.ErrorOccurred)

  const count = ErrorManager.errors.length
  const text = count > 1
    ? `${count}${ErrorManager.errorsOverload ? '+' : ''} errors occurred.`
    : 'An error occurred.'

  return (
    <Toast type={ToastTypes.ERROR} text={text}>
      <Button
        look={Button.Looks.LINK}
        size={Button.Sizes.SMALL}
        onClick={onView}
      >
        View
      </Button>
    </Toast>
  )
}

export default ErrorToast
