import SystemBar from '@preview/components/main/SystemBar'
import ServerList from '@preview/components/main/ServerList'
import { Flex } from '@preview/components'
import Server from '@preview/components/main/Server'
import UserPanel from '@preview/components/main/UserPanel'
import { server } from '@preview/data'
import { useMemo } from 'react'

function Main () {
  const data = useMemo(server.alt, [])

  return (
    <Flex column>
      <SystemBar />
      <Flex align="stretch" flex={1}>
        <ServerList />
        <Server {...data} />
      </Flex>
      <UserPanel />
    </Flex>
  )
}

export default Main
