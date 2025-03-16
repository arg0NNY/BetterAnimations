import {
  Button,
  Heading,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalRoot,
  Tooltip
} from '@/modules/DiscordModules'
import IconBrand from '@/components/icons/IconBrand'
import { css } from '@/modules/Style'
import meta from '@/meta'

function Modal ({ title, children, onClose, ...props }) {
  return (
    <ModalRoot
      className="BA__modal"
      {...props}
    >
      <ModalHeader separator={false}>
        <Tooltip
          text={meta.name}
          position="bottom"
          align="left"
        >
          {props => (
            <IconBrand
              {...props}
              className="BA__modalIcon"
              size="custom"
              width={36}
              height={36}
            />
          )}
        </Tooltip>
        <Heading variant="heading-lg/semibold">
          {title}
        </Heading>
      </ModalHeader>
      <ModalContent className="BA__modalContent">
        {children}
      </ModalContent>
      <ModalFooter>
        <Button
          type="submit"
          color={Button.Colors.PRIMARY}
          onClick={onClose}
        >
          Close
        </Button>
      </ModalFooter>
    </ModalRoot>
  )
}

export default Modal

css
`.BA__modalIcon {
    margin-right: 4px;
}

.BA__modalContent {
    padding-bottom: 20px;
}`
`Modal`