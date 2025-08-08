import IconButton from '@/settings/components/IconButton'
import { handleClick } from '@discord/modules'
import meta from '@/meta'
import CircleDollarSignIcon from '@/components/icons/CircleDollarSignIcon'
import { UI } from '@/BdApi'
import CircleQuestionIcon from '@/components/icons/CircleQuestionIcon'
import GitHubIcon from '@/components/icons/GitHubIcon'
import BetterDiscordIcon from '@/components/icons/BetterDiscordIcon'
import Documentation from '@shared/documentation'
import BookIcon from '@/components/icons/BookIcon'
import { css } from '@style'

function SocialLinks () {
  return (
    <div className="BA__socialLinks">
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
      <IconButton
        tooltip="Documentation"
        onClick={() => handleClick({ href: Documentation.homeUrl })}
        style={{ margin: '0 -2px' }}
      >
        <BookIcon size="sm" color="currentColor" />
      </IconButton>
    </div>
  )
}

export default SocialLinks

css
`.BA__socialLinks {
    display: flex;
    align-items: center;
    gap: 8px;
}`
`SocialLinks`
