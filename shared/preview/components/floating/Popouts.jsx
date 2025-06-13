import { css } from '@style'
import Floating from '@preview/components/Floating'
import { Block, Button, Flex, Icon, Text } from '@preview/components'
import useModule from '@preview/hooks/useModule'
import ModuleKey from '@enums/ModuleKey'
import { use, useEffect, useRef } from 'react'
import PreviewContext from '@preview/context/PreviewContext'
import useStages from '@preview/hooks/useStages'
import PreviewTransition from '@preview/components/PreviewTransition'
import Position from '@enums/Position'

function UserPopout (props) {
  return (
    <Floating {...props}>
      <div className="BAP__userPopout">
        <Block h={105} bg="brand-primary" />
        <Icon absolute size={82} top={60} left={15} radius="50%"
              color="brand-primary"
              boxShadow="0 0 0 5px var(--bap-background-surface-overlay)" />
        <Flex column pt={54} px={16} pb={16} flex={1}>
          <Text length={225} height={24} color="text-heading" />
          <Text length={169} mt={12} />
          <Flex gap={4} mt={16}>
            <Text length={34} color="text-heading" />
            <Text length={106} />
          </Flex>
          <Block mt="auto" h={44} radius={3} bg="background-primary" borderWidth={1} />
        </Flex>
      </div>
    </Floating>
  )
}

function ThreadsPopout (props) {
  return (
    <Floating {...props}>
      <div className="BAP__threadsPopout">
        <Flex h={48} px={16} justify="space-between" align="center" borderBottomWidth={1}>
          <Flex gap={10} center>
            <Icon color="text-heading" />
            <Text length={167} color="text-heading" />
          </Flex>
          <Icon size={26} />
        </Flex>
        <Flex column center flex={1}>
          <Icon size={84} radius="50%" color="background-primary" />
          <Text length={225} height={24} color="text-heading" mt={20} />
          <Text length={299} mt={14} />
          <Text length={265} mt={6} />
          <Button width={118} height={36} mt={24} />
        </Flex>
      </div>
    </Floating>
  )
}

function Popouts () {
  const {
    channelHeaderItemRefs,
    memberListItemRefs,
    setMemberList,
    setThreadPopoutShown
  } = use(PreviewContext)

  const userPopoutRef = useRef()
  const threadPopoutRef = useRef()

  const [module, isActive] = useModule(ModuleKey.Popouts)
  const stage = useStages(4, isActive)

  const memberListItemIndex = 0
  useEffect(() => {
    if (isActive) setMemberList(stage === 1 ? { active: memberListItemIndex } : {})
  }, [stage])

  const channelHeaderItemIndex = 0
  useEffect(() => {
    if (isActive) setThreadPopoutShown(stage === 3)
  }, [stage])

  if (!isActive) return null

  return (
    <>
      <PreviewTransition
        in={stage === 1}
        module={module}
        containerRef={userPopoutRef}
        anchor={() => memberListItemRefs.current[memberListItemIndex]}
        auto={{
          position: Position.Left,
          align: Position.Top
        }}
      >
        <UserPopout
          ref={userPopoutRef}
          top={120}
          right={272}
        />
      </PreviewTransition>
      <PreviewTransition
        in={stage === 3}
        module={module}
        containerRef={threadPopoutRef}
        anchor={() => channelHeaderItemRefs.current[channelHeaderItemIndex]}
        auto={{
          position: Position.Bottom,
          align: Position.Right
        }}
      >
        <ThreadsPopout
          ref={threadPopoutRef}
          top={81}
          right={392}
        />
      </PreviewTransition>
    </>
  )
}

export default Popouts

css
`.BAP__userPopout {
    width: 300px;
    height: 380px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, .24);
    background-color: var(--bap-background-surface-overlay);
    overflow: clip;
}

.BAP__threadsPopout {
    width: 534px;
    height: 448px;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 0 0 1px var(--bap-border-subtle),
        0 12px 24px 0 rgba(0, 0, 0, .24);
    background-color: var(--bap-background-surface-overlay);
    overflow: clip;
}`
`Preview: Popouts`
