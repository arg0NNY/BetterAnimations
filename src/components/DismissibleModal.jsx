import useDismissible from '@/hooks/useDismissible'
import Modal from '@/components/Modal'
import { useState } from 'react'
import { Checkbox, Text } from '@discord/modules'

function DismissibleModal ({ name, ...props }) {
  const [, setIsDismissed] = useDismissible(name)
  const [shouldDismiss, setShouldDismiss] = useState(false)

  const onConfirm = (...args) => {
    props.onConfirm?.(...args)
    if (shouldDismiss) setIsDismissed(true)
  }

  return (
    <Modal
      {...props}
      onConfirm={onConfirm}
      footerLeading={(
        <Checkbox
          value={shouldDismiss}
          onChange={(_, value) => setShouldDismiss(value)}
        >
          <Text variant="text-sm/normal">Don't show again</Text>
        </Checkbox>
      )}
    />
  )
}

export default DismissibleModal
