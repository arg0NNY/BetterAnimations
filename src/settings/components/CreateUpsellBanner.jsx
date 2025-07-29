import { Button, handleClick, Text } from '@discord/modules'
import { css } from '@style'
import Documentation from '@shared/documentation'
import PackPicture from '@/settings/components/pack/PackPicture'
import BookIcon from '@/components/icons/BookIcon'
import classNames from 'classnames'

function CreateUpsellBanner ({ className }) {
  return (
    <div className={classNames('BA__createUpsellBanner', className)}>
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
        variant="overlay-primary"
        icon={BookIcon}
        text="Documentation"
        onClick={() => handleClick({ href: Documentation.createUrl })}
      />
    </div>
  )
}

export default CreateUpsellBanner

css
`.BA__createUpsellBanner {
    align-items: center;
    background: linear-gradient(187deg, #5865F2, #2F379F);
    background-size: cover;
    border-radius: 16px;
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
