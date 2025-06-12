import SystemBar from '@preview/components/main/SystemBar'
import { Flex } from '@preview/components'
import { css } from '@style'
import Tooltips from '@preview/components/main/Tooltips'
import Content from '@preview/components/main/Content'
import Popouts from '@preview/components/main/Popouts'

function Main () {
  return (
    <Flex column>
      <SystemBar />
      <Content />
      <Tooltips />
      <Popouts />
    </Flex>
  )
}

export default Main

css
`.BAP__content {
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1;
    min-height: 0;
}`
`Preview: Main`
