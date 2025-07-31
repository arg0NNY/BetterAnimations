import Toast, { ToastTypes } from '@/components/Toast'
import { Button, TextButton } from '@discord/modules'
import useEmitterEffect from '@/hooks/useEmitterEffect'
import Events from '@enums/Events'
import ErrorManager from '@error/manager'
import { css } from '@style'

function ErrorToast ({ onView }) {
  useEmitterEffect(Events.ErrorOccurred)

  const count = ErrorManager.errors.length
  const text = count > 1
    ? `${count}${ErrorManager.errorsOverload ? '+' : ''} errors occurred.`
    : 'An error occurred.'

  return (
    <Toast type={ToastTypes.ERROR} text={text}>
      <div class="BA__errorToastButton">
        <TextButton
          className="BA__errorToastButton"
          text="View"
          onClick={onView}
        />
      </div>
    </Toast>
  )
}

export default ErrorToast

css
`.BA__errorToastButton {
    display: flex;
    align-items: center;
    padding: 0 16px;
}`
`ErrorToast`
