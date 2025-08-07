import { css } from '@style'
import IconButton from '@/settings/components/IconButton'
import CircleDollarSignIcon from '@/components/icons/CircleDollarSignIcon'
import CircleQuestionIcon from '@/components/icons/CircleQuestionIcon'
import GitHubIcon from '@/components/icons/GitHubIcon'
import BetterDiscordIcon from '@/components/icons/BetterDiscordIcon'
import { Clickable, CopiableField, handleClick, Text } from '@discord/modules'
import meta from '@/meta'
import DiscordSelectors from '@discord/selectors'
import { useMemo } from 'react'
import { UI } from '@/BdApi'

function tryGetBDVersion () {
  for (const node of document.querySelectorAll(`${DiscordSelectors.StandardSidebarView.sidebar} .bd-text-muted`)) {
    const [, version] = node.innerText.match(/^BetterDiscord (\S+)$/) ?? []
    if (version) return version
  }
  return null
}

function SocialLinks () {
  return (
    <div className="BA__settingsSidebarFooterLinks">
      <IconButton
        tooltip="Donate"
        onClick={() => handleClick({ href: meta.donate })}
      >
        <CircleDollarSignIcon size="sm" color="currentColor" />
      </IconButton>
      <IconButton
        tooltip="Support Server"
        onClick={() => UI.showInviteModal(meta.invite)}
      >
        <CircleQuestionIcon size="sm" color="currentColor" />
      </IconButton>
      <IconButton
        tooltip="GitHub"
        onClick={() => handleClick({ href: meta.source })}
      >
        <GitHubIcon size="sm" color="currentColor" />
      </IconButton>
      <IconButton
        tooltip="BetterDiscord"
        onClick={() => handleClick({ href: 'https://betterdiscord.app/plugin/BetterAnimations' })}
      >
        <BetterDiscordIcon size="sm" color="currentColor" />
      </IconButton>
    </div>
  )
}

function SystemInfo () {
  const data = useMemo(() => {
    const bdVersion = tryGetBDVersion()
    return [
      `${meta.name} ${meta.version}` + (import.meta.env.MODE === 'development' ? ' (Dev Bundle)' : ''),
      bdVersion && `BetterDiscord ${bdVersion}`
    ].filter(Boolean)
  }, [])

  return (
    <CopiableField
      text="Click to copy"
      copyValue={data.join('\n')}
    >
      {props => (
        <Clickable
          {...props}
          tag="div"
          className="BA__settingsSidebarFooterSystemInfo"
        >
          {data.map((text, i) => (
            <Text
              key={i}
              variant="text-xs/normal"
              color="text-muted"
            >
              {text}
            </Text>
          ))}
        </Clickable>
      )}
    </CopiableField>
  )
}

function SettingsSidebarFooter () {
  return (
    <div className="BA__settingsSidebarFooter">
      <SocialLinks />
      <SystemInfo />
    </div>
  )
}

export default SettingsSidebarFooter

css
`.BA__settingsSidebarFooter {
    padding: 8px 10px;
}
.BA__settingsSidebarFooterLinks {
    display: flex;
    align-items: center;
    gap: 8px;
}
.BA__settingsSidebarFooterSystemInfo {
    margin-top: 16px;
    cursor: pointer;
}`
`SidebarFooter`
