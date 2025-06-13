import SystemBar from '@preview/components/main/SystemBar'
import { Flex } from '@preview/components'
import Content from '@preview/components/main/Content'

function Main () {
  return (
    <Flex column>
      <SystemBar />
      <Content />
    </Flex>
  )
}

export default Main
