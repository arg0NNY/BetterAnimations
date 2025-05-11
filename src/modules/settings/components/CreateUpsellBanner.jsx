import { Button, handleClick, Text } from '@/modules/DiscordModules'
import { css } from '@/modules/Style'
import Documentation from '@/modules/Documentation'
import PackPicture from '@/modules/settings/components/PackPicture'
import BookIcon from '@/modules/settings/components/icons/BookIcon'

function CreateUpsellBanner () {
  return (
    <div className="BA__createUpsellBanner">
      <div class="BA__createUpsellArtContainer">
        <PackPicture className="BA__createUpsellArt" />
      </div>
      <div class="BA__mainColumn">
        <Text
          tag="h3"
          variant="heading-lg/extrabold"
          color="currentColor"
        >
          Create your own Animation Packs
        </Text>
        <Text
          variant="text-sm/normal"
          color="currentColor"
        >
          Build your own animations and publish them to the official Catalog
          for everyone to download and use
        </Text>
      </div>
      <Button
        className="BA__createUpsellButton"
        innerClassName="BA__buttonContents"
        color={Button.Colors.BRAND_INVERTED}
        onClick={() => handleClick({ href: Documentation.createUrl })}
      >
        <BookIcon size="sm" color="currentColor" />
        Documentation
      </Button>
    </div>
  )
}

export default CreateUpsellBanner

css
`.BA__createUpsellBanner {
    align-items: center;
    background: linear-gradient(187deg, #5865F2, #2F379F);
    background-size: cover;
    border-radius: var(--radius-sm);
    flex-direction: row;
    padding-right: 24px;
}

.BA__createUpsellBanner, .BA__mainColumn {
    display: flex;
    justify-content: center;
}

.BA__mainColumn {
    color: var(--white-100);
    flex: 1;
    flex-direction: column;
    margin: auto 0;
    min-height: 96px;
    padding: 16px 16px 16px 4px;
}

.BA__createUpsellBanner h3 {
    margin-bottom: 4px;
}

.BA__createUpsellButton {
    padding: 11px 20px;
}

.BA__createUpsellButton:hover {
    opacity: .9;
}

.BA__createUpsellArtContainer {
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-basis: 124px;
    height: 100px;
    position: relative;
}

.BA__createUpsellArt {
    width: 129px;
    bottom: -46px;
    left: -15px;
    object-fit: contain;
    pointer-events: none;
    position: absolute;
}`
`CreateUpsellBanner`
