import { ModalSize } from '@/modules/DiscordModules'
import Modal from '@/components/Modal'
import ErrorDetails from '@/components/error/ErrorDetails'
import { css } from '@/modules/Style'

function ErrorModal ({ errors = [], ...props }) {
  return (
    <Modal
      title="Error Inspector"
      size={ModalSize.MEDIUM}
      confirmText="Dismiss"
      {...props}
    >
      <div className="BA__errorModalList">
        {errors.map(error => (
          <ErrorDetails error={error} open={errors.length <= 1} />
        ))}
      </div>
    </Modal>
  )
}

export default ErrorModal

css
`.BA__errorModalList {
    display: flex;
    flex-direction: column;
    gap: 16px;
}`
`ErrorModal`
