import { Flex } from '@preview/components'
import NavSidebar from '@preview/components/settings/NavSidebar'
import UserProfileSection from '@preview/components/settings/UserProfileSection'

function Settings () {
  return (
    <Flex bg="background-tertiary">
      <NavSidebar active={1} />
      <UserProfileSection />
    </Flex>
  )
}

export default Settings
