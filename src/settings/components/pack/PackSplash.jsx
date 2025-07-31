import usePackRegistry from '@/hooks/usePackRegistry'
import { Tooltip } from '@discord/modules'
import classNames from 'classnames'
import { css } from '@style'
import thumbnailPlaceholder from '@/assets/placeholders/thumbnail.png'

function PackSplash ({ pack, showAuthor = false, className }) {
  const registry = usePackRegistry()

  return (
    <div className={classNames('BA__packSplash', className)}>
      <img
        className="BA__packSplashImage"
        src={registry.getThumbnailSrc(pack)}
        onError={event => event.currentTarget.src = thumbnailPlaceholder}
        alt={pack.name}
        loading="lazy"
        draggable="false"
      />
      {showAuthor && (
        <Tooltip text={pack.author}>
          {props => (
            <div
              {...props}
              className="BA__packSplashAuthor"
            >
              <img
                className="BA__packAuthorAvatar"
                src={registry.getAuthorAvatarSrc(pack)}
                alt={pack.author}
                draggable="false"
              />
            </div>
          )}
        </Tooltip>
      )}
    </div>
  )
}

export default PackSplash

css
`.BA__packSplash {
    background: linear-gradient(180deg, rgba(68, 70, 73, 0), rgba(68, 70, 73, .4));
    aspect-ratio: 16 / 9;
    position: relative;
}
.BA__packSplashImage {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.BA__packSplashAuthor {
    position: absolute;
    right: 20px;
    bottom: -16px;
    z-index: 2;
    border-radius: 50%;
    box-shadow: 0 0 0 5px currentColor;
}`
`PackSplash`
