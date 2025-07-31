import { css } from '@style'
import { FloatingLayer } from '@preview/components/Floating'
import { Block, Button, Flex, Icon, Text } from '@preview/components'
import Tabs from '@preview/components/Tabs'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import AnimeContainer from '@components/AnimeContainer'
import { useRef } from 'react'
import PreviewTransition from '@preview/components/PreviewTransition'
import useStages from '@preview/hooks/useStages'

function Modal ({ children, ...props }) {
  const containerRef = useRef()

  const [module] = useModule(ModuleKey.Modals)

  return (
    <PreviewTransition
      module={module}
      containerRef={containerRef}
      {...props}
    >
      <FloatingLayer className="BAP__modalLayer">
        <AnimeContainer
          ref={containerRef}
          id={ModuleKey.Modals}
          container={{ className: 'BAP__modalContainer' }}
        >
          <div className="BAP__modal">
            {children}
          </div>
        </AnimeContainer>
      </FloatingLayer>
    </PreviewTransition>
  )
}

function UserModal (props) {
  return (
    <Modal {...props}>
      <Block h={780} relative>
        <Block h={210} bg="brand-primary" />
        <Icon absolute size={120} top={145} left={24} radius="50%"
              color="brand-primary"
              boxShadow="0 0 0 8px var(--bap-background-primary)" />
        <Block px={16} py={22}>
          <Flex justify="flex-end" gap={8} mb={22}>
            <Button width={32} color="text-primary" />
            <Button width={120} />
          </Flex>

          <Text length={124} height={24} color="text-heading" />
          <Text length={166} mt={8} />

          <Tabs tabs={[59, 112, 95]} active={0} mt={34} mb={18} />

          <Text length={162} />

          <Text length={76} height={12} color="text-heading" mt={22} mb={8} />
          <Text length={334} />
          <Text length={216} mt={4} />

          <Text length={128} height={12} color="text-heading" mt={22} mb={8} />
          <Text length={171} />
          <Text length={92} mt={4} />
        </Block>
      </Block>
    </Modal>
  )
}

function Backdrop (props) {
  const layerRef = useRef()

  const [module] = useModule(ModuleKey.ModalsBackdrop)

  return (
    <PreviewTransition
      module={module}
      containerRef={layerRef}
      defaultLayoutStyles={false}
      {...props}
    >
      <FloatingLayer ref={layerRef} className="BAP__backdropLayer">
        <div className="BAP__backdrop" />
      </FloatingLayer>
    </PreviewTransition>
  )
}

function Modals () {
  const [, isActive] = useModule(ModuleKey.Modals)
  const [, isBackdropActive] = useModule(ModuleKey.ModalsBackdrop)

  const stage = useStages(2, isActive || isBackdropActive)

  if (!isActive && !isBackdropActive) return null

  return (
    <>
      <Backdrop in={!!stage} />
      <UserModal in={!!stage} />
    </>
  )
}

export default Modals

css
`.BAP__modalLayer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px 0;
}
.BAP__modalContainer {
    min-height: 0;
}
.BAP__modal {
    background-color: var(--bap-background-primary);
    border-radius: 8px;
    overflow: clip;
    width: 600px;
    min-height: 220px;
    pointer-events: all;
    max-height: 100%;
    display: flex;
    flex-direction: column;
}
.BAP__backdropLayer {
    pointer-events: all;
}
.BAP__backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.7);
}`
`Preview: Modals`
