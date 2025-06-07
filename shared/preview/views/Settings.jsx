import { Flex } from '@preview/components'
import NavSidebar from '@preview/components/settings/NavSidebar'
import UserProfileSection from '@preview/components/settings/UserProfileSection'
import SwitchesSection from '@preview/components/settings/SwitchesSection'

function Settings () {
  return (
    <Flex bg="background-tertiary">
      <NavSidebar active={1} />
      <UserProfileSection />
      {/*<SwitchesSection />*/}
    </Flex>
  )
}

export default Settings
