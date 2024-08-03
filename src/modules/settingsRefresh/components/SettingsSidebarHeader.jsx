import IconBrand from '@/components/icons/IconBrand'
import { css } from '@/modules/Style'
import { Common } from '@/modules/DiscordModules'

function SettingsSidebarHeader () {
  return (
    <div className="BA__settingsSidebarHeader">
      <IconBrand />
      <Common.Text variant="text-md/semibold">etterAnimations</Common.Text>
    </div>
  )
}

export default SettingsSidebarHeader

css
`.BA__settingsSidebarHeader {
    position: relative;
    margin-top: -30px;
    padding-bottom: 10px;
}
    
.BA__settingsSidebarHeader > svg {
    display: block;
    width: 52px;
    height: 52px;
}

.BA__settingsSidebarHeader > div {
    position: absolute;
    top: 26px;
    left: 41px;
    color: var(--header-primary);
}`
`SettingsSidebarHeader`
