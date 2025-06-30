import { css } from '@style'
import PackPicture from '@/settings/components/PackPicture'
import { Button, handleClick, Text } from '@discord/modules'
import SettingsSection from '@enums/SettingsSection'
import ShopIcon from '@/settings/components/icons/ShopIcon'
import Documentation from '@shared/documentation'
import BookIcon from '@/settings/components/icons/BookIcon'
import ExternalLinkIcon from '@/settings/components/icons/ExternalLinkIcon'
import { useSection } from '@/settings/stores/SettingsStore'

function NoPacksPlaceholder () {
  const [section, setSection] = useSection()

  return (
    <div className="BA__noPacks">
      <PackPicture className="BA__noPacksPicture" />
      <div class="BA__noPacksContent">
        <Text
          className="BA__noPacksTitle"
          variant="heading-xl/bold"
        >
          Install Animation Packs
        </Text>
        <Text
          className="BA__noPacksDescription"
          variant="text-md/normal"
        >
          Expand your animation library with collections
          of&nbsp;community-made animations
        </Text>
        <div class="BA__noPacksActions">
          <Button
            innerClassName="BA__buttonContents"
            onClick={() => setSection(SettingsSection.Catalog)}
          >
            <ShopIcon size="sm" color="currentColor" />
            Catalog
          </Button>
          <Button
            color={Button.Colors.PRIMARY}
            innerClassName="BA__buttonContents"
            onClick={() => handleClick({ href: Documentation.packDirectoryUrl })}
          >
            <BookIcon size="sm" color="currentColor" />
            Pack Directory
            <ExternalLinkIcon size="sm" color="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NoPacksPlaceholder

css
`.BA__noPacks {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 48px;
    justify-content: center;
}
.BA__noPacksContent {
    padding-bottom: 20px;
}
.BA__noPacksPicture {
    flex-shrink: 0;
}
.BA__noPacksDescription {
    margin-top: 8px;
    max-width: 360px;
}
.BA__noPacksActions {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}`
`NoPacksPlaceholder`
